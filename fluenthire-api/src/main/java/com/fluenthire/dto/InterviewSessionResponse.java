package com.fluenthire.dto;

import com.fluenthire.entity.InterviewFormat;
import com.fluenthire.entity.QuestionCategory;

import java.util.List;

public record InterviewSessionResponse(
        String sessionId,
        InterviewFormat format,
        QuestionCategory category,
        int communicationScore,
        int technicalScore,
        int problemSolvingScore,
        String overallFeedback,
        List<ProblemResult> problems,
        int durationSeconds
) {

    public record ProblemResult(
            long id,
            long questionId,
            String questionTitle,
            int communicationScore,
            int technicalScore,
            int problemSolvingScore,
            String feedback,
            String communicationFeedback,
            Integer clarityStructureScore,
            String clarityStructureFeedback,
            Integer grammarVocabularyScore,
            String grammarVocabularyFeedback,
            Integer fillerFluencyScore,
            String fillerFluencyFeedback,
            String technicalFeedback,
            String problemSolvingFeedback,
            String improvedResponse,
            String focusTip,
            String codeFeedback,
            String codeSubmitted
    ) {
    }
}
