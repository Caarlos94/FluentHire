package com.fluenthire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class GrowthResponse {

    // Demographics
    private Map<String, Long> experienceLevelDistribution;
    private Map<String, Long> roleTypeDistribution;
    private Map<String, Long> mainLanguageDistribution;

    // Most practiced question categories
    private Map<String, Long> categoryPopularity;

    // Questions with highest/lowest avg scores (top 5 each)
    private List<QuestionScoreDto> highestScoredQuestions;
    private List<QuestionScoreDto> lowestScoredQuestions;

    // Registration method split
    private int emailRegistrations;
    private int googleRegistrations;

    // Subscription cancellation analysis
    private int totalCancellations;
    private double avgDaysBeforeCancel;

    // Peak usage hours (hour 0-23 → count)
    private Map<Integer, Long> peakUsageHours;

    // Live interview format + category distribution
    private Map<String, Long> interviewFormatDistribution;
    private Map<String, Long> interviewCategoryDistribution;
}
