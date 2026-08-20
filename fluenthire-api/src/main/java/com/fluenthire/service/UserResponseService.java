package com.fluenthire.service;

import com.fluenthire.dto.AttemptSummary;
import com.fluenthire.dto.ProgressResponse;
import com.fluenthire.dto.QuestionHistoryResponse;
import com.fluenthire.dto.UserResponseRequest;
import com.fluenthire.dto.UserResponseResponse;
import com.fluenthire.entity.Analysis;
import com.fluenthire.entity.Question;
import com.fluenthire.entity.ResponseMode;
import com.fluenthire.entity.User;
import com.fluenthire.entity.UserResponse;
import com.fluenthire.exception.ResourceNotFoundException;
import com.fluenthire.repository.InterviewSessionResultRepository;
import com.fluenthire.repository.QuestionRepository;
import com.fluenthire.repository.UserRepository;
import com.fluenthire.repository.UserResponseRepository;
import com.fluenthire.util.TextSanitizer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fluenthire.entity.InterviewSessionResult;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserResponseService {

    private final UserResponseRepository userResponseRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final InterviewSessionResultRepository interviewSessionResultRepository;

    @Transactional
    public UserResponseResponse submit(String email, UserResponseRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + request.getQuestionId()));

        ResponseMode mode = request.getMode() != null ? request.getMode() : ResponseMode.QA;
        int currentAttempts = userResponseRepository.countByUserIdAndQuestionIdAndMode(user.getId(), question.getId(), mode);

        UserResponse userResponse = UserResponse.builder()
                .user(user)
                .question(question)
                .originalResponse(TextSanitizer.sanitize(request.getOriginalResponse()))
                .attemptNumber(currentAttempts + 1)
                .mode(mode)
                .build();

        userResponseRepository.save(userResponse);

        return toResponse(userResponse);
    }

    @Transactional(readOnly = true)
    public QuestionHistoryResponse getQuestionHistory(String email, Long questionId, ResponseMode mode) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        List<UserResponse> attempts = (mode != null)
                ? userResponseRepository.findByUserIdAndQuestionIdAndModeOrderByAttemptNumberAsc(user.getId(), questionId, mode)
                : userResponseRepository.findByUserIdAndQuestionIdOrderByAttemptNumberAsc(user.getId(), questionId);

        if (attempts.isEmpty()) {
            throw new ResourceNotFoundException("No attempts found for this question");
        }

        return buildQuestionHistory(attempts);
    }

    @Transactional(readOnly = true)
    public List<Long> getAttemptedQuestionIds(String email, ResponseMode mode) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (mode == ResponseMode.INTERVIEW) {
            return interviewSessionResultRepository.findDistinctQuestionIdsByUserId(user.getId());
        }
        if (mode != null) {
            return userResponseRepository.findDistinctQuestionIdsByUserIdAndMode(user.getId(), mode);
        }
        return userResponseRepository.findDistinctQuestionIdsByUserId(user.getId());
    }

    @Transactional(readOnly = true)
    public ProgressResponse getProgress(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Single query fetches all responses with questions and analyses
        List<UserResponse> allResponses = userResponseRepository.findAllByUserIdWithDetails(user.getId());

        // Group by question ID (already ordered by question.id ASC, attemptNumber ASC)
        List<QuestionHistoryResponse> questionProgress = new ArrayList<>();
        int totalResponses = 0;
        int totalAnalyses = 0;
        int commScoreSum = 0;
        int techScoreSum = 0;
        int analyzedCount = 0;

        List<UserResponse> currentGroup = new ArrayList<>();
        Long currentQuestionId = null;
        ResponseMode currentMode = null;

        for (UserResponse ur : allResponses) {
            Long qId = ur.getQuestion().getId();
            ResponseMode mode = ur.getMode() != null ? ur.getMode() : ResponseMode.QA;
            if (!qId.equals(currentQuestionId) || !mode.equals(currentMode)) {
                if (!currentGroup.isEmpty()) {
                    questionProgress.add(buildQuestionHistory(currentGroup));
                }
                currentGroup = new ArrayList<>();
                currentQuestionId = qId;
                currentMode = mode;
            }
            currentGroup.add(ur);

            totalResponses++;
            if (ur.getAnalysis() != null) {
                totalAnalyses++;
                commScoreSum += ur.getAnalysis().getCommunicationScore();
                techScoreSum += ur.getAnalysis().getTechnicalScore();
                analyzedCount++;
            }
        }
        // Don't forget the last group
        if (!currentGroup.isEmpty()) {
            questionProgress.add(buildQuestionHistory(currentGroup));
        }

        // Merge interview session results (grouped by questionId)
        List<InterviewSessionResult> interviewResults = interviewSessionResultRepository.findAllByUserId(user.getId());
        Map<Long, List<InterviewSessionResult>> interviewByQuestion = new LinkedHashMap<>();
        for (InterviewSessionResult r : interviewResults) {
            interviewByQuestion.computeIfAbsent(r.getQuestionId(), k -> new ArrayList<>()).add(r);
        }
        for (var entry : interviewByQuestion.entrySet()) {
            questionProgress.add(buildInterviewQuestionHistory(entry.getValue()));
        }

        Double avgComm = analyzedCount > 0 ? Math.round(commScoreSum * 10.0 / analyzedCount) / 10.0 : null;
        Double avgTech = analyzedCount > 0 ? Math.round(techScoreSum * 10.0 / analyzedCount) / 10.0 : null;

        return new ProgressResponse(
                questionProgress.size(),
                totalResponses,
                totalAnalyses,
                avgComm,
                avgTech,
                questionProgress
        );
    }

    private QuestionHistoryResponse buildQuestionHistory(List<UserResponse> attempts) {
        UserResponse first = attempts.get(0);
        UserResponse last = attempts.get(attempts.size() - 1);

        List<AttemptSummary> summaries = attempts.stream()
                .map(ur -> {
                    Analysis a = ur.getAnalysis();
                    return new AttemptSummary(
                            ur.getId(),
                            ur.getAttemptNumber(),
                            a != null ? a.getCommunicationScore() : null,
                            a != null ? a.getTechnicalScore() : null,
                            a != null,
                            ur.getCreatedAt()
                    );
                })
                .toList();

        // Calculate improvement (first analyzed vs last analyzed)
        Integer commImprovement = null;
        Integer techImprovement = null;
        Integer latestCommScore = null;
        Integer latestTechScore = null;

        AttemptSummary firstAnalyzed = summaries.stream().filter(AttemptSummary::analyzed).findFirst().orElse(null);
        AttemptSummary lastAnalyzed = summaries.stream().filter(AttemptSummary::analyzed).reduce((a, b) -> b).orElse(null);

        if (lastAnalyzed != null) {
            latestCommScore = lastAnalyzed.communicationScore();
            latestTechScore = lastAnalyzed.technicalScore();
        }

        if (firstAnalyzed != null && lastAnalyzed != null && !firstAnalyzed.equals(lastAnalyzed)) {
            commImprovement = lastAnalyzed.communicationScore() - firstAnalyzed.communicationScore();
            techImprovement = lastAnalyzed.technicalScore() - firstAnalyzed.technicalScore();
        }

        String mode = first.getMode() != null ? first.getMode().name() : "QA";

        return new QuestionHistoryResponse(
                first.getQuestion().getId(),
                first.getQuestion().getTitle(),
                first.getQuestion().getCategory().name(),
                mode,
                attempts.size(),
                latestCommScore,
                latestTechScore,
                null,
                commImprovement,
                techImprovement,
                summaries
        );
    }

    private QuestionHistoryResponse buildInterviewQuestionHistory(List<InterviewSessionResult> results) {
        InterviewSessionResult first = results.get(0);
        InterviewSessionResult last = results.get(results.size() - 1);

        List<AttemptSummary> summaries = new ArrayList<>();
        for (int i = 0; i < results.size(); i++) {
            InterviewSessionResult r = results.get(i);
            summaries.add(new AttemptSummary(
                    r.getId(),
                    i + 1,
                    r.getCommunicationScore(),
                    r.getTechnicalScore(),
                    true,
                    r.getCreatedAt()
            ));
        }

        Integer commImprovement = null;
        Integer techImprovement = null;
        if (results.size() > 1) {
            commImprovement = last.getCommunicationScore() - first.getCommunicationScore();
            techImprovement = last.getTechnicalScore() - first.getTechnicalScore();
        }

        return new QuestionHistoryResponse(
                first.getQuestionId(),
                first.getQuestionTitle(),
                first.getInterviewSession().getCategory() != null ? first.getInterviewSession().getCategory().name() : "CODING",
                "INTERVIEW",
                results.size(),
                last.getCommunicationScore(),
                last.getTechnicalScore(),
                last.getProblemSolvingScore(),
                commImprovement,
                techImprovement,
                summaries
        );
    }

    private UserResponseResponse toResponse(UserResponse userResponse) {
        return new UserResponseResponse(
                userResponse.getId(),
                userResponse.getQuestion().getId(),
                userResponse.getQuestion().getTitle(),
                userResponse.getOriginalResponse(),
                userResponse.getAttemptNumber(),
                userResponse.getMode() != null ? userResponse.getMode().name() : "QA",
                userResponse.getAnalysis() != null,
                userResponse.getCreatedAt()
        );
    }
}
