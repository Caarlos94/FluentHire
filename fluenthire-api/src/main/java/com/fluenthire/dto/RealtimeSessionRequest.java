package com.fluenthire.dto;

import com.fluenthire.entity.InterviewFormat;
import com.fluenthire.entity.QuestionCategory;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RealtimeSessionRequest {

    @NotNull(message = "Format is required")
    private InterviewFormat format;

    @NotEmpty(message = "At least one question ID is required")
    private List<Long> questionIds;

    private QuestionCategory category;

    private String personality;

    private String speakingSpeed;

    private String focusArea;
}
