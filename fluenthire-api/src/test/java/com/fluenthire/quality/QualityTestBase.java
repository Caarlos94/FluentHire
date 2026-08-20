package com.fluenthire.quality;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fluenthire.dto.InterviewCompleteRequest;
import com.fluenthire.dto.InterviewCompleteRequest.CodeSnapshot;
import com.fluenthire.dto.InterviewCompleteRequest.TranscriptMessage;
import com.fluenthire.dto.InterviewSessionResponse;
import com.fluenthire.entity.*;
import com.fluenthire.repository.InterviewSessionRepository;
import com.fluenthire.repository.QuestionRepository;
import com.fluenthire.repository.UserRepository;
import com.fluenthire.service.InterviewService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.support.TransactionTemplate;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@SpringBootTest
@ActiveProfiles("test")
@Tag("e2e-quality")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Import(TestMockConfig.class)
@ExtendWith(QualityReportExtension.class)
public abstract class QualityTestBase {

    @Autowired
    protected InterviewService interviewService;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected QuestionRepository questionRepository;

    @Autowired
    protected InterviewSessionRepository interviewSessionRepository;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    private TransactionTemplate transactionTemplate;

    // Test personas (persisted)
    protected User juniorSpanish;
    protected User midEnglish;
    protected User seniorPortuguese;

    // Resolved question IDs per category
    protected Long behavioralQuestionId;
    protected Long codingQuestionId;
    protected Long systemDesignQuestionId;

    @BeforeAll
    void setUpTestData() {
        // Clean up any leftover test users from previous runs
        cleanUpTestUsers();

        // Create and persist test personas
        juniorSpanish = userRepository.save(TestPersonas.juniorSpanish());
        midEnglish = userRepository.save(TestPersonas.midEnglish());
        seniorPortuguese = userRepository.save(TestPersonas.seniorPortuguese());

        // Resolve question IDs from seeded data (DataSeeder runs on context startup)
        behavioralQuestionId = questionRepository
                .findIdsByCategory(QuestionCategory.BEHAVIORAL, PageRequest.of(0, 1))
                .getContent().get(0);
        codingQuestionId = questionRepository
                .findIdsByCategory(QuestionCategory.CODING, PageRequest.of(0, 1))
                .getContent().get(0);
        systemDesignQuestionId = questionRepository
                .findIdsByCategory(QuestionCategory.SYSTEM_DESIGN, PageRequest.of(0, 1))
                .getContent().get(0);
    }

    @AfterAll
    void cleanUpTestData() {
        cleanUpTestUsers();
    }

    private void cleanUpTestUsers() {
        transactionTemplate.executeWithoutResult(status -> {
            List.of(
                    "test-quality-junior-es@fluenthire.test",
                    "test-quality-mid-en@fluenthire.test",
                    "test-quality-senior-pt@fluenthire.test"
            ).forEach(email -> userRepository.findByEmail(email).ifPresent(user -> {
                interviewSessionRepository.deleteByUserId(user.getId());
                userRepository.delete(user);
            }));
        });
    }

    // ─── Helpers ──────────────────────────────────────────────────────

    /**
     * Creates an ACTIVE InterviewSession directly in the DB, bypassing OpenAI + credit deduction.
     */
    protected InterviewSession createTestSession(User user, InterviewFormat format,
                                                  QuestionCategory category, String personality,
                                                  List<Long> questionIds) {
        try {
            InterviewSession session = InterviewSession.builder()
                    .sessionId(UUID.randomUUID().toString())
                    .user(user)
                    .format(format)
                    .category(category)
                    .personality(personality)
                    .speakingSpeed("NORMAL")
                    .status(InterviewSessionStatus.ACTIVE)
                    .problemsJson(objectMapper.writeValueAsString(questionIds))
                    .build();
            return interviewSessionRepository.save(session);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create test session", e);
        }
    }

    /**
     * Runs a full session: create session → call completeSession → return response.
     */
    protected InterviewSessionResponse runSession(User user, InterviewFormat format,
                                                   QuestionCategory category, String personality,
                                                   Long questionId, String transcriptFixture,
                                                   String codeFixture) {
        InterviewSession session = createTestSession(user, format, category, personality, List.of(questionId));
        InterviewCompleteRequest request = buildCompleteRequest(transcriptFixture, codeFixture, questionId);
        return interviewService.completeSession(user.getEmail(), session.getSessionId(), request);
    }

    protected InterviewCompleteRequest buildCompleteRequest(String transcriptFixture,
                                                             String codeFixture, Long questionId) {
        InterviewCompleteRequest request = new InterviewCompleteRequest();
        request.setTranscript(loadTranscript(transcriptFixture));

        if (codeFixture != null) {
            CodeSnapshot snapshot = new CodeSnapshot();
            snapshot.setQuestionId(questionId);
            snapshot.setCode(loadFixtureString(codeFixture));
            snapshot.setLanguage("python");
            request.setCodeSnapshots(List.of(snapshot));
        }

        return request;
    }

    protected List<TranscriptMessage> loadTranscript(String fixturePath) {
        try (InputStream is = new ClassPathResource("fixtures/transcripts/" + fixturePath).getInputStream()) {
            return objectMapper.readValue(is, new TypeReference<>() {});
        } catch (IOException e) {
            throw new RuntimeException("Failed to load transcript fixture: " + fixturePath, e);
        }
    }

    protected String loadFixtureString(String fixturePath) {
        try (InputStream is = new ClassPathResource("fixtures/" + fixturePath).getInputStream()) {
            return new String(is.readAllBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to load fixture: " + fixturePath, e);
        }
    }

    /** Count words in a string (split on whitespace). */
    protected int wordCount(String text) {
        if (text == null || text.isBlank()) return 0;
        return text.trim().split("\\s+").length;
    }

    /** Jaccard similarity between two strings (word-level). */
    protected double jaccardSimilarity(String a, String b) {
        if (a == null || b == null) return 0;
        Set<String> wordsA = new HashSet<>(List.of(a.toLowerCase().split("\\s+")));
        Set<String> wordsB = new HashSet<>(List.of(b.toLowerCase().split("\\s+")));
        long intersection = wordsA.stream().filter(wordsB::contains).count();
        long union = wordsA.size() + wordsB.size() - intersection;
        return union == 0 ? 0 : (double) intersection / union;
    }

    /** Extract all candidate text from a transcript fixture. */
    protected String extractCandidateText(List<TranscriptMessage> transcript) {
        StringBuilder sb = new StringBuilder();
        for (var msg : transcript) {
            if ("user".equals(msg.getRole()) || "candidate".equals(msg.getRole())) {
                sb.append(msg.getText()).append(" ");
            }
        }
        return sb.toString().trim();
    }
}
