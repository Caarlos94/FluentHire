package com.fluenthire.repository;

import com.fluenthire.entity.QuestionCategory;
import com.fluenthire.entity.SessionRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<SessionRating, Long> {
    Optional<SessionRating> findByUserResponseId(Long userResponseId);
    Optional<SessionRating> findByInterviewSessionId(Long interviewSessionId);

    // Admin: average rating for Q&A Practice (ratings linked to a userResponse)
    @Query("SELECT COALESCE(AVG(sr.rating), 0) FROM SessionRating sr WHERE sr.userResponse IS NOT NULL")
    double avgRatingQaPractice();

    @Query("SELECT COUNT(sr) FROM SessionRating sr WHERE sr.userResponse IS NOT NULL")
    int countQaPracticeRatings();

    // Admin: average rating for Interview AI (ratings linked to an interviewSession)
    @Query("SELECT COALESCE(AVG(sr.rating), 0) FROM SessionRating sr WHERE sr.interviewSession IS NOT NULL")
    double avgRatingInterview();

    @Query("SELECT COUNT(sr) FROM SessionRating sr WHERE sr.interviewSession IS NOT NULL")
    int countInterviewRatings();

    // Admin: average rating for Interview AI by question category
    @Query("SELECT COALESCE(AVG(sr.rating), 0) FROM SessionRating sr " +
           "JOIN sr.interviewSession s WHERE s.category = :category")
    double avgRatingInterviewByCategory(@Param("category") QuestionCategory category);

    @Query("SELECT COUNT(sr) FROM SessionRating sr " +
           "JOIN sr.interviewSession s WHERE s.category = :category")
    int countInterviewRatingsByCategory(@Param("category") QuestionCategory category);

    void deleteByUserId(Long userId);

    // Admin: low ratings (1-2 stars) with feedback
    @Query("SELECT sr FROM SessionRating sr " +
           "JOIN FETCH sr.user " +
           "LEFT JOIN FETCH sr.userResponse " +
           "LEFT JOIN FETCH sr.interviewSession " +
           "WHERE sr.rating <= 2 ORDER BY sr.createdAt DESC")
    List<SessionRating> findLowRatings();
}
