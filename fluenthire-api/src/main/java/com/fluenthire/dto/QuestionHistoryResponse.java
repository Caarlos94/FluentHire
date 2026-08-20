package com.fluenthire.dto;

import java.util.List;

public record QuestionHistoryResponse(
        Long questionId,
        String questionTitle,
        String category,
        String mode,
        int totalAttempts,
        Integer latestCommunicationScore,
        Integer latestTechnicalScore,
        Integer latestProblemSolvingScore,
        Integer communicationImprovement,
        Integer technicalImprovement,
        List<AttemptSummary> attempts
) {}
