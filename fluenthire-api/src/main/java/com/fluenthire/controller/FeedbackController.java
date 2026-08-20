package com.fluenthire.controller;

import com.fluenthire.dto.FeedbackRequest;
import com.fluenthire.dto.FeedbackResponse;
import com.fluenthire.entity.FeedbackCategory;
import com.fluenthire.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/api/feedback")
    public ResponseEntity<FeedbackResponse> createFeedback(
            Authentication authentication,
            @Valid @RequestBody FeedbackRequest request) {

        FeedbackResponse response =
                feedbackService.submitFeedback(authentication.getName(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/admin/feedback")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackResponse>> getAllFeedbacks(
            @RequestParam(required = false) FeedbackCategory category) {

        List<FeedbackResponse> feedbacks = (category != null)
                ? feedbackService.getFeedbackByCategory(category)
                : feedbackService.getAllFeedbacks();

        return ResponseEntity.ok(feedbacks);
    }
}
