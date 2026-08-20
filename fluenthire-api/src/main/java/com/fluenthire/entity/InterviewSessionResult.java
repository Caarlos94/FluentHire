package com.fluenthire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_session_results", indexes = {
        @Index(name = "idx_interview_result_session_id", columnList = "interview_session_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewSessionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_session_id", nullable = false)
    private InterviewSession interviewSession;

    @Column(nullable = false)
    private Long questionId;

    private String questionTitle;

    @Column(nullable = false)
    private Integer communicationScore;

    @Column(nullable = false)
    private Integer technicalScore;

    @Column(nullable = false)
    private Integer problemSolvingScore;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String feedback;

    @Column(columnDefinition = "TEXT")
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

    @Column(columnDefinition = "TEXT")
    private String technicalFeedback;

    @Column(columnDefinition = "TEXT")
    private String problemSolvingFeedback;

    @Column(columnDefinition = "TEXT")
    private String improvedResponse;

    @Column(columnDefinition = "TEXT")
    private String focusTip;

    @Column(columnDefinition = "TEXT")
    private String codeFeedback;

    @Column(columnDefinition = "TEXT")
    private String codeSubmitted;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "tts_audio_data")
    private byte[] ttsAudioData;

    @Column(name = "tts_word_timestamps", columnDefinition = "TEXT")
    private String ttsWordTimestamps;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
