package com.fluenthire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductHealthResponse {

    // Active users (distinct users who practiced)
    private int dau;
    private int wau;
    private int mau;

    // Stickiness
    private double avgSessionsPerUser;

    // Mode popularity
    private int qaSessionsLast30Days;
    private int liveInterviewsLast30Days;

    // Interview duration
    private double avgInterviewDurationMinutes;

    // Q&A scores (from Analysis)
    private double avgQaCommunicationScore;
    private double avgQaTechnicalScore;

    // Live interview scores (from InterviewSessionResult)
    private double avgInterviewCommunicationScore;
    private double avgInterviewTechnicalScore;
    private double avgInterviewProblemSolvingScore;

    // Funnel
    private double onboardingCompletionRate;
    private double jdUploadRate;

    // Credit utilization
    private double creditUtilizationRate;
    private int creditsGrantedThisPeriod;
    private int creditsUsedThisPeriod;
}
