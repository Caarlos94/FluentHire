package com.fluenthire.dto;

import java.util.List;

public record ProgressResponse(
        int totalQuestionsAttempted,
        int totalResponses,
        int totalAnalyses,
        Double averageCommunicationScore,
        Double averageTechnicalScore,
        List<QuestionHistoryResponse> questionProgress
) {}
