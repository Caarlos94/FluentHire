package com.fluenthire.dto;

import java.time.LocalDateTime;

public record InterviewAttemptSummary(
        String sessionId,
        int communicationScore,
        int technicalScore,
        int problemSolvingScore,
        String format,       // "QUICK" or "STANDARD"
        LocalDateTime createdAt
) {}
