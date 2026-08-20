package com.fluenthire.quality;

import com.fluenthire.dto.InterviewSessionResponse;
import com.fluenthire.dto.InterviewSessionResponse.ProblemResult;
import com.fluenthire.entity.InterviewFormat;
import com.fluenthire.entity.QuestionCategory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Quality Gate 5: Code Feedback Quality
 * When code is submitted, codeFeedback must be non-empty and reference actual code.
 */
class CodeFeedbackQualityTest extends QualityTestBase {

    @Test
    @Timeout(value = 2, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 5: Code feedback non-empty and references actual code when code submitted")
    void codeSubmitted_codeFeedbackReferencesCode() {
        InterviewSessionResponse response = runSession(
                midEnglish,
                InterviewFormat.QUICK,
                QuestionCategory.CODING,
                "PROFESSIONAL",
                codingQuestionId,
                "mid-english/coding.json",
                "code/mid-english-two-sum.py"
        );

        assertThat(response.problems()).isNotEmpty();

        for (ProblemResult problem : response.problems()) {
            assertThat(problem.codeFeedback())
                    .as("codeFeedback should be non-empty when code is submitted")
                    .isNotBlank();

            // Code feedback should reference at least one identifier from the submitted code
            String codeFeedback = problem.codeFeedback().toLowerCase();
            List<String> codeIdentifiers = List.of(
                    "twosums", "twosum", "two_sum", "seen", "complement",
                    "enumerate", "hash", "map", "dictionary", "dict",
                    "o(n)", "o of n", "linear"
            );

            boolean referencesCode = codeIdentifiers.stream()
                    .anyMatch(codeFeedback::contains);

            assertThat(referencesCode)
                    .as("codeFeedback should reference actual code patterns, got: %s",
                            truncate(problem.codeFeedback(), 300))
                    .isTrue();
        }
    }

    @Test
    @Timeout(value = 2, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 5: No code feedback for behavioral questions (no code submitted)")
    void noCodeSubmitted_codeFeedbackAbsent() {
        InterviewSessionResponse response = runSession(
                midEnglish,
                InterviewFormat.QUICK,
                QuestionCategory.BEHAVIORAL,
                "PROFESSIONAL",
                behavioralQuestionId,
                "mid-english/behavioral.json",
                null
        );

        assertThat(response.problems()).isNotEmpty();

        for (ProblemResult problem : response.problems()) {
            // codeFeedback should be null or empty for non-coding questions
            assertThat(problem.codeFeedback())
                    .as("codeFeedback should be absent for behavioral questions")
                    .satisfiesAnyOf(
                            cf -> assertThat(cf).isNull(),
                            cf -> assertThat(cf).isBlank()
                    );
        }
    }

    private String truncate(String text, int maxLength) {
        if (text == null) return "null";
        return text.length() <= maxLength ? text : text.substring(0, maxLength) + "...";
    }
}
