package com.fluenthire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interview_sessions", indexes = {
        @Index(name = "idx_interview_session_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewFormat format;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private InterviewSessionStatus status = InterviewSessionStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String transcriptJson;

    @Column(columnDefinition = "TEXT")
    private String problemsJson;

    @OneToMany(mappedBy = "interviewSession", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InterviewSessionResult> results = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private QuestionCategory category;

    private String personality;

    private String speakingSpeed;

    private String focusArea;

    private Integer durationSeconds;

    @CreationTimestamp
    private LocalDateTime startedAt;

    private LocalDateTime endedAt;
}
