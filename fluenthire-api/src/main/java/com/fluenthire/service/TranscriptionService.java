package com.fluenthire.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fluenthire.exception.TranscriptionException;
import io.sentry.Sentry;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.net.http.HttpClient;
import java.time.Duration;

@Service
@Slf4j
public class TranscriptionService {

    private static final String WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions";
    private static final long MAX_DURATION_SECONDS = 180; // 3 minutes
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    @Value("${openai.api-key}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private RestClient restClient;

    @PostConstruct
    public void init() {
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(
                HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(30)).build());
        requestFactory.setReadTimeout(Duration.ofSeconds(60));

        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .baseUrl(WHISPER_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .build();
    }

    public String transcribe(MultipartFile audioFile) {
        validateFile(audioFile);

        try {
            String originalFilename = audioFile.getOriginalFilename();
            String filename = (originalFilename != null && !originalFilename.isBlank())
                    ? originalFilename
                    : "audio.webm";

            ByteArrayResource audioResource = new ByteArrayResource(audioFile.getBytes()) {
                @Override
                public String getFilename() {
                    return filename;
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", audioResource);
            body.add("model", "gpt-4o-transcribe");
            body.add("language", "en");
            body.add("response_format", "json");

            String response = restClient.post()
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            JsonNode json = objectMapper.readTree(response);
            String text = json.path("text").asText("").trim();

            if (text.isEmpty()) {
                throw new TranscriptionException("No speech detected in the audio. Please try again.");
            }

            log.info("Transcription completed: {} characters", text.length());
            return text;

        } catch (TranscriptionException e) {
            throw e;
        } catch (Exception e) {
            log.error("Transcription failed: {}", e.getMessage(), e);
            Sentry.captureException(e);
            throw new TranscriptionException("Failed to transcribe audio. Please try again.", e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new TranscriptionException("No audio file provided.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new TranscriptionException("Audio file is too large. Maximum size is 10 MB.");
        }

        String contentType = file.getContentType();
        if (contentType != null
                && !contentType.startsWith("audio/")
                && !contentType.equals("video/webm")
                && !contentType.equals("application/octet-stream")) {
            throw new TranscriptionException("Invalid file type. Please upload an audio file.");
        }
    }
}
