package com.fluenthire.controller;

import com.fluenthire.repository.FeatureVoteRepository;
import com.fluenthire.service.AdminService;
import com.fluenthire.service.ApiCostTracker;
import com.fluenthire.service.EmailSchedulerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class DashboardController {

    private final AdminService adminService;
    private final FeatureVoteRepository featureVoteRepository;
    private final ApiCostTracker apiCostTracker;
    private final EmailSchedulerService emailSchedulerService;

    @GetMapping("/dashboard/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> revenue(Authentication authentication) {
        return ResponseEntity.ok(adminService.getRevenueData(authentication.getName()));
    }

    @GetMapping("/dashboard/product-health")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> productHealth() {
        return ResponseEntity.ok(adminService.getProductHealthData());
    }

    @GetMapping("/dashboard/growth")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> growth() {
        return ResponseEntity.ok(adminService.getGrowthData());
    }

    @GetMapping("/dashboard/session-ratings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> sessionRatings() {
        return ResponseEntity.ok(adminService.getSessionRatingsData());
    }

    @GetMapping("/dashboard/feature-votes/{featureName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> featureVotes(@PathVariable String featureName) {
        long likes = featureVoteRepository.countFeatureVoteByVoteAndFeatureName(true, featureName);
        long dislikes = featureVoteRepository.countFeatureVoteByVoteAndFeatureName(false, featureName);
        return ResponseEntity.ok(Map.of("likes", likes, "dislikes", dislikes));
    }

    @GetMapping("/dashboard/api-costs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> apiCosts() {
        var allRecords = apiCostTracker.getAllRecords();

        // Per-session details for interview sessions (most recent 50)
        var interviewSessions = allRecords.stream()
                .filter(r -> "ai-interview".equals(r.feature()))
                .sorted((a, b) -> b.timestamp().compareTo(a.timestamp()))
                .limit(50)
                .map(r -> {
                    var m = new LinkedHashMap<String, Object>();
                    m.put("category", r.category() != null ? r.category() : "N/A");
                    m.put("realtimeCost", r.realtimeCost());
                    m.put("claudeCost", r.claudeCost());
                    m.put("totalCost", r.totalCost());
                    m.put("exactCost", r.exactCost());
                    m.put("inputTokens", r.inputTokens());
                    m.put("outputTokens", r.outputTokens());
                    m.put("cachedTokens", r.cachedTokens());
                    m.put("cacheRate", r.cacheRate());
                    m.put("durationSeconds", r.durationSeconds());
                    m.put("timestamp", r.timestamp().toString());
                    return m;
                })
                .toList();

        return ResponseEntity.ok(Map.of(
                "byFeature", apiCostTracker.aggregateAllByFeature(),
                "byCategory", apiCostTracker.aggregateAllByCategory(),
                "byFeatureAndCategory", apiCostTracker.aggregateAllByFeatureAndCategory(),
                "totalCostUsd", apiCostTracker.getTotalCost(),
                "totalRequests", allRecords.size(),
                "interviewSessions", interviewSessions
        ));
    }

    @PostMapping("/dashboard/api-costs/reset")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resetApiCosts() {
        apiCostTracker.reset();
        return ResponseEntity.ok(Map.of("status", "reset"));
    }

    @PostMapping("/test-emails/credit-reminder")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testCreditReminder() {
        emailSchedulerService.sendCreditReminderEmails();
        return ResponseEntity.ok(Map.of("status", "credit-reminder triggered"));
    }

    @PostMapping("/test-emails/winback")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testWinback() {
        emailSchedulerService.sendWinbackEmails();
        return ResponseEntity.ok(Map.of("status", "winback triggered"));
    }
}