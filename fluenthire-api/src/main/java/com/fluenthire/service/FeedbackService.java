package com.fluenthire.service;

import com.fluenthire.dto.FeedbackResponse;
import com.fluenthire.dto.FeedbackRequest;
import com.fluenthire.entity.Feedback;
import com.fluenthire.entity.FeedbackCategory;
import com.fluenthire.entity.User;
import com.fluenthire.exception.ResourceNotFoundException;
import com.fluenthire.repository.FeedbackRepository;
import com.fluenthire.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;

    public FeedbackResponse submitFeedback(String email, FeedbackRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Feedback feedback = Feedback.builder()
                .user(user)
                .feedback(request.getFeedback())
                .feedbackCategory(request.getFeedbackCategory())
                .pageUrl(request.getPageUrl())
                .build();

        feedbackRepository.save(feedback);

        return mapToResponse(feedback);
    }

    public List<FeedbackResponse> getAllFeedbacks() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<FeedbackResponse> getFeedbackByCategory(FeedbackCategory category) {
        return feedbackRepository.findAllByFeedbackCategoryOrderByCreatedAtDesc(category)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private FeedbackResponse mapToResponse(Feedback feedback) {
        User user = feedback.getUser();
        return new FeedbackResponse(
                feedback.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                feedback.getFeedback(),
                feedback.getFeedbackCategory(),
                feedback.getPageUrl(),
                feedback.getCreatedAt()
        );
    }
}
