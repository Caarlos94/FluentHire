package com.fluenthire.controller;

import com.fluenthire.dto.QuestionResponse;
import com.fluenthire.entity.*;
import com.fluenthire.exception.ResourceNotFoundException;
import com.fluenthire.repository.FavoriteQuestionRepository;
import com.fluenthire.repository.QuestionRepository;
import com.fluenthire.repository.UserRepository;
import com.fluenthire.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
    private final FavoriteQuestionRepository favoriteQuestionRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    @GetMapping("/recommended")
    public ResponseEntity<List<QuestionResponse>> findRecommended(Authentication authentication) {
        List<QuestionResponse> responses = questionService.findRecommended(authentication.getName());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/recommended/job")
    public ResponseEntity<List<QuestionResponse>> findRecommendedForJob(Authentication authentication) {
        List<QuestionResponse> responses = questionService.findRecommendedForJob(authentication.getName());
        return ResponseEntity.ok(responses);
    }

    @GetMapping
    public ResponseEntity<Page<QuestionResponse>> findAll(
            @RequestParam(required = false) QuestionCategory category,
            @RequestParam(required = false) DifficultyLevel difficulty,
            @RequestParam(required = false) QuestionTier tier,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) AlgorithmCategory algorithmCategory,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<QuestionResponse> responses = questionService.findAll(category, difficulty, tier, tag, algorithmCategory, page, size);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> findById(@PathVariable Long id) {
        QuestionResponse response = questionService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<Long>> getFavoriteIds(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Long> ids = favoriteQuestionRepository.findQuestionIdsByUserId(user.getId());
        return ResponseEntity.ok(ids);
    }

    @GetMapping("/favorites/details")
    public ResponseEntity<List<QuestionResponse>> getFavoriteQuestions(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Long> ids = favoriteQuestionRepository.findQuestionIdsByUserId(user.getId());
        List<QuestionResponse> questions = questionService.findByIds(ids);
        return ResponseEntity.ok(questions);
    }

    @PatchMapping("/{id}/favorite")
    @Transactional
    public ResponseEntity<Map<String, Object>> toggleFavorite(
            Authentication authentication,
            @PathVariable Long id) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Optional<FavoriteQuestion> existing =
                favoriteQuestionRepository.findByUserIdAndQuestionId(user.getId(), id);

        if (existing.isPresent()) {
            favoriteQuestionRepository.delete(existing.get());
            return ResponseEntity.ok(Map.of("favorited", false));
        }

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        FavoriteQuestion favorite = FavoriteQuestion.builder()
                .user(user)
                .question(question)
                .build();
        favoriteQuestionRepository.save(favorite);

        return ResponseEntity.ok(Map.of("favorited", true));
    }
}
