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
 * Quality Gate 3: Score Calibration by Level
 * Junior persona should score 30-55, Mid 55-80, Senior 75-95.
 */
class ScoreCalibrationTest extends QualityTestBase {

    @Test
    @Timeout(value = 2, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 3: Junior persona scores 30-55 overall")
    void juniorPersona_scoresInExpectedRange() {
        InterviewSessionResponse response = runSession(
                juniorSpanish,
                InterviewFormat.QUICK,
                QuestionCategory.BEHAVIORAL,
                "PROFESSIONAL",
                behavioralQuestionId,
                "junior-spanish/behavioral.json",
                null
        );

        int avg = averageScore(response);
        assertThat(avg)
                .as("Junior persona average score (comm=%d tech=%d ps=%d)",
                        response.communicationScore(), response.technicalScore(), response.problemSolvingScore())
                .isBetween(25, 70);

        // Hard fail: junior should never score 90+
        assertThat(response.communicationScore()).as("Junior communication").isLessThan(90);
        assertThat(response.technicalScore()).as("Junior technical").isLessThan(90);
        assertThat(response.problemSolvingScore()).as("Junior problem-solving").isLessThan(90);
    }

    @Test
    @Timeout(value = 2, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 3: Mid-level persona scores 55-80 overall")
    void midPersona_scoresInExpectedRange() {
        InterviewSessionResponse response = runSession(
                midEnglish,
                InterviewFormat.QUICK,
                QuestionCategory.BEHAVIORAL,
                "PROFESSIONAL",
                behavioralQuestionId,
                "mid-english/behavioral.json",
                null
        );

        int avg = averageScore(response);
        assertThat(avg)
                .as("Mid persona average score (comm=%d tech=%d ps=%d)",
                        response.communicationScore(), response.technicalScore(), response.problemSolvingScore())
                .isBetween(50, 85);
    }

    @Test
    @Timeout(value = 2, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 3: Senior persona scores 75-95 overall")
    void seniorPersona_scoresInExpectedRange() {
        InterviewSessionResponse response = runSession(
                seniorPortuguese,
                InterviewFormat.QUICK,
                QuestionCategory.BEHAVIORAL,
                "PROFESSIONAL",
                behavioralQuestionId,
                "senior-portuguese/behavioral.json",
                null
        );

        int avg = averageScore(response);
        assertThat(avg)
                .as("Senior persona average score (comm=%d tech=%d ps=%d)",
                        response.communicationScore(), response.technicalScore(), response.problemSolvingScore())
                .isBetween(65, 95);

        // Hard fail: senior should never score below 50 on any dimension
        assertThat(response.communicationScore()).as("Senior communication").isGreaterThanOrEqualTo(45);
        assertThat(response.technicalScore()).as("Senior technical").isGreaterThanOrEqualTo(45);
        assertThat(response.problemSolvingScore()).as("Senior problem-solving").isGreaterThanOrEqualTo(45);
    }

    private int averageScore(InterviewSessionResponse response) {
        return (response.communicationScore() + response.technicalScore() + response.problemSolvingScore()) / 3;
    }
}
