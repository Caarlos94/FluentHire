package com.fluenthire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class UserResponseResponse {

    private Long id;
    private Long questionId;
    private String questionTitle;
    private String originalResponse;
    private Integer attemptNumber;
    private String mode;
    private boolean hasAnalysis;
    private LocalDateTime createdAt;
}
