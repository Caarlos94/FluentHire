package com.fluenthire.repository;

import com.fluenthire.entity.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = {"jobDescriptionAnalysis", "subscription", "communicationChallenges"})
    Optional<User> findByEmail(String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmailForUpdate(@Param("email") String email);

    boolean existsByEmail(String email);

    Optional<User> findByResetToken(String resetToken);

    int countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    int countByOnboardingCompleted(Boolean onboardingCompleted);

    @Query("SELECT COUNT(u) FROM User u WHERE u.jobDescriptionAnalysis IS NOT NULL")
    int countWithJobDescription();

    @Query("SELECT u.experienceLevel, COUNT(u) FROM User u WHERE u.experienceLevel IS NOT NULL GROUP BY u.experienceLevel")
    List<Object[]> countByExperienceLevel();

    @Query("SELECT u.roleType, COUNT(u) FROM User u WHERE u.roleType IS NOT NULL GROUP BY u.roleType")
    List<Object[]> countByRoleType();

    @Query("SELECT u.mainLanguage, COUNT(u) FROM User u WHERE u.mainLanguage IS NOT NULL GROUP BY u.mainLanguage")
    List<Object[]> countByMainLanguage();

    int countByPasswordIsNull();

    Optional<User> findByStripeCustomerId(String stripeCustomerId);

    @Query("SELECT u FROM User u LEFT JOIN u.subscription s " +
           "WHERE u.createdAt <= :cutoff AND u.credits > 0 " +
           "AND u.creditReminderSentAt IS NULL " +
           "AND (s IS NULL OR s.status = 'CANCELED')")
    List<User> findEligibleForCreditReminder(@Param("cutoff") LocalDateTime cutoff);

    @Query("SELECT u FROM User u " +
           "WHERE u.winbackEmailSentAt IS NULL " +
           "AND u.createdAt <= :cutoff " +
           "AND u.onboardingCompleted = true " +
           "AND NOT EXISTS (SELECT 1 FROM UserResponse ur WHERE ur.user = u AND ur.createdAt >= :cutoff) " +
           "AND NOT EXISTS (SELECT 1 FROM InterviewSession ses WHERE ses.user = u AND ses.startedAt >= :cutoff)")
    List<User> findEligibleForWinbackEmail(@Param("cutoff") LocalDateTime cutoff);

    @Query("SELECT u FROM User u LEFT JOIN u.subscription s " +
           "WHERE u.credits = 0 " +
           "AND (s IS NULL OR s.plan = 'FREE' OR s.status = 'CANCELED') " +
           "AND NOT EXISTS (SELECT 1 FROM CreditTransaction ct WHERE ct.user = u " +
           "AND ct.type = 'MONTHLY_BONUS' AND ct.createdAt >= :monthStart)")
    List<User> findEligibleForMonthlyBonus(@Param("monthStart") LocalDateTime monthStart);
}
