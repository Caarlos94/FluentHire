package com.fluenthire.repository;

import com.fluenthire.entity.InterviewSessionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InterviewSessionResultRepository extends JpaRepository<InterviewSessionResult, Long> {

    @Query("SELECT r FROM InterviewSessionResult r " +
            "JOIN FETCH r.interviewSession s " +
            "JOIN FETCH s.user " +
            "WHERE r.id = :id")
    Optional<InterviewSessionResult> findByIdWithUser(@Param("id") Long id);

    @Query("SELECT COALESCE(AVG(r.communicationScore), 0), COALESCE(AVG(r.technicalScore), 0), COALESCE(AVG(r.problemSolvingScore), 0) " +
            "FROM InterviewSessionResult r WHERE r.createdAt BETWEEN :from AND :to")
    Object[] avgScoresBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT DISTINCT r.questionId FROM InterviewSessionResult r " +
            "WHERE r.interviewSession.user.id = :userId " +
            "AND r.interviewSession.status = com.fluenthire.entity.InterviewSessionStatus.COMPLETED")
    List<Long> findDistinctQuestionIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT r FROM InterviewSessionResult r " +
            "JOIN FETCH r.interviewSession s " +
            "WHERE s.user.id = :userId " +
            "AND r.questionId = :questionId " +
            "AND s.status = com.fluenthire.entity.InterviewSessionStatus.COMPLETED " +
            "ORDER BY r.createdAt ASC")
    List<InterviewSessionResult> findByUserIdAndQuestionId(@Param("userId") Long userId, @Param("questionId") Long questionId);

    @Query("SELECT r FROM InterviewSessionResult r " +
            "JOIN FETCH r.interviewSession s " +
            "WHERE s.user.id = :userId " +
            "AND s.status = com.fluenthire.entity.InterviewSessionStatus.COMPLETED " +
            "ORDER BY r.questionId ASC, r.createdAt ASC")
    List<InterviewSessionResult> findAllByUserId(@Param("userId") Long userId);
}
