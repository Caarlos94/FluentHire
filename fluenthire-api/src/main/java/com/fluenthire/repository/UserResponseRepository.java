package com.fluenthire.repository;

import com.fluenthire.entity.ResponseMode;
import com.fluenthire.entity.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserResponseRepository extends JpaRepository<UserResponse, Long> {

    int countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    @Query("SELECT COUNT(DISTINCT ur.user.id) FROM UserResponse ur WHERE ur.createdAt BETWEEN :from AND :to")
    int countDistinctUsersByCreatedAtBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @EntityGraph(attributePaths = {"question", "analysis"})
    Page<UserResponse> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT ur FROM UserResponse ur JOIN FETCH ur.user JOIN FETCH ur.question LEFT JOIN FETCH ur.analysis WHERE ur.id = :id")
    Optional<UserResponse> findByIdWithDetails(@Param("id") Long id);

    int countByUserIdAndQuestionId(Long userId, Long questionId);

    @Query("SELECT ur FROM UserResponse ur JOIN FETCH ur.question LEFT JOIN FETCH ur.analysis " +
            "WHERE ur.user.id = :userId AND ur.question.id = :questionId ORDER BY ur.attemptNumber ASC")
    List<UserResponse> findByUserIdAndQuestionIdOrderByAttemptNumberAsc(
            @Param("userId") Long userId, @Param("questionId") Long questionId);

    @Query("SELECT ur FROM UserResponse ur JOIN FETCH ur.analysis " +
            "WHERE ur.user.id = :userId AND ur.question.id = :questionId AND ur.analysis IS NOT NULL " +
            "AND ur.attemptNumber < :attemptNumber ORDER BY ur.attemptNumber DESC LIMIT 1")
    Optional<UserResponse> findPreviousAnalyzedAttempt(
            @Param("userId") Long userId, @Param("questionId") Long questionId, @Param("attemptNumber") Integer attemptNumber);

    @Query("SELECT DISTINCT ur.question.id FROM UserResponse ur WHERE ur.user.id = :userId")
    List<Long> findDistinctQuestionIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT ur.question.id FROM UserResponse ur WHERE ur.user.id = :userId AND ur.mode = :mode")
    List<Long> findDistinctQuestionIdsByUserIdAndMode(@Param("userId") Long userId, @Param("mode") ResponseMode mode);

    @Query("SELECT ur FROM UserResponse ur JOIN FETCH ur.question LEFT JOIN FETCH ur.analysis " +
            "WHERE ur.user.id = :userId ORDER BY ur.question.id ASC, ur.mode ASC, ur.attemptNumber ASC")
    List<UserResponse> findAllByUserIdWithDetails(@Param("userId") Long userId);

    @Query("SELECT q.category, COUNT(ur) FROM UserResponse ur JOIN ur.question q GROUP BY q.category ORDER BY COUNT(ur) DESC")
    List<Object[]> countByQuestionCategory();

    @Query("SELECT EXTRACT(HOUR FROM ur.createdAt), COUNT(ur) FROM UserResponse ur GROUP BY EXTRACT(HOUR FROM ur.createdAt) ORDER BY EXTRACT(HOUR FROM ur.createdAt)")
    List<Object[]> countByHourOfDay();

    @Query("SELECT ur.question.title FROM UserResponse ur WHERE ur.user.id = :userId ORDER BY ur.createdAt DESC LIMIT 1")
    Optional<String> findLastQuestionTitleByUserId(@Param("userId") Long userId);

    void deleteByUserId(Long userId);

    // ── Mode-aware queries ──────────────────────────────────────────

    int countByUserIdAndQuestionIdAndMode(Long userId, Long questionId, ResponseMode mode);

    @Query("SELECT ur FROM UserResponse ur JOIN FETCH ur.question LEFT JOIN FETCH ur.analysis " +
            "WHERE ur.user.id = :userId AND ur.question.id = :questionId AND ur.mode = :mode " +
            "ORDER BY ur.attemptNumber ASC")
    List<UserResponse> findByUserIdAndQuestionIdAndModeOrderByAttemptNumberAsc(
            @Param("userId") Long userId, @Param("questionId") Long questionId, @Param("mode") ResponseMode mode);

    @Query("SELECT ur FROM UserResponse ur JOIN FETCH ur.analysis " +
            "WHERE ur.user.id = :userId AND ur.question.id = :questionId AND ur.mode = :mode " +
            "AND ur.analysis IS NOT NULL AND ur.attemptNumber < :attemptNumber " +
            "ORDER BY ur.attemptNumber DESC LIMIT 1")
    Optional<UserResponse> findPreviousAnalyzedAttemptByMode(
            @Param("userId") Long userId, @Param("questionId") Long questionId,
            @Param("mode") ResponseMode mode, @Param("attemptNumber") Integer attemptNumber);
}
