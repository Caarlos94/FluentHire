package com.fluenthire.service;

import com.fluenthire.dto.*;
import com.fluenthire.entity.Subscription;
import com.fluenthire.entity.User;
import com.fluenthire.exception.ResourceNotFoundException;
import com.fluenthire.exception.SubscriptionException;
import com.fluenthire.repository.CreditTransactionRepository;
import com.fluenthire.repository.FavoriteQuestionRepository;
import com.fluenthire.repository.FeatureVoteRepository;
import com.fluenthire.repository.FeedbackRepository;
import com.fluenthire.repository.InterviewSessionRepository;
import com.fluenthire.repository.RatingRepository;
import com.fluenthire.repository.UserRepository;
import com.fluenthire.repository.UserResponseRepository;
import com.fluenthire.util.TextSanitizer;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JobDescriptionService jobDescriptionService;
    private final PasswordEncoder passwordEncoder;
    private final CreditTransactionRepository creditTransactionRepository;
    private final UserResponseRepository userResponseRepository;
    private final InterviewSessionRepository interviewSessionRepository;
    private final RatingRepository ratingRepository;
    private final FavoriteQuestionRepository favoriteQuestionRepository;
    private final FeedbackRepository feedbackRepository;
    private final FeatureVoteRepository featureVoteRepository;
    private final TransactionTemplate transactionTemplate;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(String email) {
        User user = findByEmail(email);
        return toResponse(user);
    }

    @Transactional
    public ProfileResponse updateProfile(String email, ProfileRequest request) {
        User user = findByEmail(email);

        user.setNativeLanguage(request.getNativeLanguage());
        user.setEnglishLevel(request.getEnglishLevel());
        user.setCommunicationChallenges(request.getCommunicationChallenges());
        user.setExperienceLevel(request.getExperienceLevel());
        user.setRoleType(request.getRoleType());
        user.setMainLanguage(request.getMainLanguage());
        user.setOnboardingCompleted(true);

        userRepository.save(user);

        return toResponse(user);
    }

    public void deleteProfile(String email) {
        User user = findByEmail(email);
        cancelStripeSubscription(user);

        // Delete related entities (order matters — delete children before parents)
        transactionTemplate.executeWithoutResult(status -> {
            ratingRepository.deleteByUserId(user.getId());
            favoriteQuestionRepository.deleteByUserId(user.getId());
            feedbackRepository.deleteByUserId(user.getId());
            featureVoteRepository.deleteByUserId(user.getId());
            creditTransactionRepository.deleteByUserId(user.getId());
            userResponseRepository.deleteByUserId(user.getId());
            interviewSessionRepository.deleteByUserId(user.getId());
            userRepository.delete(user);
        });
    }

    private void cancelStripeSubscription(User user) {
        Subscription sub = user.getSubscription();
        if (sub != null && sub.getStripeSubscriptionId() != null) {
            try {
                com.stripe.model.Subscription stripeSub =
                        com.stripe.model.Subscription.retrieve(sub.getStripeSubscriptionId());
                stripeSub.cancel();
            } catch (StripeException e) {
                throw new SubscriptionException("Failed to cancel subscription");
            }
        }
    }

    @Transactional
    public JobDescriptionAnalysisResponse updateJobDescription(String email, JobDescriptionRequest request) {
        return jobDescriptionService.analyzeAndSave(email, request.getJobDescription());
    }

    @Transactional
    public ProfileResponse updatePersonalInfo(String email, UpdatePersonalInfoRequest request) {
        User user = findByEmail(email);
        user.setFirstName(TextSanitizer.sanitizeName(request.getFirstName()));
        user.setLastName(TextSanitizer.sanitizeName(request.getLastName()));
        userRepository.save(user);
        return toResponse(user);
    }

    @Transactional
    public ProfileResponse updatePreferences(String email, ProfileRequest request) {
        User user = findByEmail(email);
        user.setNativeLanguage(request.getNativeLanguage());
        user.setEnglishLevel(request.getEnglishLevel());
        user.setCommunicationChallenges(request.getCommunicationChallenges());
        user.setExperienceLevel(request.getExperienceLevel());
        user.setRoleType(request.getRoleType());
        user.setMainLanguage(request.getMainLanguage());
        userRepository.save(user);
        return toResponse(user);
    }

    @Transactional
    public MessageResponse changePassword(String email, ChangePasswordRequest request) {
        User user = findByEmail(email);

        if (user.getPassword() == null) {
            throw new IllegalArgumentException("Cannot change password for Google-authenticated accounts");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new MessageResponse("Password changed successfully");
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ProfileResponse toResponse(User user) {
        String plan = "FREE";
        String subscriptionStatus = null;
        com.fluenthire.entity.Subscription sub = user.getSubscription();
        if (sub != null && sub.getStatus() != com.fluenthire.entity.SubscriptionStatus.CANCELED) {
            plan = sub.getPlan().name();
            subscriptionStatus = sub.getStatus().name();
        }

        return new ProfileResponse(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getNativeLanguage(),
                user.getEnglishLevel(),
                user.getCommunicationChallenges(),
                user.getExperienceLevel(),
                user.getRoleType(),
                user.getMainLanguage(),
                user.getOnboardingCompleted() != null && user.getOnboardingCompleted(),
                user.getJobDescription() != null && !user.getJobDescription().isBlank(),
                user.getJobDescriptionAnalysis() != null,
                user.getCredits() != null ? user.getCredits() : 0,
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : null,
                user.getPassword() != null,
                plan,
                subscriptionStatus,
                user.getRole()
        );
    }
}
