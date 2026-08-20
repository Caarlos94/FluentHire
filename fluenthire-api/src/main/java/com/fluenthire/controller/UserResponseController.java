package com.fluenthire.controller;

import com.fluenthire.dto.AnalysisResponse;
import com.fluenthire.dto.ProgressResponse;
import com.fluenthire.dto.QuestionHistoryResponse;
import com.fluenthire.dto.UserResponseRequest;
import com.fluenthire.dto.UserResponseResponse;
import com.fluenthire.entity.ResponseMode;
import com.fluenthire.service.AnalysisService;
import com.fluenthire.service.UserResponseService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/responses")
@RequiredArgsConstructor
public class UserResponseController {

    private final UserResponseService userResponseService;
    private final AnalysisService analysisService;

    @PostMapping
    public ResponseEntity<UserResponseResponse> submit(
            Authentication authentication,
            @Valid @RequestBody UserResponseRequest request) {
        UserResponseResponse response = userResponseService.submit(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/attempted")
    public ResponseEntity<List<Long>> getAttemptedQuestionIds(
            Authentication authentication,
            @RequestParam(required = false) ResponseMode mode) {
        List<Long> ids = userResponseService.getAttemptedQuestionIds(authentication.getName(), mode);
        return ResponseEntity.ok(ids);
    }

    @GetMapping("/progress")
    public ResponseEntity<ProgressResponse> getProgress(Authentication authentication) {
        ProgressResponse response = userResponseService.getProgress(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/question/{questionId}/history")
    public ResponseEntity<QuestionHistoryResponse> getQuestionHistory(
            Authentication authentication,
            @PathVariable Long questionId,
            @RequestParam(required = false) ResponseMode mode) {
        QuestionHistoryResponse response = userResponseService.getQuestionHistory(authentication.getName(), questionId, mode);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/analyze")
    public ResponseEntity<AnalysisResponse> analyze(
            Authentication authentication,
            @PathVariable Long id) {
        AnalysisResponse response = analysisService.analyze(authentication.getName(), id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/analysis")
    public ResponseEntity<AnalysisResponse> getAnalysis(
            Authentication authentication,
            @PathVariable Long id) {
        AnalysisResponse response = analysisService.getExistingAnalysis(authentication.getName(), id);
        return ResponseEntity.ok(response);
    }
}
