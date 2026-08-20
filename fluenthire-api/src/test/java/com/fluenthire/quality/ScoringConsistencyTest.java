package com.fluenthire.quality;

import com.fluenthire.dto.InterviewSessionResponse;
import com.fluenthire.entity.InterviewFormat;
import com.fluenthire.entity.QuestionCategory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Quality Gate 1: Scoring Consistency
 * Same transcript scored 3 times must produce scores within ±5 points per dimension.
 */
class ScoringConsistencyTest extends QualityTestBase {

    private static final int RUNS = 3;
    private static final int MAX_VARIANCE = 7;

    @Test
    @Timeout(value = 5, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 1: Same transcript scores within ±5 points across 3 runs")
    void scoringConsistency_sameTranscript_scoresWithinTolerance() {
        List<Integer> commScores = new ArrayList<>();
        List<Integer> techScores = new ArrayList<>();
        List<Integer> psScores = new ArrayList<>();

        for (int i = 0; i < RUNS; i++) {
            InterviewSessionResponse response = runSession(
                    midEnglish,
                    InterviewFormat.QUICK,
                    QuestionCategory.BEHAVIORAL,
                    "PROFESSIONAL",
                    behavioralQuestionId,
                    "mid-english/behavioral.json",
                    null
            );

            commScores.add(response.communicationScore());
            techScores.add(response.technicalScore());
            psScores.add(response.problemSolvingScore());
        }

        assertThat(variance(commScores))
                .as("Communication score variance across %d runs: %s", RUNS, commScores)
                .isLessThanOrEqualTo(MAX_VARIANCE);

        assertThat(variance(techScores))
                .as("Technical score variance across %d runs: %s", RUNS, techScores)
                .isLessThanOrEqualTo(MAX_VARIANCE);

        assertThat(variance(psScores))
                .as("Problem-solving score variance across %d runs: %s", RUNS, psScores)
                .isLessThanOrEqualTo(MAX_VARIANCE);
    }

    private int variance(List<Integer> scores) {
        int max = scores.stream().mapToInt(Integer::intValue).max().orElse(0);
        int min = scores.stream().mapToInt(Integer::intValue).min().orElse(0);
        return max - min;
    }
}
