package com.fluenthire.service;

import com.fluenthire.entity.User;
import com.fluenthire.exception.SubscriptionException;
import com.fluenthire.repository.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.param.CustomerCreateParams;
import io.sentry.Sentry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripeCustomerService {

    private final UserRepository userRepository;

    public String getOrCreateStripeCustomer(User user) {

        String stripeCustomerId = user.getStripeCustomerId();
        if (stripeCustomerId != null && !stripeCustomerId.isEmpty()) {
            return stripeCustomerId;
        }

        try {
            String fullName = ((user.getFirstName() != null ? user.getFirstName() : "") + " " +
                    (user.getLastName() != null ? user.getLastName() : "")).trim();

            CustomerCreateParams params = CustomerCreateParams.builder()
                    .setEmail(user.getEmail())
                    .setName(fullName.isEmpty() ? user.getEmail() : fullName)
                    .putMetadata("userId", user.getId().toString())
                    .build();

            Customer customer = Customer.create(params);

            user.setStripeCustomerId(customer.getId());
            userRepository.save(user);

            return customer.getId();
        } catch (StripeException e) {
            log.error("Failed to create Stripe customer for {}: {}", user.getEmail(), e.getMessage());
            Sentry.captureException(e);
            throw new SubscriptionException("Failed to create customer: " + e.getMessage());
        }
    }
}
