package com.fluenthire.repository;

import com.fluenthire.entity.FeatureVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeatureVoteRepository extends JpaRepository<FeatureVote, Long> {

    Optional<FeatureVote> findByUserIdAndFeatureName(Long userId, String featureName);
    
    long countFeatureVoteByVoteAndFeatureName(Boolean vote, String featureName);

    void deleteByUserId(Long userId);
}
