package com.fluenthire.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fluenthire.entity.Analysis;
import com.fluenthire.entity.InterviewSessionResult;
import com.fluenthire.exception.ForbiddenAccessException;
import com.fluenthire.exception.ResourceNotFoundException;
import com.fluenthire.exception.TtsException;
import com.fluenthire.repository.AnalysisRepository;
import com.fluenthire.repository.InterviewSessionResultRepository;
import io.sentry.Sentry;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class TtsService {

    private static final String TTS_URL = "https://api.openai.com/v1/audio/speech";
    private static final String WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions";
    private static final int MAX_INPUT_LENGTH = 4096;

    private final AnalysisRepository analysisRepository;
    private final InterviewSessionResultRepository interviewSessionResultRepository;
    private final ObjectMapper objectMapper;
    private final ApiCostTracker costTracker;

    @Value("${openai.api-key}")
    private String apiKey;

    private RestClient ttsClient;
    private RestClient whisperClient;

    @PostConstruct
    public void init() {
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(
                HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(30)).build());
        requestFactory.setReadTimeout(Duration.ofSeconds(60));

        this.ttsClient = RestClient.builder()
                .requestFactory(requestFactory)
                .baseUrl(TTS_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .build();
        this.whisperClient = RestClient.builder()
                .requestFactory(requestFactory)
                .baseUrl(WHISPER_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .build();
    }

    @Transactional
    public byte[] getOrGenerateAudio(Long analysisId, String email) {
        Analysis analysis = analysisRepository.findByIdWithUser(analysisId)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found with id: " + analysisId));

        // Verify ownership
        String ownerEmail = analysis.getUserResponse().getUser().getEmail();
        if (!Objects.equals(ownerEmail, email)) {
            throw new ForbiddenAccessException("You don't have access to this analysis");
        }

        // Return cached audio if available
        if (analysis.getTtsAudioData() != null) {
            log.info("TTS cache hit for analysis {}", analysisId);
            return analysis.getTtsAudioData();
        }

        // Generate audio
        String text = analysis.getImprovedResponse();
        byte[] audio = synthesize(text);
        analysis.setTtsAudioData(audio);

        // Generate word timestamps from the audio using Whisper
        double whisperCost = 0;
        String timestamps = extractWordTimestamps(audio);
        if (timestamps != null) {
            analysis.setTtsWordTimestamps(timestamps);
            double estimatedMinutes = text.length() / 900.0; // ~150 words/min, ~6 chars/word
            whisperCost = ApiCostTracker.whisperCost(estimatedMinutes);
        }

        // Record per-request cost: TTS + Whisper timestamps bundled
        costTracker.record(ApiCostTracker.RequestCostRecord.builder()
                .feature("qa-practice-tts")
                .ttsCost(ApiCostTracker.ttsCost(text.length()))
                .whisperCost(whisperCost)
                .build());

        analysisRepository.save(analysis);

        log.info("TTS generated and cached for analysis {} ({} bytes)", analysisId, audio.length);
        return audio;
    }

    @Transactional(readOnly = true)
    public String getWordTimestamps(Long analysisId, String email) {
        Analysis analysis = analysisRepository.findByIdWithUser(analysisId)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found with id: " + analysisId));

        String ownerEmail = analysis.getUserResponse().getUser().getEmail();
        if (!Objects.equals(ownerEmail, email)) {
            throw new ForbiddenAccessException("You don't have access to this analysis");
        }

        return analysis.getTtsWordTimestamps();
    }

    @Transactional
    public byte[] getOrGenerateInterviewResultAudio(Long resultId, String email) {
        InterviewSessionResult result = interviewSessionResultRepository.findByIdWithUser(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview result not found with id: " + resultId));

        String ownerEmail = result.getInterviewSession().getUser().getEmail();
        if (!Objects.equals(ownerEmail, email)) {
            throw new ForbiddenAccessException("You don't have access to this interview result");
        }

        if (result.getTtsAudioData() != null) {
            log.info("TTS cache hit for interview result {}", resultId);
            return result.getTtsAudioData();
        }

        String text = result.getImprovedResponse();
        byte[] audio = synthesize(text);
        result.setTtsAudioData(audio);

        double whisperCost = 0;
        String timestamps = extractWordTimestamps(audio);
        if (timestamps != null) {
            result.setTtsWordTimestamps(timestamps);
            double estimatedMinutes = text.length() / 900.0;
            whisperCost = ApiCostTracker.whisperCost(estimatedMinutes);
        }

        costTracker.record(ApiCostTracker.RequestCostRecord.builder()
                .feature("ai-interview-tts")
                .ttsCost(ApiCostTracker.ttsCost(text.length()))
                .whisperCost(whisperCost)
                .build());

        interviewSessionResultRepository.save(result);

        log.info("TTS generated and cached for interview result {} ({} bytes)", resultId, audio.length);
        return audio;
    }

    @Transactional(readOnly = true)
    public String getInterviewResultWordTimestamps(Long resultId, String email) {
        InterviewSessionResult result = interviewSessionResultRepository.findByIdWithUser(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview result not found with id: " + resultId));

        String ownerEmail = result.getInterviewSession().getUser().getEmail();
        if (!Objects.equals(ownerEmail, email)) {
            throw new ForbiddenAccessException("You don't have access to this interview result");
        }

        return result.getTtsWordTimestamps();
    }

    private byte[] synthesize(String text) {
        try {
            String input = text.length() > MAX_INPUT_LENGTH
                    ? truncateAtSentence(text, MAX_INPUT_LENGTH)
                    : text;

            byte[] audio = ttsClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "model", "tts-1",
                            "input", input,
                            "voice", "onyx"
                    ))
                    .retrieve()
                    .body(byte[].class);

            if (audio == null || audio.length == 0) {
                throw new TtsException("OpenAI returned empty audio response.");
            }

            return audio;

        } catch (TtsException e) {
            throw e;
        } catch (Exception e) {
            log.error("TTS synthesis failed: {}", e.getMessage(), e);
            Sentry.captureException(e);
            throw new TtsException("Failed to generate audio. Please try again.", e);
        }
    }

    /**
     * Run the TTS audio through Whisper with word-level timestamps.
     * Returns JSON array: [{"word":"Hello","start":0.0,"end":0.42}, ...]
     */
    private String extractWordTimestamps(byte[] audioData) {
        try {
            ByteArrayResource audioResource = new ByteArrayResource(audioData) {
                @Override
                public String getFilename() {
                    return "tts_audio.mp3";
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", audioResource);
            body.add("model", "whisper-1");
            body.add("language", "en");
            body.add("response_format", "verbose_json");
            body.add("timestamp_granularities[]", "word");

            String response = whisperClient.post()
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            JsonNode json = objectMapper.readTree(response);
            JsonNode words = json.get("words");

            if (words != null && words.isArray()) {
                return objectMapper.writeValueAsString(words);
            }

            log.warn("Whisper response missing 'words' array for timestamp extraction");
            return null;

        } catch (Exception e) {
            log.warn("Failed to extract word timestamps (non-critical): {}", e.getMessage());
            return null;
        }
    }

    private String truncateAtSentence(String text, int maxLength) {
        String truncated = text.substring(0, maxLength);
        int lastPeriod = truncated.lastIndexOf('.');
        if (lastPeriod > maxLength / 2) {
            return truncated.substring(0, lastPeriod + 1);
        }
        return truncated;
    }
}
