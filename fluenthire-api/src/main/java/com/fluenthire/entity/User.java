package com.fluenthire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true)
    private String password;

    private String firstName;

    private String lastName;

    @Builder.Default
    @Column(nullable = false)
    private Boolean enabled = true;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel experienceLevel;

    @Enumerated(EnumType.STRING)
    private RoleType roleType;

    @Enumerated(EnumType.STRING)
    private ProgrammingLanguage mainLanguage;

    @Enumerated(EnumType.STRING)
    private NativeLanguage nativeLanguage;

    @Enumerated(EnumType.STRING)
    private EnglishLevel englishLevel;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_communication_challenges", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "challenge")
    private Set<CommunicationChallenge> communicationChallenges;

    @Builder.Default
    private Boolean onboardingCompleted = false;

    @Builder.Default
    @Column(nullable = false)
    private Integer credits = 0;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private JobDescriptionAnalysis jobDescriptionAnalysis;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Subscription subscription;

    @Column
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "stripe_customer_id", unique = true)
    private String stripeCustomerId;

    @Builder.Default
    private Integer failedLoginAttempts = 0;

    private Instant lockoutUntil;

    private String resetToken;

    private LocalDateTime resetTokenExpiry;

    private LocalDateTime creditReminderSentAt;

    private LocalDateTime winbackEmailSentAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
