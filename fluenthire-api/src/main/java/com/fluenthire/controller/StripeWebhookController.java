package com.fluenthire.controller;

import com.fluenthire.entity.ProcessedStripeEvent;
import com.fluenthire.repository.ProcessedStripeEventRepository;
import com.fluenthire.service.CreditService;
import com.fluenthire.service.SubscriptionService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.Invoice;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookController {

    private final SubscriptionService subscriptionService;
    private final CreditService creditService;
    private final ProcessedStripeEventRepository processedEventRepository;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.warn("Invalid Stripe webhook signature");
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        // Idempotency: skip already-processed events
        if (processedEventRepository.existsById(event.getId())) {
            log.info("Duplicate Stripe event ignored: {} ({})", event.getId(), event.getType());
            return ResponseEntity.ok("Event already processed");
        }

        EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject;
        if (deserializer.getObject().isPresent()) {
            stripeObject = deserializer.getObject().get();
        } else {
            try {
                stripeObject = deserializer.deserializeUnsafe();
            } catch (Exception e) {
                log.warn("Failed to deserialize Stripe event data for event: {}", event.getType());
                return ResponseEntity.ok("Event received");
            }
        }

        switch (event.getType()) {
            case "checkout.session.completed" -> {
                if (stripeObject instanceof Session session) {
                    if ("payment".equals(session.getMode())) {
                        creditService.grantPurchasedCredits(session);
                    } else {
                        subscriptionService.handleCheckoutCompleted(session);
                    }
                }
            }
            case "customer.subscription.updated" -> {
                if (stripeObject instanceof com.stripe.model.Subscription subscription) {
                    subscriptionService.handleSubscriptionUpdated(subscription);
                }
            }
            case "customer.subscription.deleted" -> {
                if (stripeObject instanceof com.stripe.model.Subscription subscription) {
                    subscriptionService.handleSubscriptionDeleted(subscription);
                }
            }
            case "invoice.payment_failed" -> {
                if (stripeObject instanceof Invoice invoice) {
                    subscriptionService.handlePaymentFailed(invoice);
                }
            }
            default -> log.debug("Unhandled Stripe event type: {}", event.getType());
        }

        // Mark event as processed
        processedEventRepository.save(ProcessedStripeEvent.builder()
                .eventId(event.getId())
                .eventType(event.getType())
                .build());

        return ResponseEntity.ok("Event processed");
    }
}
