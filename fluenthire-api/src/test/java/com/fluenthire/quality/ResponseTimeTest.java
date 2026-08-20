package com.fluenthire.quality;

import com.fluenthire.dto.InterviewSessionResponse;
import com.fluenthire.entity.InterviewFormat;
import com.fluenthire.entity.QuestionCategory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Quality Gate 6: Response Time
 * QUICK format (1 problem) must complete within 30 seconds.
 * STANDARD format would be tested with 60 seconds (uses same single-problem approach for now).
 */
class ResponseTimeTest extends QualityTestBase {

    @Test
    @Timeout(value = 2, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 6: QUICK format completes within 30 seconds")
    void quickFormat_completesWithin30Seconds() {
        long startMs = System.currentTimeMillis();

        InterviewSessionResponse response = runSession(
                midEnglish,
                InterviewFormat.QUICK,
                QuestionCategory.BEHAVIORAL,
                "PROFESSIONAL",
                behavioralQuestionId,
                "mid-english/behavioral.json",
                null
        );

        long elapsedMs = System.currentTimeMillis() - startMs;

        assertThat(response.problems()).isNotEmpty();
        assertThat(elapsedMs)
                .as("QUICK format should complete within 30 seconds (took %dms)", elapsedMs)
                .isLessThanOrEqualTo(30_000);
    }

    @Test
    @Timeout(value = 2, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 6: CODING format with code review completes within 60 seconds")
    void codingWithCode_completesWithin60Seconds() {
        long startMs = System.currentTimeMillis();

        InterviewSessionResponse response = runSession(
                seniorPortuguese,
                InterviewFormat.STANDARD,
                QuestionCategory.CODING,
                "PROFESSIONAL",
                codingQuestionId,
                "senior-portuguese/coding.json",
                "code/senior-portuguese-two-sum.py"
        );

        long elapsedMs = System.currentTimeMillis() - startMs;

        assertThat(response.problems()).isNotEmpty();
        assertThat(elapsedMs)
                .as("STANDARD format should complete within 60 seconds (took %dms)", elapsedMs)
                .isLessThanOrEqualTo(60_000);
    }
}
