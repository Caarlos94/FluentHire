package com.fluenthire.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionRatingRequest {

    @NotNull(message = "User response ID is required")
    private Long userResponseId;

    @NotNull(message = "Rating is required")
    @Min(1) @Max(5)
    private Integer rating;

    private String feedback;
}
