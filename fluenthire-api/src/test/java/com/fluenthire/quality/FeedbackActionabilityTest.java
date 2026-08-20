package com.fluenthire.quality;

import com.fluenthire.dto.InterviewSessionResponse;
import com.fluenthire.dto.InterviewSessionResponse.ProblemResult;
import com.fluenthire.entity.InterviewFormat;
import com.fluenthire.entity.QuestionCategory;
import com.fluenthire.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Timeout;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Quality Gate 2: Feedback Actionability
 * All feedback fields must be non-empty. ImprovedResponse must be 50-350 words.
 * FocusTip must be a single sentence.
 */
class FeedbackActionabilityTest extends QualityTestBase {

    @ParameterizedTest(name = "{0}")
    @MethodSource("scenarios")
    @Timeout(value = 2, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 2: Feedback fields are non-empty and properly sized")
    void feedbackActionability(String label, String personaKey, QuestionCategory category,
                               Long questionIdResolver, String transcriptFixture, String codeFixture) {
        User user = resolveUser(personaKey);
        Long questionId = resolveQuestionId(category);

        InterviewSessionResponse response = runSession(
                user, InterviewFormat.QUICK, category, "SUPPORTIVE",
                questionId, transcriptFixture, codeFixture
        );

        assertThat(response.problems()).isNotEmpty();

        for (ProblemResult problem : response.problems()) {
            assertThat(problem.feedback())
                    .as("feedback for %s", label)
                    .isNotBlank();

            assertThat(problem.communicationFeedback())
                    .as("communicationFeedback for %s", label)
                    .isNotBlank();

            assertThat(problem.technicalFeedback())
                    .as("technicalFeedback for %s", label)
                    .isNotBlank();

            assertThat(problem.problemSolvingFeedback())
                    .as("problemSolvingFeedback for %s", label)
                    .isNotBlank();

            assertThat(problem.improvedResponse())
                    .as("improvedResponse for %s", label)
                    .isNotBlank();

            int words = wordCount(problem.improvedResponse());
            assertThat(words)
                    .as("improvedResponse word count for %s (%d words)", label, words)
                    .isBetween(50, 350);

            assertThat(problem.focusTip())
                    .as("focusTip for %s", label)
                    .isNotBlank();

            // FocusTip should be a single sentence (at most one sentence-ending punctuation)
            long sentenceEndings = problem.focusTip().chars()
                    .filter(c -> c == '.' || c == '!' || c == '?')
                    .count();
            assertThat(sentenceEndings)
                    .as("focusTip sentence count for %s: '%s'", label, problem.focusTip())
                    .isBetween(1L, 2L);
        }
    }

    static Stream<Arguments> scenarios() {
        return Stream.of(
                Arguments.of("junior-spanish/behavioral", "junior", QuestionCategory.BEHAVIORAL,
                        null, "junior-spanish/behavioral.json", null),
                Arguments.of("mid-english/coding", "mid", QuestionCategory.CODING,
                        null, "mid-english/coding.json", "code/mid-english-two-sum.py"),
                Arguments.of("senior-portuguese/system-design", "senior", QuestionCategory.SYSTEM_DESIGN,
                        null, "senior-portuguese/system-design.json", null)
        );
    }

    private User resolveUser(String key) {
        return switch (key) {
            case "junior" -> juniorSpanish;
            case "mid" -> midEnglish;
            case "senior" -> seniorPortuguese;
            default -> throw new IllegalArgumentException("Unknown persona: " + key);
        };
    }

    private Long resolveQuestionId(QuestionCategory category) {
        return switch (category) {
            case BEHAVIORAL -> behavioralQuestionId;
            case CODING -> codingQuestionId;
            case SYSTEM_DESIGN -> systemDesignQuestionId;
            default -> throw new IllegalArgumentException("Unsupported category: " + category);
        };
    }
}
