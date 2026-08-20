package com.fluenthire.dto;

import java.time.LocalDateTime;

public record AttemptSummary(
        Long responseId,
        Integer attemptNumber,
        Integer communicationScore,
        Integer technicalScore,
        boolean analyzed,
        LocalDateTime createdAt
) {}
