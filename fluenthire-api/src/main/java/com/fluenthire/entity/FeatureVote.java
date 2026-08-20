package com.fluenthire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "feature_votes", uniqueConstraints =
        @UniqueConstraint(columnNames = {"user_id", "feature_name"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class FeatureVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String featureName;

    @Column(nullable = false)
    private Boolean vote;

    @CreationTimestamp
    private LocalDateTime createdAt;
}