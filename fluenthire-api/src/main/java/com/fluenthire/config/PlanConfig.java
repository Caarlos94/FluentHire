package com.fluenthire.config;

import com.fluenthire.entity.Plan;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class PlanConfig {

    private static final Map<Plan, Integer> MONTHLY_CREDITS = Map.of(
            Plan.FREE, 0,
            Plan.INTERVIEW_READY, 5,           // Legacy — same as STARTER
            Plan.INTERVIEW_STARTER, 5,
            Plan.INTERVIEW_PRO, 14,
            Plan.INTERVIEW_INTENSIVE, 24
    );

    @Value("${stripe.prices.starter}")
    private String starterPriceId;

    @Value("${stripe.prices.pro}")
    private String proPriceId;

    @Value("${stripe.prices.intensive}")
    private String intensivePriceId;

    private Map<String, Plan> priceToPlan;

    @PostConstruct
    void init() {
        priceToPlan = Map.of(
                starterPriceId, Plan.INTERVIEW_STARTER,
                proPriceId, Plan.INTERVIEW_PRO,
                intensivePriceId, Plan.INTERVIEW_INTENSIVE
        );
    }

    public static int getMonthlyCredits(Plan plan) {
        return MONTHLY_CREDITS.getOrDefault(plan, 0);
    }

    public Plan getPlanForPriceId(String priceId) {
        return priceToPlan.getOrDefault(priceId, Plan.FREE);
    }
}
