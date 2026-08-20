package com.fluenthire.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreditTransactionResponse {
    private String type;
    private int amount;
    private String description;
    private String createdAt;
}
