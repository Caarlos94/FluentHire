package com.fluenthire.repository;

import com.fluenthire.entity.InterviewSession;
import com.fluenthire.entity.InterviewSessionStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {

    @EntityGraph(attributePaths = {"results"})
    Page<InterviewSession> findByUserIdAndStatusOrderByStartedAtDesc(
            Long userId, InterviewSessionStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"results"})
    Optional<InterviewSession> findBySessionId(String sessionId);

    int countByStatusAndStartedAtBetween(InterviewSessionStatus status, LocalDateTime from, LocalDateTime to);

    @Query("SELECT COUNT(DISTINCT s.user.id) FROM InterviewSession s WHERE s.startedAt BETWEEN :from AND :to")
    int countDistinctUsersByStartedAtBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT COALESCE(AVG(s.durationSeconds), 0) FROM InterviewSession s WHERE s.status = :status AND s.startedAt BETWEEN :from AND :to")
    double avgDurationByStatusAndStartedAtBetween(@Param("status") InterviewSessionStatus status, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT s.format, COUNT(s) FROM InterviewSession s WHERE s.status = 'COMPLETED' GROUP BY s.format")
    List<Object[]> countByFormat();

    @Query("SELECT s.category, COUNT(s) FROM InterviewSession s WHERE s.status = 'COMPLETED' AND s.category IS NOT NULL GROUP BY s.category")
    List<Object[]> countByCategory();

    void deleteByUserId(Long userId);

    int countByUserIdAndStatus(Long userId, InterviewSessionStatus status);
}
