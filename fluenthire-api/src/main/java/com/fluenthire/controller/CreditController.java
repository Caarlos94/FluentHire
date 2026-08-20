package com.fluenthire.controller;

import com.fluenthire.dto.CheckoutSessionRequest;
import com.fluenthire.dto.CheckoutSessionResponse;
import com.fluenthire.dto.CreditTransactionResponse;
import com.fluenthire.service.CreditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credits")
@RequiredArgsConstructor
public class CreditController {

    private final CreditService creditService;

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutSessionResponse> checkoutSession(
            Authentication authentication,
            @Valid @RequestBody CheckoutSessionRequest request) {
        return ResponseEntity.ok(creditService.createCheckoutSession(authentication.getName(), request));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<CreditTransactionResponse>> getTransactions(Authentication authentication) {
        return ResponseEntity.ok(creditService.getTransactionHistory(authentication.getName()));
    }
}
