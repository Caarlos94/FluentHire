package com.fluenthire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class QuestionScoreDto {

    private Long questionId;
    private String title;
    private double avgScore;
}
