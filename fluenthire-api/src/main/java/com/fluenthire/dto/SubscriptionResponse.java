package com.fluenthire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SubscriptionResponse {
    private String plan;
    private String status;
    private String currentPeriodEnd;
    private boolean cancelAtPeriodEnd;
}
