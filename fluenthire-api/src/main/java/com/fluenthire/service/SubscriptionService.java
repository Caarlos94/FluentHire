package com.fluenthire.service;

import com.fluenthire.config.PlanConfig;
import com.fluenthire.dto.CheckoutSessionRequest;
import com.fluenthire.dto.CheckoutSessionResponse;
import com.fluenthire.dto.SubscriptionResponse;
import com.fluenthire.entity.Plan;
import com.fluenthire.entity.Subscription;
import com.fluenthire.entity.SubscriptionStatus;
import com.fluenthire.entity.User;
import com.fluenthire.exception.ResourceNotFoundException;
import com.fluenthire.exception.SubscriptionException;
import com.fluenthire.repository.SubscriptionRepository;
import com.fluenthire.repository.UserRepository;
import io.sentry.Sentry;
import com.stripe.exception.StripeException;
import com.stripe.model.Invoice;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final StripeCustomerService stripeCustomerService;
    private final UserRepository userRepository;
    private final CreditService creditService;
    private final EmailService emailService;
    private final PlanConfig planConfig;

    @Value("${stripe.success-url}")
    private String successUrl;

    @Value("${stripe.cancel-url}")
    private String cancelUrl;

    @Value("${stripe.billing-return-url}")
    private String billingReturnUrl;

    @Transactional(readOnly = true)
    public SubscriptionResponse getSubscription(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Subscription sub = user.getSubscription();
        if (sub == null) {
            return new SubscriptionResponse("FREE", "ACTIVE", null, false);
        }
        return toResponse(sub);
    }

    public CheckoutSessionResponse createCheckoutSession(String email, CheckoutSessionRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            String customerId = stripeCustomerService.getOrCreateStripeCustomer(user);

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                    .setCustomer(customerId)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setPrice(request.getPriceId())
                            .setQuantity(1L)
                            .build())
                    .putMetadata("userId", user.getId().toString())
                    .build();

            Session session = Session.create(params);
            return new CheckoutSessionResponse(session.getUrl());
        } catch (StripeException e) {
            log.error("Failed to create checkout session for {}: {}", email, e.getMessage());
            Sentry.captureException(e);
            throw new SubscriptionException("Something went wrong. Please try again. If the error persists, contact support@fluenthire.app");
        }
    }

    public CheckoutSessionResponse createBillingPortalSession(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String stripeCustomerId = user.getStripeCustomerId();
        if (stripeCustomerId == null) {
            throw new SubscriptionException("No active subscription found");
        }

        try {
            com.stripe.param.billingportal.SessionCreateParams params =
                    com.stripe.param.billingportal.SessionCreateParams.builder()
                            .setCustomer(stripeCustomerId)
                            .setReturnUrl(billingReturnUrl)
                            .build();

            com.stripe.model.billingportal.Session session =
                    com.stripe.model.billingportal.Session.create(params);
            return new CheckoutSessionResponse(session.getUrl());
        } catch (StripeException e) {
            log.error("Failed to create billing portal session for {}: {}", email, e.getMessage());
            Sentry.captureException(e);
            throw new SubscriptionException("Something went wrong. Please try again. If the error persists, contact support@fluenthire.app");
        }
    }

    public SubscriptionResponse cancelSubscription(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Subscription sub = user.getSubscription();
        if (sub == null || sub.getStripeSubscriptionId() == null) {
            throw new SubscriptionException("No active subscription found");
        }

        try {
            com.stripe.model.Subscription stripeSub =
                    com.stripe.model.Subscription.retrieve(sub.getStripeSubscriptionId());

            com.stripe.param.SubscriptionUpdateParams params =
                    com.stripe.param.SubscriptionUpdateParams.builder()
                            .setCancelAtPeriodEnd(true)
                            .build();
            stripeSub.update(params);

            sub.setCancelAtPeriodEnd(true);
            subscriptionRepository.save(sub);

            log.info("Subscription canceled at period end for user {}", email);
            return toResponse(sub);
        } catch (StripeException e) {
            log.error("Failed to cancel subscription for {}: {}", email, e.getMessage());
            Sentry.captureException(e);
            throw new SubscriptionException("Something went wrong. Please try again. If the error persists, contact support@fluenthire.app");
        }
    }

    // ── Webhook handlers ──

    @Transactional
    public void handleCheckoutCompleted(Session session) {
        String stripeSubId = session.getSubscription();

        String userIdStr = session.getMetadata() != null ? session.getMetadata().get("userId") : null;
        if (userIdStr == null) {
            log.error("Missing userId in checkout session metadata: {}", session.getId());
            throw new SubscriptionException("Missing userId in session metadata");
        }
        Long userId = Long.parseLong(userIdStr);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            com.stripe.model.Subscription stripeSub =
                    com.stripe.model.Subscription.retrieve(stripeSubId);

            String priceId = extractPriceId(stripeSub);
            Plan plan = planConfig.getPlanForPriceId(priceId);

            Subscription sub = subscriptionRepository.findByUserId(user.getId())
                    .orElse(new Subscription());

            sub.setUser(user);
            sub.setPlan(plan);
            sub.setStatus(mapStripeStatus(stripeSub.getStatus()));
            sub.setStripeSubscriptionId(stripeSubId);
            sub.setStripePriceId(priceId);
            var item = stripeSub.getItems().getData().get(0);
            sub.setCurrentPeriodStart(toLocalDateTime(item.getCurrentPeriodStart()));
            sub.setCurrentPeriodEnd(toLocalDateTime(item.getCurrentPeriodEnd()));
            sub.setCancelAtPeriodEnd(stripeSub.getCancelAtPeriodEnd());

            subscriptionRepository.save(sub);
            creditService.grantSubscriptionCredits(user, plan);

            emailService.sendSubscriptionConfirmationEmail(
                    user.getEmail(),
                    user.getFirstName(),
                    plan.getDisplayName(),
                    PlanConfig.getMonthlyCredits(plan));

            log.info("Checkout completed: user={}, plan={}, stripeSubId={}",
                    user.getEmail(), plan, stripeSubId);
        } catch (StripeException e) {
            log.error("Failed to process checkout completion: {}", e.getMessage());
            Sentry.captureException(e);
            throw new SubscriptionException("Failed to process checkout: " + e.getMessage());
        }
    }

    @Transactional
    public void handleSubscriptionUpdated(com.stripe.model.Subscription stripeSub) {
        String stripeSubId = stripeSub.getId();

        Subscription sub = subscriptionRepository.findByStripeSubscriptionId(stripeSubId)
                .orElse(null);
        if (sub == null) {
            log.warn("Subscription not found for stripe sub: {}", stripeSubId);
            return;
        }

        String priceId = extractPriceId(stripeSub);
        Plan newPlan = planConfig.getPlanForPriceId(priceId);
        var item = stripeSub.getItems().getData().get(0);
        LocalDateTime newPeriodStart = toLocalDateTime(item.getCurrentPeriodStart());

        // Detect renewal: period start has advanced
        boolean isRenewal = sub.getCurrentPeriodStart() != null
                && newPeriodStart != null
                && newPeriodStart.isAfter(sub.getCurrentPeriodStart());

        sub.setPlan(newPlan);
        sub.setStatus(mapStripeStatus(stripeSub.getStatus()));
        sub.setStripePriceId(priceId);
        sub.setCurrentPeriodStart(newPeriodStart);
        sub.setCurrentPeriodEnd(toLocalDateTime(item.getCurrentPeriodEnd()));
        sub.setCancelAtPeriodEnd(stripeSub.getCancelAtPeriodEnd());

        subscriptionRepository.save(sub);

        if (isRenewal && sub.getStatus() == SubscriptionStatus.ACTIVE) {
            // Fetch user explicitly to avoid lazy loading NPE
            User user = userRepository.findById(sub.getUser().getId())
                    .orElse(null);
            if (user != null) {
                creditService.grantSubscriptionCredits(user, newPlan);
                log.info("Renewal credits granted: user={}, plan={}", user.getEmail(), newPlan);
            }
        }
    }

    @Transactional
    public void handleSubscriptionDeleted(com.stripe.model.Subscription stripeSub) {
        String stripeSubId = stripeSub.getId();

        subscriptionRepository.findByStripeSubscriptionId(stripeSubId).ifPresent(sub -> {
            sub.setStatus(SubscriptionStatus.CANCELED);
            sub.setCanceledAt(LocalDateTime.now());
            subscriptionRepository.save(sub);
            log.info("Subscription deleted: user={}", sub.getUser().getEmail());
        });
    }

    @Transactional
    public void handlePaymentFailed(Invoice invoice) {
        String customerId = invoice.getCustomer();

        userRepository.findByStripeCustomerId(customerId).ifPresent(user -> {
            Subscription sub = user.getSubscription();
            if(sub != null) {
                sub.setStatus(SubscriptionStatus.PAST_DUE);
                subscriptionRepository.save(sub);

                emailService.sendPaymentFailedEmail(user.getEmail(), user.getFirstName());

                log.info("Payment failed, subscription past due: user={}", user.getEmail());
            }
        });
    }

    // ── Helpers ──

    public Plan getEffectivePlan(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Subscription sub = user.getSubscription();
        if (sub == null || sub.getStatus() == SubscriptionStatus.CANCELED) {
            return Plan.FREE;
        }
        return sub.getPlan();
    }

    private SubscriptionStatus mapStripeStatus(String status) {
        return switch (status) {
            case "active" -> SubscriptionStatus.ACTIVE;
            case "past_due" -> SubscriptionStatus.PAST_DUE;
            case "canceled" -> SubscriptionStatus.CANCELED;
            case "trialing" -> SubscriptionStatus.TRIALING;
            case "incomplete" -> SubscriptionStatus.INCOMPLETE;
            default -> SubscriptionStatus.ACTIVE;
        };
    }

    private String extractPriceId(com.stripe.model.Subscription stripeSub) {
        if (stripeSub.getItems() == null || stripeSub.getItems().getData() == null
                || stripeSub.getItems().getData().isEmpty()) {
            log.error("Stripe subscription has no line items: {}", stripeSub.getId());
            throw new SubscriptionException("Subscription has no line items");
        }
        return stripeSub.getItems().getData().get(0).getPrice().getId();
    }

    private LocalDateTime toLocalDateTime(Long epochSeconds) {
        if (epochSeconds == null) return null;
        return LocalDateTime.ofInstant(
                Instant.ofEpochSecond(epochSeconds),
                ZoneOffset.UTC);
    }

    private SubscriptionResponse toResponse(Subscription sub) {
        return new SubscriptionResponse(
                sub.getPlan().name(),
                sub.getStatus().name(),
                sub.getCurrentPeriodEnd() != null ? sub.getCurrentPeriodEnd().toString() : null,
                sub.getCancelAtPeriodEnd() != null && sub.getCancelAtPeriodEnd()
        );
    }
}
