package com.fluenthire.controller;

import com.fluenthire.dto.SessionRatingRequest;
import com.fluenthire.entity.InterviewSession;
import com.fluenthire.entity.SessionRating;
import com.fluenthire.entity.User;
import com.fluenthire.entity.UserResponse;
import com.fluenthire.exception.ForbiddenAccessException;
import com.fluenthire.exception.ResourceNotFoundException;
import com.fluenthire.repository.InterviewSessionRepository;
import com.fluenthire.repository.RatingRepository;
import com.fluenthire.repository.UserRepository;
import com.fluenthire.repository.UserResponseRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
@Validated
public class RatingController {

    private final UserRepository userRepository;
    private final UserResponseRepository userResponseRepository;
    private final InterviewSessionRepository interviewSessionRepository;
    private final RatingRepository ratingRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> rate(
            Authentication authentication,
            @Valid @RequestBody SessionRatingRequest request) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isNew = false;
        SessionRating sessionRating = ratingRepository.findByUserResponseId(request.getUserResponseId())
                .orElse(null);

        if (sessionRating == null) {
            UserResponse userResponse = userResponseRepository.findById(request.getUserResponseId())
                    .orElseThrow(() -> new ResourceNotFoundException("User response not found"));

            if (!userResponse.getUser().getId().equals(user.getId())) {
                throw new ForbiddenAccessException("You don't have access to this response");
            }

            sessionRating = SessionRating.builder()
                    .user(user)
                    .userResponse(userResponse)
                    .build();
            isNew = true;
        }

        sessionRating.setRating(request.getRating());
        if (request.getFeedback() != null) {
            sessionRating.setFeedback(request.getFeedback());
        }

        ratingRepository.save(sessionRating);

        Map<String, Object> body = new HashMap<>();
        body.put("id", sessionRating.getId());
        body.put("userResponseId", request.getUserResponseId());
        body.put("rating", sessionRating.getRating());
        body.put("feedback", sessionRating.getFeedback());

        return ResponseEntity.status(isNew ? HttpStatus.CREATED : HttpStatus.OK).body(body);
    }

    @GetMapping("/response/{userResponseId}")
    public ResponseEntity<?> getByUserResponse(
            Authentication authentication,
            @PathVariable Long userResponseId) {

        Optional<SessionRating> rating = ratingRepository.findByUserResponseId(userResponseId);

        if (rating.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        SessionRating r = rating.get();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!r.getUser().getId().equals(user.getId())) {
            throw new ForbiddenAccessException("You don't have access to this rating");
        }

        Map<String, Object> body = new HashMap<>();
        body.put("id", r.getId());
        body.put("userResponseId", userResponseId);
        body.put("rating", r.getRating());
        body.put("feedback", r.getFeedback());
        body.put("createdAt", r.getCreatedAt());

        return ResponseEntity.ok(body);
    }

    @Transactional
    @PostMapping("/interview")
    public ResponseEntity<Map<String, Object>> rateInterview(
            Authentication authentication,
            @RequestParam String sessionId,
            @RequestParam @jakarta.validation.constraints.Min(1) @jakarta.validation.constraints.Max(5) Integer rating,
            @RequestParam(required = false) String feedback) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        InterviewSession session = interviewSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new ForbiddenAccessException("You don't have access to this session");
        }

        boolean isNew = false;
        SessionRating sessionRating = ratingRepository.findByInterviewSessionId(session.getId())
                .orElse(null);

        if (sessionRating == null) {
            sessionRating = SessionRating.builder()
                    .user(user)
                    .interviewSession(session)
                    .build();
            isNew = true;
        }

        sessionRating.setRating(rating);
        if (feedback != null) {
            sessionRating.setFeedback(feedback);
        }

        ratingRepository.save(sessionRating);

        Map<String, Object> body = new HashMap<>();
        body.put("id", sessionRating.getId());
        body.put("sessionId", sessionId);
        body.put("rating", sessionRating.getRating());
        body.put("feedback", sessionRating.getFeedback());

        return ResponseEntity.status(isNew ? HttpStatus.CREATED : HttpStatus.OK).body(body);
    }

    @Transactional(readOnly = true)
    @GetMapping("/interview-session/{sessionId}")
    public ResponseEntity<?> getByInterviewSession(
            Authentication authentication,
            @PathVariable String sessionId) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        InterviewSession session = interviewSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new ForbiddenAccessException("You don't have access to this session");
        }

        Optional<SessionRating> rating = ratingRepository.findByInterviewSessionId(session.getId());

        if (rating.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        SessionRating r = rating.get();
        Map<String, Object> body = new HashMap<>();
        body.put("id", r.getId());
        body.put("sessionId", sessionId);
        body.put("rating", r.getRating());
        body.put("feedback", r.getFeedback());
        body.put("createdAt", r.getCreatedAt());

        return ResponseEntity.ok(body);
    }
}
