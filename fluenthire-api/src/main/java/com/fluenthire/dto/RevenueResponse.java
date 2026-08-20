package com.fluenthire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RevenueResponse {

    private String firstName;
    private String lastName;

    // Revenue
    private double mrr;
    private double interviewStarterRevenue;
    private double interviewProRevenue;
    private double interviewIntensiveRevenue;

    // Subscribers
    private int totalUsers;
    private int freeUsers;
    private int paidUsers;
    private int paidUsersInterviewStarterPlan;
    private int paidUsersInterviewProPlan;
    private int paidUsersInterviewIntensivePlan;
    private double conversionRate;

    // Growth
    private int newUsersLast24Hours;
    private int newUsersLast7Days;
    private int newUsersLast30Days;

    // Churn
    private double churnRate;
    private int canceledThisMonth;

    // Cost
    private int creditsConsumedToday;
    private double estimatedApiCostToday;
}
