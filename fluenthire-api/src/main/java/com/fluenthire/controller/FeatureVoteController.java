package com.fluenthire.controller;

import com.fluenthire.dto.FeatureVoteRequest;
import com.fluenthire.entity.FeatureVote;
import com.fluenthire.entity.User;
import com.fluenthire.exception.ResourceNotFoundException;
import com.fluenthire.repository.FeatureVoteRepository;
import com.fluenthire.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/features")
@RequiredArgsConstructor
public class FeatureVoteController {

    private final FeatureVoteRepository featureVoteRepository;
    private final UserRepository userRepository;

    @GetMapping("/vote/{featureName}")
    public ResponseEntity<Map<String, Object>> getVote(
            Authentication authentication,
            @PathVariable String featureName) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Boolean userVote = featureVoteRepository.findByUserIdAndFeatureName(user.getId(), featureName)
                .map(FeatureVote::getVote)
                .orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("userVote", userVote);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/vote")
    public ResponseEntity<Map<String, Object>> vote(
            Authentication authentication,
            @Valid @RequestBody FeatureVoteRequest request) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Optional<FeatureVote> existing =
                featureVoteRepository.findByUserIdAndFeatureName(user.getId(), request.getFeatureName());

        FeatureVote vote;
        if (existing.isPresent()) {
            vote = existing.get();
            vote.setVote(request.getVote());
        } else {
            vote = FeatureVote.builder()
                    .user(user)
                    .featureName(request.getFeatureName())
                    .vote(request.getVote())
                    .build();
        }
        featureVoteRepository.save(vote);

        return ResponseEntity.ok(Map.of(
                "vote", vote.getVote(),
                "featureName", vote.getFeatureName()
        ));
    }
}
