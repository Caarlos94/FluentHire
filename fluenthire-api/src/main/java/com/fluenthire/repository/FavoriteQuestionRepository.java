package com.fluenthire.repository;

import com.fluenthire.entity.FavoriteQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FavoriteQuestionRepository extends JpaRepository<FavoriteQuestion, Long> {

    Optional<FavoriteQuestion> findByUserIdAndQuestionId(Long userId, Long questionId);

    @Query("SELECT fq.question.id FROM FavoriteQuestion fq WHERE fq.user.id = :userId")
    List<Long> findQuestionIdsByUserId(@Param("userId") Long userId);

    void deleteByUserId(Long userId);
}
