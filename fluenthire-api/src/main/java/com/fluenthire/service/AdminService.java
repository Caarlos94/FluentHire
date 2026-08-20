package com.fluenthire.service;

import com.fluenthire.dto.GrowthResponse;
import com.fluenthire.dto.ProductHealthResponse;
import com.fluenthire.dto.QuestionScoreDto;
import com.fluenthire.dto.RevenueResponse;
import com.fluenthire.dto.SessionRatingsResponse;
import com.fluenthire.entity.CreditTransactionType;
import com.fluenthire.entity.InterviewSessionStatus;
import com.fluenthire.entity.Plan;
import com.fluenthire.entity.QuestionCategory;
import com.fluenthire.entity.SessionRating;
import com.fluenthire.entity.SubscriptionStatus;
import com.fluenthire.entity.User;
import com.fluenthire.exception.ResourceNotFoundException;
import com.fluenthire.repository.AnalysisRepository;
import com.fluenthire.repository.CreditTransactionRepository;
import com.fluenthire.repository.InterviewSessionRepository;
import com.fluenthire.repository.InterviewSessionResultRepository;
import com.fluenthire.repository.RatingRepository;
import com.fluenthire.repository.SubscriptionRepository;
import com.fluenthire.repository.UserRepository;
import com.fluenthire.repository.UserResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final double INTERVIEW_STARTER_PRICE = 9.99;
    private static final double INTERVIEW_PRO_PRICE = 19.99;
    private static final double INTERVIEW_INTENSIVE_PRICE = 29.99;
    private static final double COST_PER_CREDIT = 0.85;

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final CreditTransactionRepository creditTransactionRepository;
    private final UserResponseRepository userResponseRepository;
    private final InterviewSessionRepository interviewSessionRepository;
    private final InterviewSessionResultRepository interviewSessionResultRepository;
    private final AnalysisRepository analysisRepository;
    private final RatingRepository ratingRepository;

    @Transactional(readOnly = true)
    public RevenueResponse getRevenueData(String email) {

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Subscribers by plan (count legacy INTERVIEW_READY together with STARTER)
        int interviewStarterCount = subscriptionRepository.countByPlanAndStatus(Plan.INTERVIEW_STARTER, SubscriptionStatus.ACTIVE)
                + subscriptionRepository.countByPlanAndStatus(Plan.INTERVIEW_READY, SubscriptionStatus.ACTIVE);
        int interviewProCount = subscriptionRepository.countByPlanAndStatus(Plan.INTERVIEW_PRO, SubscriptionStatus.ACTIVE);
        int interviewIntensiveCount = subscriptionRepository.countByPlanAndStatus(Plan.INTERVIEW_INTENSIVE, SubscriptionStatus.ACTIVE);

        // Revenue
        double interviewStarterRevenue = interviewStarterCount * INTERVIEW_STARTER_PRICE;
        double interviewProRevenue = interviewProCount * INTERVIEW_PRO_PRICE;
        double interviewIntensiveRevenue = interviewIntensiveCount * INTERVIEW_INTENSIVE_PRICE;
        double mrr = interviewStarterRevenue + interviewProRevenue + interviewIntensiveRevenue;

        // Users
        int totalUsers = (int) userRepository.count();
        int paidUsers = interviewStarterCount + interviewProCount + interviewIntensiveCount;
        int freeUsers = totalUsers - paidUsers;
        double conversionRate = totalUsers > 0 ? (paidUsers * 100.0 / totalUsers) : 0;

        // New signups
        LocalDateTime now = LocalDateTime.now();
        int usersLast24Hours = userRepository.countByCreatedAtBetween(now.minusDays(1), now);
        int usersLastWeek = userRepository.countByCreatedAtBetween(now.minusDays(7), now);
        int usersLastMonth = userRepository.countByCreatedAtBetween(now.minusMonths(1), now);

        // Churn
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        int canceledThisMonth = subscriptionRepository.countByStatusAndCanceledAtBetween(
                SubscriptionStatus.CANCELED, startOfMonth, now);
        int activeAtStartOfMonth = paidUsers + canceledThisMonth;
        double churnRate = activeAtStartOfMonth > 0 ? (canceledThisMonth * 100.0 / activeAtStartOfMonth) : 0;

        // Cost
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        int creditsConsumedToday = creditTransactionRepository.countByTypeAndCreatedAtBetween(
                CreditTransactionType.INTERVIEW_DEDUCT, startOfDay, now);
        double estimatedApiCostToday = creditsConsumedToday * COST_PER_CREDIT;

        return new RevenueResponse(
                admin.getFirstName(), admin.getLastName(),
                mrr, interviewStarterRevenue, interviewProRevenue, interviewIntensiveRevenue,
                totalUsers, freeUsers, paidUsers, interviewStarterCount, interviewProCount, interviewIntensiveCount, conversionRate,
                usersLast24Hours, usersLastWeek, usersLastMonth,
                churnRate, canceledThisMonth,
                creditsConsumedToday, estimatedApiCostToday
        );
    }

    @Transactional(readOnly = true)
    public ProductHealthResponse getProductHealthData() {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneDayAgo = now.minusDays(1);
        LocalDateTime sevenDaysAgo = now.minusDays(7);
        LocalDateTime thirtyDaysAgo = now.minusDays(30);

        // DAU / WAU / MAU — distinct users who did Q&A or live interview
        int qaDAU = userResponseRepository.countDistinctUsersByCreatedAtBetween(oneDayAgo, now);
        int qaWAU = userResponseRepository.countDistinctUsersByCreatedAtBetween(sevenDaysAgo, now);
        int qaMAU = userResponseRepository.countDistinctUsersByCreatedAtBetween(thirtyDaysAgo, now);
        int interviewDAU = interviewSessionRepository.countDistinctUsersByStartedAtBetween(oneDayAgo, now);
        int interviewWAU = interviewSessionRepository.countDistinctUsersByStartedAtBetween(sevenDaysAgo, now);
        int interviewMAU = interviewSessionRepository.countDistinctUsersByStartedAtBetween(thirtyDaysAgo, now);
        // Approximation: sum of distinct users per mode (a user active in both modes counts twice)
        // Exact cross-table distinct would require a UNION query — not worth the complexity for a dashboard
        int dau = qaDAU + interviewDAU;
        int wau = qaWAU + interviewWAU;
        int mau = qaMAU + interviewMAU;

        // Sessions per user (avg) — total sessions last 30d / MAU
        int qaSessions30d = userResponseRepository.countByCreatedAtBetween(thirtyDaysAgo, now);
        int interviewSessions30d = interviewSessionRepository.countByStatusAndStartedAtBetween(
                InterviewSessionStatus.COMPLETED, thirtyDaysAgo, now);
        int totalSessions30d = qaSessions30d + interviewSessions30d;
        double avgSessionsPerUser = mau > 0 ? (double) totalSessions30d / mau : 0;

        // Avg live interview duration (completed sessions, last 30d)
        double avgDurationSeconds = interviewSessionRepository.avgDurationByStatusAndStartedAtBetween(
                InterviewSessionStatus.COMPLETED, thirtyDaysAgo, now);
        double avgInterviewDurationMinutes = avgDurationSeconds / 60.0;

        // Q&A scores (from Analysis, last 30d)
        double[] qaScores = safeScores(analysisRepository.avgScoresBetween(thirtyDaysAgo, now), 2);
        double avgQaCommScore = qaScores[0];
        double avgQaTechScore = qaScores[1];

        // Live interview scores (from InterviewSessionResult, last 30d)
        double[] interviewScores = safeScores(interviewSessionResultRepository.avgScoresBetween(thirtyDaysAgo, now), 3);
        double avgIntCommScore = interviewScores[0];
        double avgIntTechScore = interviewScores[1];
        double avgIntProbScore = interviewScores[2];

        // Funnel: onboarding + JD upload
        int totalUsers = (int) userRepository.count();
        int onboardingCompleted = userRepository.countByOnboardingCompleted(true);
        int withJd = userRepository.countWithJobDescription();
        double onboardingRate = totalUsers > 0 ? (onboardingCompleted * 100.0 / totalUsers) : 0;
        double jdRate = totalUsers > 0 ? (withJd * 100.0 / totalUsers) : 0;

        // Credit utilization: credits used vs granted this month
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        int creditsGranted = creditTransactionRepository.sumAmountByTypeAndCreatedAtBetween(
                CreditTransactionType.SUBSCRIPTION_GRANT, startOfMonth, now);
        int creditsUsed = Math.abs(creditTransactionRepository.sumAmountByTypeAndCreatedAtBetween(
                CreditTransactionType.INTERVIEW_DEDUCT, startOfMonth, now));
        double creditUtilization = creditsGranted > 0 ? (creditsUsed * 100.0 / creditsGranted) : 0;

        return new ProductHealthResponse(
                dau, wau, mau,
                avgSessionsPerUser,
                qaSessions30d, interviewSessions30d,
                avgInterviewDurationMinutes,
                avgQaCommScore, avgQaTechScore,
                avgIntCommScore, avgIntTechScore, avgIntProbScore,
                onboardingRate, jdRate,
                creditUtilization, creditsGranted, creditsUsed
        );
    }

    @Transactional(readOnly = true)
    public GrowthResponse getGrowthData() {

        // Demographics
        Map<String, Long> experienceDistribution = toStringMap(userRepository.countByExperienceLevel());
        Map<String, Long> roleDistribution = toStringMap(userRepository.countByRoleType());
        Map<String, Long> languageDistribution = toStringMap(userRepository.countByMainLanguage());

        // Most practiced question categories
        Map<String, Long> categoryPopularity = toStringMap(userResponseRepository.countByQuestionCategory());

        // Top 5 / bottom 5 questions by avg score
        List<QuestionScoreDto> highest = toQuestionScores(
                analysisRepository.findHighestScoredQuestions(PageRequest.of(0, 5)));
        List<QuestionScoreDto> lowest = toQuestionScores(
                analysisRepository.findLowestScoredQuestions(PageRequest.of(0, 5)));

        // Registration method split
        int totalUsers = (int) userRepository.count();
        int googleUsers = userRepository.countByPasswordIsNull();
        int emailUsers = totalUsers - googleUsers;

        // Subscription cancellation analysis
        int totalCancellations = subscriptionRepository.countByStatus(SubscriptionStatus.CANCELED);
        double avgDaysBeforeCancel = subscriptionRepository.avgDaysBeforeCancel();

        // Peak usage hours
        Map<Integer, Long> peakHours = new LinkedHashMap<>();
        for (Object[] row : userResponseRepository.countByHourOfDay()) {
            peakHours.put(((Number) row[0]).intValue(), ((Number) row[1]).longValue());
        }

        // Live interview format + category distribution
        Map<String, Long> formatDistribution = toStringMap(interviewSessionRepository.countByFormat());
        Map<String, Long> categoryDistribution = toStringMap(interviewSessionRepository.countByCategory());

        return new GrowthResponse(
                experienceDistribution, roleDistribution, languageDistribution,
                categoryPopularity,
                highest, lowest,
                emailUsers, googleUsers,
                totalCancellations, avgDaysBeforeCancel,
                peakHours,
                formatDistribution, categoryDistribution
        );
    }

    @Transactional(readOnly = true)
    public SessionRatingsResponse getSessionRatingsData() {
        List<SessionRatingsResponse.LowRatingEntry> lowRatings = ratingRepository.findLowRatings().stream()
                .map(sr -> {
                    String mode = sr.getInterviewSession() != null ? "Interview AI" : "Q&A Practice";
                    String category = null;
                    if (sr.getInterviewSession() != null && sr.getInterviewSession().getCategory() != null) {
                        category = sr.getInterviewSession().getCategory().name();
                    }
                    return SessionRatingsResponse.LowRatingEntry.builder()
                            .id(sr.getId())
                            .rating(sr.getRating())
                            .feedback(sr.getFeedback())
                            .mode(mode)
                            .category(category)
                            .userFirstName(sr.getUser().getFirstName())
                            .userEmail(sr.getUser().getEmail())
                            .createdAt(sr.getCreatedAt())
                            .build();
                })
                .toList();

        return SessionRatingsResponse.builder()
                .avgRatingQaPractice(ratingRepository.avgRatingQaPractice())
                .totalQaPracticeRatings(ratingRepository.countQaPracticeRatings())
                .avgRatingInterview(ratingRepository.avgRatingInterview())
                .totalInterviewRatings(ratingRepository.countInterviewRatings())
                .avgRatingInterviewCoding(ratingRepository.avgRatingInterviewByCategory(QuestionCategory.CODING))
                .totalInterviewCodingRatings(ratingRepository.countInterviewRatingsByCategory(QuestionCategory.CODING))
                .avgRatingInterviewBehavioral(ratingRepository.avgRatingInterviewByCategory(QuestionCategory.BEHAVIORAL))
                .totalInterviewBehavioralRatings(ratingRepository.countInterviewRatingsByCategory(QuestionCategory.BEHAVIORAL))
                .lowRatings(lowRatings)
                .build();
    }

    // ── Helpers ──

    private Map<String, Long> toStringMap(List<Object[]> rows) {
        Map<String, Long> map = new LinkedHashMap<>();
        for (Object[] row : rows) {
            map.put(row[0].toString(), ((Number) row[1]).longValue());
        }
        return map;
    }

    private double[] safeScores(Object[] row, int expected) {
        double[] result = new double[expected];
        if (row == null) return result;
        for (int i = 0; i < expected && i < row.length; i++) {
            if (row[i] instanceof Number n) {
                result[i] = n.doubleValue();
            }
        }
        return result;
    }

    private List<QuestionScoreDto> toQuestionScores(List<Object[]> rows) {
        return rows.stream()
                .map(row -> new QuestionScoreDto(
                        ((Number) row[0]).longValue(),
                        (String) row[1],
                        ((Number) row[2]).doubleValue()))
                .toList();
    }
}
