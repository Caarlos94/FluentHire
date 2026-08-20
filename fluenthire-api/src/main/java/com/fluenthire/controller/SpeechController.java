package com.fluenthire.controller;

import com.fluenthire.dto.TranscriptionResponse;
import com.fluenthire.service.TranscriptionService;
import com.fluenthire.service.TtsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/speech")
@RequiredArgsConstructor
public class SpeechController {

    private final TranscriptionService transcriptionService;
    private final TtsService ttsService;

    @PostMapping("/transcribe")
    public ResponseEntity<TranscriptionResponse> transcribe(
            Authentication authentication,
            @RequestParam("audio") MultipartFile audioFile) {
        String text = transcriptionService.transcribe(audioFile);
        return ResponseEntity.ok(new TranscriptionResponse(text));
    }

    @GetMapping("/tts/{analysisId}")
    public ResponseEntity<byte[]> textToSpeech(
            Authentication authentication,
            @PathVariable Long analysisId) {
        byte[] audio = ttsService.getOrGenerateAudio(analysisId, authentication.getName());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .header(HttpHeaders.CACHE_CONTROL, "private, max-age=86400")
                .body(audio);
    }

    @GetMapping("/tts/{analysisId}/timestamps")
    public ResponseEntity<String> getWordTimestamps(
            Authentication authentication,
            @PathVariable Long analysisId) {
        String timestamps = ttsService.getWordTimestamps(analysisId, authentication.getName());
        if (timestamps == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.CACHE_CONTROL, "private, max-age=86400")
                .body(timestamps);
    }

    @GetMapping("/tts/interview-result/{resultId}")
    public ResponseEntity<byte[]> interviewResultTextToSpeech(
            Authentication authentication,
            @PathVariable Long resultId) {
        byte[] audio = ttsService.getOrGenerateInterviewResultAudio(resultId, authentication.getName());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .header(HttpHeaders.CACHE_CONTROL, "private, max-age=86400")
                .body(audio);
    }

    @GetMapping("/tts/interview-result/{resultId}/timestamps")
    public ResponseEntity<String> getInterviewResultWordTimestamps(
            Authentication authentication,
            @PathVariable Long resultId) {
        String timestamps = ttsService.getInterviewResultWordTimestamps(resultId, authentication.getName());
        if (timestamps == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.CACHE_CONTROL, "private, max-age=86400")
                .body(timestamps);
    }
}
