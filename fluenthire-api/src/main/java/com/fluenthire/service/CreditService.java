package com.fluenthire.service;

import com.fluenthire.config.CreditPackConfig;
import com.fluenthire.config.PlanConfig;
import com.fluenthire.dto.CheckoutSessionRequest;
import com.fluenthire.dto.CheckoutSessionResponse;
import com.fluenthire.entity.CreditTransaction;
import com.fluenthire.entity.CreditTransactionType;
import com.fluenthire.entity.Plan;
import com.fluenthire.entity.Subscription;
import com.fluenthire.entity.SubscriptionStatus;
import com.fluenthire.entity.User;
import com.fluenthire.exception.InsufficientCreditsException;
import com.fluenthire.exception.ResourceNotFoundException;
import com.fluenthire.exception.SubscriptionException;
import com.fluenthire.repository.CreditTransactionRepository;
import com.fluenthire.repository.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import io.sentry.Sentry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CreditService {

    private static final int SIGNUP_BONUS = 3;

    private final UserRepository userRepository;
    private final CreditTransactionRepository creditTransactionRepository;
    private final StripeCustomerService stripeCustomerService;
    private final EmailService emailService;
    private final CreditPackConfig creditPackConfig;

    @Value("${stripe.credit-pack-success-url}")
    private String successUrl;

    @Value("${stripe.cancel-url}")
    private String cancelUrl;

    @Transactional(readOnly = true)
    public int getCredits(String email) {
        User user = findByEmail(email);
        return user.getCredits();
    }

    @Transactional
    public void grantSignupBonus(User user) {
        user.setCredits(user.getCredits() + SIGNUP_BONUS);
        userRepository.save(user);

        CreditTransaction tx = CreditTransaction.builder()
                .user(user)
                .amount(SIGNUP_BONUS)
                .type(CreditTransactionType.SIGNUP_BONUS)
                .description("Welcome bonus: " + SIGNUP_BONUS + " free interview credits")
                .build();
        creditTransactionRepository.save(tx);

        log.info("Granted {} signup bonus credits to user {}", SIGNUP_BONUS, user.getEmail());
    }

    @Transactional
    public void deductCredit(String email) {
        // Pessimistic lock to prevent race conditions on concurrent deductions
        User user = userRepository.findByEmailForUpdate(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Subscription sub = user.getSubscription();
        if (sub != null && sub.getStatus() == SubscriptionStatus.PAST_DUE) {
            throw new SubscriptionException(
                    "Your last payment didn't go through. Please update your payment method to continue using interviews.");
        }

        if (user.getCredits() < 1) {
            throw new InsufficientCreditsException("Not enough credits. You need at least 1 credit to start an interview.");
        }

        user.setCredits(user.getCredits() - 1);
        userRepository.save(user);

        CreditTransaction tx = CreditTransaction.builder()
                .user(user)
                .amount(-1)
                .type(CreditTransactionType.INTERVIEW_DEDUCT)
                .description("Interview session credit")
                .build();
        creditTransactionRepository.save(tx);

        log.info("Deducted 1 credit from user {} (remaining: {})", email, user.getCredits());
    }

    @Transactional
    public void grantSubscriptionCredits(User user, Plan plan) {
        int credits = PlanConfig.getMonthlyCredits(plan);
        user.setCredits(user.getCredits() + credits);
        userRepository.save(user);

        CreditTransaction tx = CreditTransaction.builder()
                .user(user)
                .amount(credits)
                .type(CreditTransactionType.SUBSCRIPTION_GRANT)
                .description(plan.name() + " plan monthly grant: " + credits + " credits")
                .build();
        creditTransactionRepository.save(tx);

        log.info("Granted {} subscription credits ({}) to {}", credits, plan, user.getEmail());
    }

    public CheckoutSessionResponse createCheckoutSession(String email, CheckoutSessionRequest request) {

        CreditPackConfig.PackInfo pack = creditPackConfig.fromPriceId(request.getPriceId());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            String customerId = stripeCustomerService.getOrCreateStripeCustomer(user);

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setCustomer(customerId)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .setPaymentIntentData(
                            SessionCreateParams.PaymentIntentData.builder()
                                    .setDescription("FluentHire " + pack.description())
                                    .build())
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setPrice(request.getPriceId())
                            .setQuantity(1L)
                            .build())
                    .putMetadata("userId", user.getId().toString())
                    .putMetadata("priceId", request.getPriceId())
                    .build();

            Session session = Session.create(params);
            return new CheckoutSessionResponse(session.getUrl());
        } catch (StripeException e) {
            log.error("Failed to create checkout session for {}: {}", email, e.getMessage());
            Sentry.captureException(e);
            throw new SubscriptionException("Something went wrong. Please try again. If the error persists, contact support@fluenthire.app");
        }
    }

    @Transactional
    public void grantPurchasedCredits(Session session) {

        User user = userRepository.findById(Long.parseLong(session.getMetadata().get("userId"))).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CreditPackConfig.PackInfo pack = creditPackConfig.fromPriceId(session.getMetadata().get("priceId"));
        int credits = pack.credits();

        user.setCredits(user.getCredits() + credits);
        userRepository.save(user);

        CreditTransaction tx = CreditTransaction.builder()
                .user(user)
                .amount(credits)
                .type(CreditTransactionType.CREDIT_PACK_PURCHASE)
                .description(pack.description() + ": " + credits + " credits")
                .build();
        creditTransactionRepository.save(tx);

        emailService.sendCreditPackConfirmationEmail(
                user.getEmail(), user.getFirstName(), credits, user.getCredits());

        log.info("Granted {} purchased credits to {}", credits, user.getEmail());
    }

    @Transactional
    public void grantMonthlyBonus(User user) {
        user.setCredits(user.getCredits() + 1);
        userRepository.save(user);

        CreditTransaction tx = CreditTransaction.builder()
                .user(user)
                .amount(1)
                .type(CreditTransactionType.MONTHLY_BONUS)
                .description("Monthly bonus: 1 free interview credit")
                .build();
        creditTransactionRepository.save(tx);

        log.info("Granted monthly bonus credit to user {}", user.getEmail());
    }

    @Transactional(readOnly = true)
    public java.util.List<com.fluenthire.dto.CreditTransactionResponse> getTransactionHistory(String email) {
        User user = findByEmail(email);
        return creditTransactionRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(tx -> new com.fluenthire.dto.CreditTransactionResponse(
                        tx.getType().name(),
                        tx.getAmount(),
                        tx.getDescription(),
                        tx.getCreatedAt() != null ? tx.getCreatedAt().toString() : null
                ))
                .toList();
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
