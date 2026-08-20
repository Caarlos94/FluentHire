package com.fluenthire.repository;

import com.fluenthire.entity.Plan;
import com.fluenthire.entity.Subscription;
import com.fluenthire.entity.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByUserId(Long userId);

    Optional<Subscription> findByStripeSubscriptionId(String stripeSubscriptionId);

    int countByPlanAndStatus(Plan plan, SubscriptionStatus status);

    int countByStatusAndCanceledAtBetween(SubscriptionStatus status, LocalDateTime from, LocalDateTime to);

    int countByStatus(SubscriptionStatus status);

    @Query(value = "SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (canceled_at - created_at)) / 86400), 0) " +
            "FROM subscriptions WHERE status = 'CANCELED' AND canceled_at IS NOT NULL", nativeQuery = true)
    double avgDaysBeforeCancel();
}
