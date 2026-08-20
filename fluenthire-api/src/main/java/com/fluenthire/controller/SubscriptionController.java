package com.fluenthire.controller;

import com.fluenthire.dto.CheckoutSessionRequest;
import com.fluenthire.dto.CheckoutSessionResponse;
import com.fluenthire.dto.SubscriptionResponse;
import com.fluenthire.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/current")
    public ResponseEntity<SubscriptionResponse> getCurrentSubscription(Authentication authentication) {
        return ResponseEntity.ok(subscriptionService.getSubscription(authentication.getName()));
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutSessionResponse> createCheckoutSession(
            Authentication authentication,
            @Valid @RequestBody CheckoutSessionRequest request) {
        return ResponseEntity.ok(subscriptionService.createCheckoutSession(authentication.getName(), request));
    }

    @PostMapping("/billing-portal")
    public ResponseEntity<CheckoutSessionResponse> createBillingPortalSession(Authentication authentication) {
        return ResponseEntity.ok(subscriptionService.createBillingPortalSession(authentication.getName()));
    }

    @PostMapping("/cancel")
    public ResponseEntity<SubscriptionResponse> cancelSubscription(Authentication authentication) {
        return ResponseEntity.ok(subscriptionService.cancelSubscription(authentication.getName()));
    }
}
