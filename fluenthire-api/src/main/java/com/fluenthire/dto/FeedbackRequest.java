package com.fluenthire.dto;

import com.fluenthire.entity.FeedbackCategory;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.validator.constraints.Length;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class FeedbackRequest {

    @NotNull(message = "Feedback is required")
    @Length(min = 1, max = 2000)
    private String feedback;

    @NotNull(message = "Category is required")
    private FeedbackCategory feedbackCategory;

    @NotNull(message = "Page is required")
    private String pageUrl;
}
