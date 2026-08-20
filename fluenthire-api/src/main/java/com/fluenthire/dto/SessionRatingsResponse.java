package com.fluenthire.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class SessionRatingsResponse {

    private double avgRatingQaPractice;
    private int totalQaPracticeRatings;

    private double avgRatingInterview;
    private int totalInterviewRatings;

    private double avgRatingInterviewCoding;
    private int totalInterviewCodingRatings;

    private double avgRatingInterviewBehavioral;
    private int totalInterviewBehavioralRatings;

    private List<LowRatingEntry> lowRatings;

    @Getter
    @Setter
    @AllArgsConstructor
    @Builder
    public static class LowRatingEntry {
        private Long id;
        private int rating;
        private String feedback;
        private String mode;
        private String category;
        private String userFirstName;
        private String userEmail;
        private LocalDateTime createdAt;
    }
}
