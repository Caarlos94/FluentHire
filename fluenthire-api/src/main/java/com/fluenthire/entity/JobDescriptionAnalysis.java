package com.fluenthire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "job_description_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDescriptionAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String jobTitle;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel seniorityLevel;

    @Enumerated(EnumType.STRING)
    private RoleType roleType;

    @ElementCollection
    @CollectionTable(name = "jd_technologies", joinColumns = @JoinColumn(name = "jd_analysis_id"))
    @Column(name = "technology")
    private Set<String> technologies;

    @ElementCollection
    @CollectionTable(name = "jd_responsibilities", joinColumns = @JoinColumn(name = "jd_analysis_id"))
    @Column(name = "responsibility", columnDefinition = "TEXT")
    private Set<String> keyResponsibilities;

    @ElementCollection
    @CollectionTable(name = "jd_soft_skills", joinColumns = @JoinColumn(name = "jd_analysis_id"))
    @Column(name = "soft_skill")
    private Set<String> softSkills;

    @Column(columnDefinition = "TEXT")
    private String companyType;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
