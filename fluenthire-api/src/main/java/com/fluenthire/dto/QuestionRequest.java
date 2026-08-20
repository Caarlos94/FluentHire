package com.fluenthire.dto;

import com.fluenthire.entity.DifficultyLevel;
import com.fluenthire.entity.QuestionCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Category is required")
    private QuestionCategory category;

    @NotNull(message = "Difficulty is required")
    private DifficultyLevel difficulty;

    private List<String> tags;
}
