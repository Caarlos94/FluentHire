package com.fluenthire.repository;

import com.fluenthire.entity.Analysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AnalysisRepository extends JpaRepository<Analysis, Long> {

    @Query("SELECT a FROM Analysis a JOIN FETCH a.userResponse ur JOIN FETCH ur.user WHERE a.id = :id")
    Optional<Analysis> findByIdWithUser(@Param("id") Long id);

    @Query("SELECT COALESCE(AVG(a.communicationScore), 0), COALESCE(AVG(a.technicalScore), 0) " +
            "FROM Analysis a WHERE a.createdAt BETWEEN :from AND :to")
    Object[] avgScoresBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT ur.question.id, ur.question.title, (AVG(a.communicationScore) + AVG(a.technicalScore)) / 2.0 " +
            "FROM Analysis a JOIN a.userResponse ur GROUP BY ur.question.id, ur.question.title " +
            "ORDER BY (AVG(a.communicationScore) + AVG(a.technicalScore)) / 2.0 DESC")
    List<Object[]> findHighestScoredQuestions(Pageable pageable);

    @Query("SELECT ur.question.id, ur.question.title, (AVG(a.communicationScore) + AVG(a.technicalScore)) / 2.0 " +
            "FROM Analysis a JOIN a.userResponse ur GROUP BY ur.question.id, ur.question.title " +
            "ORDER BY (AVG(a.communicationScore) + AVG(a.technicalScore)) / 2.0 ASC")
    List<Object[]> findLowestScoredQuestions(Pageable pageable);
}
