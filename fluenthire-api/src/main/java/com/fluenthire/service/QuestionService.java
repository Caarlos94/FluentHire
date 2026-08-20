package com.fluenthire.service;

import com.fluenthire.dto.QuestionResponse;
import com.fluenthire.entity.AlgorithmCategory;
import com.fluenthire.entity.DifficultyLevel;
import com.fluenthire.entity.JobDescriptionAnalysis;
import com.fluenthire.entity.ProgrammingLanguage;
import com.fluenthire.entity.Question;
import com.fluenthire.entity.QuestionCategory;
import com.fluenthire.entity.QuestionTier;
import com.fluenthire.entity.RoleType;
import com.fluenthire.entity.User;
import com.fluenthire.exception.ResourceNotFoundException;
import com.fluenthire.repository.JobDescriptionAnalysisRepository;
import com.fluenthire.repository.QuestionRepository;
import com.fluenthire.repository.UserResponseRepository;
import com.fluenthire.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final UserResponseRepository userResponseRepository;
    private final JobDescriptionAnalysisRepository jdRepository;

    private static final Map<RoleType, Set<String>> ROLE_TAGS = Map.of(
            RoleType.BACKEND, Set.of("backend", "api", "databases", "microservices", "java", "sql", "rest"),
            RoleType.FRONTEND, Set.of("frontend", "react", "javascript", "css", "ui", "ux"),
            RoleType.FULLSTACK, Set.of("backend", "frontend", "api", "databases", "react", "javascript", "rest"),
            RoleType.DEVOPS, Set.of("devops", "docker", "ci-cd", "infrastructure", "containers", "deployment")
    );

    // Maps user's mainLanguage to question tag names for technology-specific scoring
    private static final Map<ProgrammingLanguage, String> LANGUAGE_TAG = Map.ofEntries(
            Map.entry(ProgrammingLanguage.JAVA, "java"),
            Map.entry(ProgrammingLanguage.PYTHON, "python"),
            Map.entry(ProgrammingLanguage.JAVASCRIPT, "javascript"),
            Map.entry(ProgrammingLanguage.TYPESCRIPT, "typescript"),
            Map.entry(ProgrammingLanguage.CSHARP, "csharp"),
            Map.entry(ProgrammingLanguage.GO, "go"),
            Map.entry(ProgrammingLanguage.RUBY, "ruby"),
            Map.entry(ProgrammingLanguage.PHP, "php"),
            Map.entry(ProgrammingLanguage.REACT, "react"),
            Map.entry(ProgrammingLanguage.NODE_JS, "nodejs"),
            Map.entry(ProgrammingLanguage.AWS, "aws"),
            Map.entry(ProgrammingLanguage.SQL, "sql"),
            Map.entry(ProgrammingLanguage.RUST, "rust"),
            Map.entry(ProgrammingLanguage.CPP, "cpp")
    );

    // Market-weighted question mix per seniority level
    private static final Map<DifficultyLevel, Map<QuestionCategory, Integer>> CATEGORY_MIX = Map.of(
            DifficultyLevel.JUNIOR, Map.of(
                    QuestionCategory.CODING, 4,
                    QuestionCategory.SYSTEM_DESIGN, 1,
                    QuestionCategory.BEHAVIORAL, 2,
                    QuestionCategory.TECHNICAL_KNOWLEDGE, 2
            ),
            DifficultyLevel.MID, Map.of(
                    QuestionCategory.CODING, 3,
                    QuestionCategory.SYSTEM_DESIGN, 2,
                    QuestionCategory.BEHAVIORAL, 2,
                    QuestionCategory.TECHNICAL_KNOWLEDGE, 2
            ),
            DifficultyLevel.SENIOR, Map.of(
                    QuestionCategory.CODING, 2,
                    QuestionCategory.SYSTEM_DESIGN, 2,
                    QuestionCategory.BEHAVIORAL, 3,
                    QuestionCategory.TECHNICAL_KNOWLEDGE, 2
            )
    );

    @Transactional(readOnly = true)
    public List<QuestionResponse> findRecommended(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        DifficultyLevel level = user.getExperienceLevel() != null
                ? user.getExperienceLevel() : DifficultyLevel.MID;
        RoleType role = user.getRoleType();
        Set<String> roleTags = role != null ? ROLE_TAGS.getOrDefault(role, Set.of()) : Set.of();
        String langTag = user.getMainLanguage() != null
                ? LANGUAGE_TAG.get(user.getMainLanguage()) : null;

        List<Question> all = questionRepository.findAllBy();

        Map<QuestionCategory, List<Question>> byCategory = all.stream()
                .collect(Collectors.groupingBy(Question::getCategory));

        Map<QuestionCategory, Integer> mix = CATEGORY_MIX.getOrDefault(level, CATEGORY_MIX.get(DifficultyLevel.MID));

        List<Question> recommended = new ArrayList<>();

        for (var entry : mix.entrySet()) {
            QuestionCategory category = entry.getKey();
            int count = entry.getValue();
            List<Question> pool = byCategory.getOrDefault(category, List.of());

            if (category == QuestionCategory.BEHAVIORAL) {
                List<Question> mustKnow = pool.stream()
                        .filter(q -> q.getTier() == QuestionTier.MUST_KNOW)
                        .collect(Collectors.toCollection(ArrayList::new));

                // Pin "Tell me about yourself" — it's asked in every interview regardless of level
                Question pinned = mustKnow.stream()
                        .filter(q -> q.getTitle().toLowerCase().contains("tell me about yourself"))
                        .findFirst().orElse(null);

                if (pinned != null) {
                    recommended.add(pinned);
                    mustKnow.remove(pinned);
                    Collections.shuffle(mustKnow);
                    recommended.addAll(mustKnow.stream().limit(count - 1).toList());
                } else {
                    Collections.shuffle(mustKnow);
                    recommended.addAll(mustKnow.stream().limit(count).toList());
                }
            } else {
                // Coding, System Design, Technical Knowledge: score by difficulty + language + role
                List<Question> scored = pool.stream()
                        .sorted((a, b) -> Integer.compare(
                                scoreQuestion(b, level, roleTags, langTag),
                                scoreQuestion(a, level, roleTags, langTag)))
                        .limit(count)
                        .toList();
                recommended.addAll(scored);
            }
        }

        return recommended.stream().map(this::toResponse).toList();
    }

    private int scoreQuestion(Question q, DifficultyLevel level, Set<String> roleTags, String langTag) {
        int score = 0;
        if (q.getDifficulty() == level) score += 3;
        if (q.getTags() != null) {
            score += (int) q.getTags().stream().filter(roleTags::contains).count();
            if (langTag != null && q.getTags().contains(langTag)) score += 3;
        }
        return score;
    }

    private int scoreQuestionForJob(Question q, DifficultyLevel level, Set<String> roleTags, Set<String> techTags) {
        int score = 0;
        if (q.getDifficulty() == level) score += 3;
        if (q.getTags() != null) {
            score += (int) q.getTags().stream().filter(roleTags::contains).count();
            // JD technologies get +2 per match (more specific than general role tags)
            score += (int) q.getTags().stream().filter(techTags::contains).count() * 2;
        }
        return score;
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> findRecommendedForJob(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        JobDescriptionAnalysis jd = jdRepository.findByUserId(user.getId()).orElse(null);

        // Resolve level: JD seniority → user profile → default MID
        DifficultyLevel level;
        if (jd != null && jd.getSeniorityLevel() != null) {
            level = jd.getSeniorityLevel();
        } else if (user.getExperienceLevel() != null) {
            level = user.getExperienceLevel();
        } else {
            level = DifficultyLevel.MID;
        }

        // Resolve role: JD role → user profile
        RoleType role;
        if (jd != null && jd.getRoleType() != null) {
            role = jd.getRoleType();
        } else {
            role = user.getRoleType();
        }
        Set<String> roleTags = role != null ? ROLE_TAGS.getOrDefault(role, Set.of()) : Set.of();

        // Resolve technologies: JD technologies → user's main language tag
        Set<String> techTags;
        if (jd != null && jd.getTechnologies() != null && !jd.getTechnologies().isEmpty()) {
            techTags = new HashSet<>(jd.getTechnologies());
        } else {
            String langTag = user.getMainLanguage() != null
                    ? LANGUAGE_TAG.get(user.getMainLanguage()) : null;
            techTags = langTag != null ? Set.of(langTag) : Set.of();
        }

        List<Question> all = questionRepository.findAllBy();

        Map<QuestionCategory, List<Question>> byCategory = all.stream()
                .collect(Collectors.groupingBy(Question::getCategory));

        Map<QuestionCategory, Integer> mix = CATEGORY_MIX.getOrDefault(level, CATEGORY_MIX.get(DifficultyLevel.MID));

        List<Question> recommended = new ArrayList<>();

        for (var entry : mix.entrySet()) {
            QuestionCategory category = entry.getKey();
            int count = entry.getValue();
            List<Question> pool = byCategory.getOrDefault(category, List.of());

            if (category == QuestionCategory.BEHAVIORAL) {
                List<Question> mustKnow = pool.stream()
                        .filter(q -> q.getTier() == QuestionTier.MUST_KNOW)
                        .collect(Collectors.toCollection(ArrayList::new));

                // Pin "Tell me about yourself" — it's asked in every interview regardless of level
                Question pinned = mustKnow.stream()
                        .filter(q -> q.getTitle().toLowerCase().contains("tell me about yourself"))
                        .findFirst().orElse(null);

                if (pinned != null) {
                    recommended.add(pinned);
                    mustKnow.remove(pinned);
                    Collections.shuffle(mustKnow);
                    recommended.addAll(mustKnow.stream().limit(count - 1).toList());
                } else {
                    Collections.shuffle(mustKnow);
                    recommended.addAll(mustKnow.stream().limit(count).toList());
                }
            } else {
                List<Question> scored = pool.stream()
                        .sorted((a, b) -> Integer.compare(
                                scoreQuestionForJob(b, level, roleTags, techTags),
                                scoreQuestionForJob(a, level, roleTags, techTags)))
                        .limit(count)
                        .toList();
                recommended.addAll(scored);
            }
        }

        return recommended.stream().map(this::toResponse).toList();
    }

    public Page<QuestionResponse> findAll(QuestionCategory category, DifficultyLevel difficulty, QuestionTier tier, String tag, AlgorithmCategory algorithmCategory, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // Step 1: Get paginated IDs only (no collection fetch = no HHH90003004 warning)
        Page<Long> idPage;

        if (category != null && algorithmCategory != null && difficulty != null) {
            idPage = questionRepository.findIdsByCategoryAndAlgorithmCategoryAndDifficulty(category, algorithmCategory, difficulty, pageRequest);
        } else if (category != null && algorithmCategory != null) {
            idPage = questionRepository.findIdsByCategoryAndAlgorithmCategory(category, algorithmCategory, pageRequest);
        } else if (category != null && tier != null) {
            idPage = questionRepository.findIdsByCategoryAndTier(category, tier, pageRequest);
        } else if (category != null && difficulty != null && tag != null) {
            idPage = questionRepository.findIdsByCategoryAndDifficultyAndTag(category, difficulty, tag, pageRequest);
        } else if (category != null && difficulty != null) {
            idPage = questionRepository.findIdsByCategoryAndDifficulty(category, difficulty, pageRequest);
        } else if (category != null && tag != null) {
            idPage = questionRepository.findIdsByCategoryAndTag(category, tag, pageRequest);
        } else if (category == QuestionCategory.BEHAVIORAL) {
            idPage = questionRepository.findIdsByCategoryOrderByTierPriority(category.name(), PageRequest.of(page, size));
        } else if (category != null) {
            idPage = questionRepository.findIdsByCategory(category, pageRequest);
        } else if (difficulty != null) {
            idPage = questionRepository.findIdsByDifficulty(difficulty, pageRequest);
        } else {
            // No filters: use md5-based pseudo-random order to mix categories
            idPage = questionRepository.findAllIdsMixed(PageRequest.of(page, size));
        }

        if (idPage.isEmpty()) {
            return idPage.map(id -> null);
        }

        // Step 2: Fetch full entities with tags (no pagination = no warning)
        List<Question> questions = questionRepository.findAllByIdWithTags(idPage.getContent());

        // Preserve the original sort order from step 1
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));
        List<QuestionResponse> ordered = idPage.getContent().stream()
                .map(questionMap::get)
                .map(this::toResponse)
                .toList();

        return new PageImpl<>(ordered, pageRequest, idPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> findByIds(List<Long> ids) {
        if (ids.isEmpty()) return List.of();
        return questionRepository.findAllByIdWithTags(ids).stream()
                .map(this::toResponse)
                .toList();
    }

    public QuestionResponse findById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));

        return toResponse(question);
    }

    private QuestionResponse toResponse(Question question) {
        return new QuestionResponse(
                question.getId(),
                question.getTitle(),
                question.getContent(),
                question.getCategory(),
                question.getDifficulty(),
                question.getTier(),
                question.getTags(),
                question.getExamples(),
                question.getCreatedAt(),
                question.getMethodName(),
                question.getMethodParams(),
                question.getReturnType(),
                question.getAlgorithmCategory()
        );
    }
}
