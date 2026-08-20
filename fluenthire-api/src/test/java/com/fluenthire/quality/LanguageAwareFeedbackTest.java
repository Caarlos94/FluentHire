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
 * Quality Gate 4: Language-Aware Feedback
 * Spanish/Portuguese speakers get language-specific callouts.
 * Native English speakers do NOT get language-learner advice.
 */
class LanguageAwareFeedbackTest extends QualityTestBase {

    // Keywords that indicate language-specific feedback
    private static final List<String> SPANISH_INDICATORS = List.of(
            "article", "a/the", "the/a", "preposition", "cognate", "subject",
            "verb tense", "articles", "prepositions", "omit", "omission",
            "depend on", "depend of", "actually", "actualmente",
            "spanish", "grammar"
    );

    private static final List<String> PORTUGUESE_INDICATORS = List.of(
            "article", "preposition", "cognate", "word order",
            "pretend", "pretender", "filler", "hedging",
            "you know", "like", "maybe", "portuguese",
            "confidence", "direct", "fluency"
    );

    private static final List<String> LANGUAGE_LEARNER_INDICATORS = List.of(
            "native language", "spanish", "portuguese", "article usage",
            "false cognate", "language background", "language learner",
            "non-native", "second language", "L2", "mother tongue"
    );

    @Test
    @Timeout(value = 2, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 4: Spanish speaker gets Spanish-specific language callouts")
    void spanishSpeaker_getsSpanishSpecificFeedback() {
        InterviewSessionResponse response = runSession(
                juniorSpanish,
                InterviewFormat.QUICK,
                QuestionCategory.BEHAVIORAL,
                "SUPPORTIVE",
                behavioralQuestionId,
                "junior-spanish/behavioral.json",
                null
        );

        String allFeedback = combineFeedback(response.problems());

        boolean hasLanguageCallout = SPANISH_INDICATORS.stream()
                .anyMatch(indicator -> allFeedback.toLowerCase().contains(indicator.toLowerCase()));

        assertThat(hasLanguageCallout)
                .as("Spanish speaker should receive language-specific feedback. " +
                    "Combined feedback: %s", truncate(allFeedback, 500))
                .isTrue();
    }

    @Test
    @Timeout(value = 2, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 4: Portuguese speaker gets Portuguese-specific language callouts")
    void portugueseSpeaker_getsPortugueseSpecificFeedback() {
        InterviewSessionResponse response = runSession(
                seniorPortuguese,
                InterviewFormat.QUICK,
                QuestionCategory.BEHAVIORAL,
                "SUPPORTIVE",
                behavioralQuestionId,
                "senior-portuguese/behavioral.json",
                null
        );

        String allFeedback = combineFeedback(response.problems());

        boolean hasLanguageCallout = PORTUGUESE_INDICATORS.stream()
                .anyMatch(indicator -> allFeedback.toLowerCase().contains(indicator.toLowerCase()));

        assertThat(hasLanguageCallout)
                .as("Portuguese speaker should receive language-specific feedback. " +
                    "Combined feedback: %s", truncate(allFeedback, 500))
                .isTrue();
    }

    @Test
    @Timeout(value = 2, unit = TimeUnit.MINUTES)
    @DisplayName("Gate 4: Native English speaker gets NO language-specific advice")
    void nativeEnglishSpeaker_noLanguageLearnerAdvice() {
        InterviewSessionResponse response = runSession(
                midEnglish,
                InterviewFormat.QUICK,
                QuestionCategory.BEHAVIORAL,
                "SUPPORTIVE",
                behavioralQuestionId,
                "mid-english/behavioral.json",
                null
        );

        String allFeedback = combineFeedback(response.problems());

        boolean hasLanguageLearnerAdvice = LANGUAGE_LEARNER_INDICATORS.stream()
                .anyMatch(indicator -> allFeedback.toLowerCase().contains(indicator.toLowerCase()));

        assertThat(hasLanguageLearnerAdvice)
                .as("Native English speaker should NOT receive language-learner advice. " +
                    "Combined feedback: %s", truncate(allFeedback, 500))
                .isFalse();
    }

    private String combineFeedback(List<ProblemResult> problems) {
        StringBuilder sb = new StringBuilder();
        for (ProblemResult p : problems) {
            if (p.feedback() != null) sb.append(p.feedback()).append(" ");
            if (p.communicationFeedback() != null) sb.append(p.communicationFeedback()).append(" ");
            if (p.grammarVocabularyFeedback() != null) sb.append(p.grammarVocabularyFeedback()).append(" ");
            if (p.clarityStructureFeedback() != null) sb.append(p.clarityStructureFeedback()).append(" ");
            if (p.fillerFluencyFeedback() != null) sb.append(p.fillerFluencyFeedback()).append(" ");
            if (p.improvedResponse() != null) sb.append(p.improvedResponse()).append(" ");
            if (p.focusTip() != null) sb.append(p.focusTip()).append(" ");
        }
        return sb.toString();
    }

    private String truncate(String text, int maxLength) {
        if (text == null) return "null";
        return text.length() <= maxLength ? text : text.substring(0, maxLength) + "...";
    }
}
