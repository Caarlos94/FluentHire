package com.fluenthire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DashboardResponse {

    private String firstName;
    private String lastName;
    private double mrr;
    private double starterRevenue;
    private double proRevenue;
    private double conversionRate;
    private int totalUsers;
    private int freeUsers;
    private int paidUsers;
    private int paidUsersStarterPlan;
    private int paidUsersProPlan;
    private int newUsersLast24Hours;
    private int newUsersLast7Days;
    private int newUsersLast30Days;
    private int activeUsersLast24Hours;
    private int activeUsersLast7Days;
}
