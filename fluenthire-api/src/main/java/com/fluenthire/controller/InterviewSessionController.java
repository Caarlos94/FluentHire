package com.fluenthire.controller;

import com.fluenthire.dto.InterviewAttemptSummary;
import com.fluenthire.dto.InterviewCompleteRequest;
import com.fluenthire.dto.InterviewHistoryItem;
import com.fluenthire.dto.InterviewSessionResponse;
import org.springframework.data.domain.Page;
import com.fluenthire.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/interview-sessions")
@RequiredArgsConstructor
public class InterviewSessionController {

    private static final Pattern UUID_PATTERN = Pattern.compile(
            "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$");

    private final InterviewService interviewService;

    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<InterviewSessionResponse> completeSession(
            Authentication authentication,
            @PathVariable String sessionId,
            @Valid @RequestBody InterviewCompleteRequest request) {
        validateSessionId(sessionId);
        InterviewSessionResponse response = interviewService.completeSession(
                authentication.getName(), sessionId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<InterviewSessionResponse> getSession(
            Authentication authentication,
            @PathVariable String sessionId) {
        validateSessionId(sessionId);
        InterviewSessionResponse response = interviewService.getSession(
                authentication.getName(), sessionId);
        return ResponseEntity.ok(response);
    }

    private void validateSessionId(String sessionId) {
        if (sessionId == null || !UUID_PATTERN.matcher(sessionId).matches()) {
            throw new IllegalArgumentException("Invalid session ID format");
        }
    }

    @GetMapping
    public ResponseEntity<Page<InterviewHistoryItem>> getUserHistory(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<InterviewHistoryItem> history = interviewService
                .getUserHistory(authentication.getName(), page, size);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/questions/{questionId}/attempts")
    public ResponseEntity<List<InterviewAttemptSummary>> getQuestionAttempts(
            Authentication authentication,
            @PathVariable Long questionId) {
        List<InterviewAttemptSummary> attempts = interviewService
                .getQuestionAttempts(authentication.getName(), questionId);
        return ResponseEntity.ok(attempts);
    }
}
