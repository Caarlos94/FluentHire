package com.fluenthire.quality;

import com.fluenthire.dto.InterviewCompleteRequest.TranscriptMessage;
import com.fluenthire.dto.InterviewSessionResponse;
import com.fluenthire.dto.InterviewSessionResponse.ProblemResult;
import com.fluenthire.entity.InterviewFormat;
import com.fluenthire.entity.QuestionCategory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Quality Gate 7: Improved Response Quality
 * For behavioral questions: no code symbols in improvedResponse.
 * For all questions: improvedResponse must be meaningfully different from transcript.
 */
class ImprovedResponseQualityTest extends QualityTestBase {

    // Code symbols that should NOT appear in behavioral improved responses
    private static final Pattern CODE_SYMBOLS = Pattern.compile(
            "\\(\\)|\\[\\]|\\{\\}|=>|==|!=|\\+=|-=|O\\(n|O\\(log|" +
            "\\bvar\\b|\\bfunction\\b|\\bclass\\b|\\breturn\\b|\\bconst\\b|\\blet\\b|" +
            "```|\\bdef\\b|\\bimport\\b"
    );

    @Test
    @Timeout(value = 2, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 7: Behavioral improved response contains no code symbols")
    void behavioral_improvedResponse_noCodeSymbols() {
        InterviewSessionResponse response = runSession(
                juniorSpanish,
                InterviewFormat.QUICK,
                QuestionCategory.BEHAVIORAL,
                "SUPPORTIVE",
                behavioralQuestionId,
                "junior-spanish/behavioral.json",
                null
        );

        assertThat(response.problems()).isNotEmpty();

        for (ProblemResult problem : response.problems()) {
            assertThat(problem.improvedResponse()).isNotBlank();

            boolean hasCodeSymbols = CODE_SYMBOLS.matcher(problem.improvedResponse()).find();

            assertThat(hasCodeSymbols)
                    .as("Behavioral improvedResponse should not contain code symbols. Got: %s",
                            truncate(problem.improvedResponse(), 300))
                    .isFalse();
        }
    }

    @Test
    @Timeout(value = 2, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 7: Improved response is meaningfully different from candidate transcript")
    void improvedResponse_differentFromTranscript() {
        String transcriptFixture = "mid-english/behavioral.json";
        List<TranscriptMessage> transcript = loadTranscript(transcriptFixture);
        String candidateText = extractCandidateText(transcript);

        InterviewSessionResponse response = runSession(
                midEnglish,
                InterviewFormat.QUICK,
                QuestionCategory.BEHAVIORAL,
                "PROFESSIONAL",
                behavioralQuestionId,
                transcriptFixture,
                null
        );

        assertThat(response.problems()).isNotEmpty();

        for (ProblemResult problem : response.problems()) {
            assertThat(problem.improvedResponse()).isNotBlank();

            double similarity = jaccardSimilarity(problem.improvedResponse(), candidateText);

            assertThat(similarity)
                    .as("Improved response should be meaningfully different from transcript " +
                        "(Jaccard similarity: %.2f, want < 0.5)", similarity)
                    .isLessThan(0.5);
        }
    }

    private String truncate(String text, int maxLength) {
        if (text == null) return "null";
        return text.length() <= maxLength ? text : text.substring(0, maxLength) + "...";
    }
}
