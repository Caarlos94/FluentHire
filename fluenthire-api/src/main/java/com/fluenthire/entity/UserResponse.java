package com.fluenthire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_responses", indexes = {
        @Index(name = "idx_user_response_user_id", columnList = "user_id"),
        @Index(name = "idx_user_response_question_id", columnList = "question_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String originalResponse;

    @Builder.Default
    @Column(nullable = false)
    private Integer attemptNumber = 1;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(255) DEFAULT 'QA'")
    private ResponseMode mode = ResponseMode.QA;

    @OneToOne(mappedBy = "userResponse", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Analysis analysis;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
