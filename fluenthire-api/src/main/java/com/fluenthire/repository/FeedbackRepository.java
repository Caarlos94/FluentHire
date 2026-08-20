package com.fluenthire.repository;

import com.fluenthire.entity.Feedback;
import com.fluenthire.entity.FeedbackCategory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    @EntityGraph(attributePaths = "user")
    List<Feedback> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = "user")
    List<Feedback> findAllByFeedbackCategoryOrderByCreatedAtDesc(FeedbackCategory feedbackCategory);

    void deleteByUserId(Long userId);
}
