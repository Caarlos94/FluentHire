package com.fluenthire.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class CreditPackConfig {

    @Value("${stripe.prices.pack-3}")
    private String pack3PriceId;

    @Value("${stripe.prices.pack-6}")
    private String pack6PriceId;

    @Value("${stripe.prices.pack-10}")
    private String pack10PriceId;

    private Map<String, PackInfo> priceToPack;

    public record PackInfo(int credits, String description) {}

    @PostConstruct
    void init() {
        priceToPack = Map.of(
                pack3PriceId, new PackInfo(3, "3-Credit Pack"),
                pack6PriceId, new PackInfo(6, "6-Credit Pack"),
                pack10PriceId, new PackInfo(10, "10-Credit Pack")
        );
    }

    public PackInfo fromPriceId(String priceId) {
        PackInfo info = priceToPack.get(priceId);
        if (info == null) {
            throw new IllegalArgumentException("Invalid credit pack price ID: " + priceId);
        }
        return info;
    }
}
