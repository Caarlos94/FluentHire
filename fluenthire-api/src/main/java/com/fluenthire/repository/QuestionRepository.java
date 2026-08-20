package com.fluenthire.repository;

import com.fluenthire.entity.AlgorithmCategory;
import com.fluenthire.entity.DifficultyLevel;
import com.fluenthire.entity.Question;
import com.fluenthire.entity.QuestionCategory;
import com.fluenthire.entity.QuestionTier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    // --- Paginated queries: two-step approach (IDs first, then fetch with tags) ---

    @Query("SELECT q.id FROM Question q")
    Page<Long> findAllIds(Pageable pageable);

    @Query(value = "SELECT id FROM questions ORDER BY md5(cast(id as text))", countQuery = "SELECT count(*) FROM questions", nativeQuery = true)
    Page<Long> findAllIdsMixed(Pageable pageable);

    @Query("SELECT q.id FROM Question q WHERE q.category = :category")
    Page<Long> findIdsByCategory(@Param("category") QuestionCategory category, Pageable pageable);

    @Query(value = "SELECT id FROM questions WHERE category = :category ORDER BY CASE WHEN lower(title) = 'tell me about yourself' THEN 0 ELSE 1 END, CASE tier WHEN 'MUST_KNOW' THEN 0 WHEN 'COMMONLY_ASKED' THEN 1 WHEN 'REMOTE_SPECIFIC' THEN 2 ELSE 3 END, title",
           countQuery = "SELECT count(*) FROM questions WHERE category = :category",
           nativeQuery = true)
    Page<Long> findIdsByCategoryOrderByTierPriority(@Param("category") String category, Pageable pageable);

    @Query("SELECT q.id FROM Question q WHERE q.difficulty = :difficulty")
    Page<Long> findIdsByDifficulty(@Param("difficulty") DifficultyLevel difficulty, Pageable pageable);

    @Query("SELECT q.id FROM Question q WHERE q.category = :category AND q.difficulty = :difficulty")
    Page<Long> findIdsByCategoryAndDifficulty(@Param("category") QuestionCategory category, @Param("difficulty") DifficultyLevel difficulty, Pageable pageable);

    @Query("SELECT q.id FROM Question q WHERE q.category = :category AND q.tier = :tier")
    Page<Long> findIdsByCategoryAndTier(@Param("category") QuestionCategory category, @Param("tier") QuestionTier tier, Pageable pageable);

    @Query("SELECT q.id FROM Question q WHERE q.id IN (SELECT DISTINCT q2.id FROM Question q2 JOIN q2.tags t WHERE q2.category = :category AND t = :tag)")
    Page<Long> findIdsByCategoryAndTag(@Param("category") QuestionCategory category, @Param("tag") String tag, Pageable pageable);

    @Query("SELECT q.id FROM Question q WHERE q.id IN (SELECT DISTINCT q2.id FROM Question q2 JOIN q2.tags t WHERE q2.category = :category AND q2.difficulty = :difficulty AND t = :tag)")
    Page<Long> findIdsByCategoryAndDifficultyAndTag(@Param("category") QuestionCategory category, @Param("difficulty") DifficultyLevel difficulty, @Param("tag") String tag, Pageable pageable);

    @Query("SELECT q.id FROM Question q WHERE q.category = :category AND q.algorithmCategory = :algorithmCategory")
    Page<Long> findIdsByCategoryAndAlgorithmCategory(@Param("category") QuestionCategory category, @Param("algorithmCategory") AlgorithmCategory algorithmCategory, Pageable pageable);

    @Query("SELECT q.id FROM Question q WHERE q.category = :category AND q.algorithmCategory = :algorithmCategory AND q.difficulty = :difficulty")
    Page<Long> findIdsByCategoryAndAlgorithmCategoryAndDifficulty(@Param("category") QuestionCategory category, @Param("algorithmCategory") AlgorithmCategory algorithmCategory, @Param("difficulty") DifficultyLevel difficulty, Pageable pageable);

    // --- Fetch full entities with tags by IDs (no pagination = no warning) ---

    @EntityGraph(attributePaths = {"tags"})
    @Query("SELECT q FROM Question q WHERE q.id IN :ids")
    List<Question> findAllByIdWithTags(@Param("ids") List<Long> ids);

    // --- Non-paginated (no warning) ---

    @EntityGraph(attributePaths = {"tags"})
    Optional<Question> findById(Long id);

    @EntityGraph(attributePaths = {"tags"})
    List<Question> findAllBy();
}
