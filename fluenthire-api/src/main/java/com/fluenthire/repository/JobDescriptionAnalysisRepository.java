package com.fluenthire.repository;

import com.fluenthire.entity.JobDescriptionAnalysis;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobDescriptionAnalysisRepository extends JpaRepository<JobDescriptionAnalysis, Long> {

    @EntityGraph(attributePaths = {"technologies", "keyResponsibilities", "softSkills"})
    Optional<JobDescriptionAnalysis> findByUserId(Long userId);

    void deleteByUserId(Long userId);
}
