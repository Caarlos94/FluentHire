package com.fluenthire.dto;

import com.fluenthire.entity.FeedbackCategory;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FeedbackResponse {

    private Long id;
    private String userEmail;
    private String userFirstName;
    private String userLastName;
    private String feedback;
    private FeedbackCategory feedbackCategory;
    private String pageUrl;
    private LocalDateTime createdAt;
}
