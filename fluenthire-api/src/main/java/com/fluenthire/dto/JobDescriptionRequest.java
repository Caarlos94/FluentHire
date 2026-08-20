package com.fluenthire.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobDescriptionRequest {

    @NotBlank(message = "Job description is required")
    @Size(min = 200, max = 5000, message = "Job description must be between 200 and 5000 characters")
    private String jobDescription;
}
