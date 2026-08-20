package com.fluenthire.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FeatureVoteRequest {

    @NotBlank(message = "Feature name is required")
    private String featureName;

    @NotNull(message = "Vote is required")
    private Boolean vote;
}
