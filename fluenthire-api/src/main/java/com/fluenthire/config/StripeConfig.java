package com.fluenthire.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class StripeConfig {

    @Value("${stripe.api-key}")
    private String apiKey;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @PostConstruct
    public void init() {
        if ("prod".equals(activeProfile) && apiKey.startsWith("sk_test_")) {
            throw new IllegalStateException(
                    "Stripe test key detected in production. Set STRIPE_API_KEY to a live key (sk_live_...)");
        }
        Stripe.apiKey = apiKey;
        log.info("Stripe initialized in {} mode", apiKey.startsWith("sk_live_") ? "LIVE" : "TEST");
    }
}
