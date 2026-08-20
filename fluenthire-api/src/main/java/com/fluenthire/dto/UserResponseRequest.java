package com.fluenthire.dto;

import com.fluenthire.entity.ResponseMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseRequest {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    @NotBlank(message = "Response is required")
    @Size(min = 50, max = 5000, message = "Response must be between 50 and 5000 characters")
    private String originalResponse;

    private ResponseMode mode;
}
