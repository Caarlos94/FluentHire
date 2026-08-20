package com.fluenthire.dto;

import com.fluenthire.entity.AlgorithmCategory;
import com.fluenthire.entity.DifficultyLevel;
import com.fluenthire.entity.Example;
import com.fluenthire.entity.QuestionCategory;
import com.fluenthire.entity.QuestionTier;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class QuestionResponse {

    private Long id;
    private String title;
    private String content;
    private QuestionCategory category;
    private DifficultyLevel difficulty;
    private QuestionTier tier;
    private List<String> tags;
    private List<Example> examples;
    private LocalDateTime createdAt;
    private String methodName;
    private String methodParams;
    private String returnType;
    private AlgorithmCategory algorithmCategory;
}
