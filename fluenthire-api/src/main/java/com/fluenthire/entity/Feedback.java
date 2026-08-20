package com.fluenthire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@AllArgsConstructor // Generates a constructor with one parameter for each field.
@NoArgsConstructor // Generates a constructor with no parameters.
@Getter
@Setter
@Builder

public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Many rows of this entity relate to one row of another entity.
    @JoinColumn(name = "user_id", nullable = false) // Don't load the related entity until it's actually accessed.
    private User user;

    @Column(length = 2000)
    private String feedback;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FeedbackCategory feedbackCategory;

    @Column(nullable = false)
    private String pageUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
