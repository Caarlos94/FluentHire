package com.fluenthire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Analysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_response_id", nullable = false, unique = true)
    private UserResponse userResponse;

    @Column(nullable = false)
    private Integer communicationScore;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String communicationFeedback;

    // Communication sub-score breakdown (nullable for backward compat with old records)
    private Integer clarityStructureScore;
    @Column(columnDefinition = "TEXT")
    private String clarityStructureFeedback;
    private Integer grammarVocabularyScore;
    @Column(columnDefinition = "TEXT")
    private String grammarVocabularyFeedback;
    private Integer fillerFluencyScore;
    @Column(columnDefinition = "TEXT")
    private String fillerFluencyFeedback;

    @Column(nullable = false)
    private Integer technicalScore;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String technicalFeedback;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String improvedResponse;

    @Column(columnDefinition = "TEXT")
    private String focusTip;

    @Column(columnDefinition = "TEXT")
    private String codeFeedback;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "tts_audio_data")
    private byte[] ttsAudioData;

    @Column(name = "tts_word_timestamps", columnDefinition = "TEXT")
    private String ttsWordTimestamps;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
