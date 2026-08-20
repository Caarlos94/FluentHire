package com.fluenthire.dto;

import java.time.LocalDateTime;
import java.util.List;

public record InterviewHistoryItem(
        String sessionId,
        String format,
        String category,
        int communicationScore,
        int technicalScore,
        int problemSolvingScore,
        String questionTitle,
        Long questionId,
        List<String> questionTitles,
        List<Long> questionIds,
        LocalDateTime createdAt,
        Integer durationSeconds
) {}
