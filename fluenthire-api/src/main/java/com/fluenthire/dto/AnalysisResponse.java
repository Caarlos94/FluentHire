package com.fluenthire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class AnalysisResponse {

    private Long id;
    private Long userResponseId;
    private String questionTitle;
    private String originalResponse;
    private Integer attemptNumber;
    private Integer communicationScore;
    private String communicationFeedback;
    private Integer clarityStructureScore;
    private String clarityStructureFeedback;
    private Integer grammarVocabularyScore;
    private String grammarVocabularyFeedback;
    private Integer fillerFluencyScore;
    private String fillerFluencyFeedback;
    private Integer technicalScore;
    private String technicalFeedback;
    private String improvedResponse;
    private String focusTip;
    private String codeFeedback;
    private LocalDateTime createdAt;
}
