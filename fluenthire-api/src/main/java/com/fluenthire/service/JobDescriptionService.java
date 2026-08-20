package com.fluenthire.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fluenthire.dto.JobDescriptionAnalysisResponse;
import com.fluenthire.entity.DifficultyLevel;
import com.fluenthire.entity.JobDescriptionAnalysis;
import com.fluenthire.entity.RoleType;
import com.fluenthire.entity.User;
import com.fluenthire.exception.AnalysisException;
import com.fluenthire.exception.ResourceNotFoundException;
import com.fluenthire.repository.JobDescriptionAnalysisRepository;
import com.fluenthire.repository.UserRepository;
import com.fluenthire.util.TextSanitizer;
import io.sentry.Sentry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobDescriptionService {

    private final ClaudeService claudeService;
    private final ApiCostTracker costTracker;
    private final JobDescriptionAnalysisRepository jdRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    private static final String SYSTEM_PROMPT = """
            You are an expert technical recruiter and job description analyst.

            Given a job description, extract structured information in JSON format.

            You MUST respond with valid JSON in exactly this structure:
            {
                "jobTitle": "<the job title as written>",
                "seniorityLevel": "<one of: JUNIOR, MID, SENIOR>",
                "roleType": "<one of: BACKEND, FRONTEND, FULLSTACK, DEVOPS>",
                "technologies": ["<lowercase hyphenated tags>"],
                "keyResponsibilities": ["<short responsibility phrases>"],
                "softSkills": ["<lowercase hyphenated tags>"],
                "companyType": "<brief company description, e.g. fintech startup, enterprise SaaS>"
            }

            Rules for technologies:
            - Use lowercase, hyphenated format: "spring-boot" not "Spring Boot"
            - Include frameworks, languages, databases, cloud services, tools
            - Include both specific and general tags for better matching
            - Follow these mapping conventions:
              Spring Boot -> "spring-boot", "java", "backend"
              React -> "react", "javascript", "frontend"
              Angular -> "angular", "javascript", "frontend"
              Vue -> "vue", "javascript", "frontend"
              Node.js -> "nodejs", "javascript", "backend"
              PostgreSQL -> "postgresql", "sql", "databases"
              MySQL -> "mysql", "sql", "databases"
              MongoDB -> "mongodb", "nosql", "databases"
              Docker -> "docker", "containers", "devops"
              Kubernetes -> "kubernetes", "containers", "devops", "infrastructure"
              AWS -> "aws", "cloud", "infrastructure"
              GCP -> "gcp", "cloud", "infrastructure"
              Azure -> "azure", "cloud", "infrastructure"
              Microservices -> "microservices", "distributed-systems", "backend"
              REST API -> "rest", "api", "backend"
              GraphQL -> "graphql", "api"
              CI/CD -> "ci-cd", "devops", "automation", "deployment"
              Redis -> "redis", "caching", "databases"
              Kafka -> "kafka", "messaging", "queues"
              RabbitMQ -> "rabbitmq", "messaging", "queues"
              Terraform -> "terraform", "infrastructure", "devops"
              JWT/OAuth -> "jwt", "oauth", "security"
              Python -> "python"
              Go/Golang -> "go", "backend"
              TypeScript -> "typescript", "javascript"
              CSS/Tailwind -> "css", "frontend"

            Rules for seniorityLevel:
            - JUNIOR: 0-2 years experience, entry-level, associate, junior
            - MID: 3-5 years experience, mid-level, intermediate
            - SENIOR: 5+ years experience, senior, lead, staff, principal, architect

            Rules for roleType:
            - BACKEND: server-side focused (Java, Python, Go, APIs, databases, microservices)
            - FRONTEND: client-side focused (React, Angular, Vue, CSS, UI/UX)
            - FULLSTACK: both frontend and backend mentioned equally
            - DEVOPS: infrastructure, CI/CD, cloud, SRE, platform engineering focused

            Rules for softSkills:
            - Use lowercase hyphenated format
            - Common tags: "communication", "teamwork", "leadership", "mentoring", \
            "problem-solving", "self-awareness", "time-management", "accountability"

            IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no extra text.
            """;

    @Transactional
    public JobDescriptionAnalysisResponse analyzeAndSave(String email, String jobDescriptionText) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Delete existing analysis if user is updating their JD
        JobDescriptionAnalysis existing = user.getJobDescriptionAnalysis();
        if (existing != null) {
            user.setJobDescriptionAnalysis(null);
            jdRepository.delete(existing);
            jdRepository.flush();
        }

        // Sanitize and save text
        jobDescriptionText = TextSanitizer.sanitize(jobDescriptionText);
        user.setJobDescription(jobDescriptionText);
        userRepository.save(user);

        // Call Claude to parse
        ClaudeService.ClaudeResult claudeResult = claudeService.analyze(SYSTEM_PROMPT, jobDescriptionText);

        costTracker.record(ApiCostTracker.RequestCostRecord.builder()
                .feature("job-description")
                .claudeCost(claudeResult.cost())
                .build());

        try {
            // Strip markdown code fences and repair common LLM JSON issues
            String rawJson = claudeResult.text().trim();
            if (rawJson.startsWith("```")) {
                rawJson = rawJson.replaceFirst("^```\\w*\\s*", "").replaceFirst("\\s*```$", "").trim();
            }
            rawJson = repairJson(rawJson);

            JsonNode json = objectMapper.readTree(rawJson);

            JsonNode jobTitleNode = json.get("jobTitle");
            JsonNode seniorityNode = json.get("seniorityLevel");
            JsonNode roleNode = json.get("roleType");
            JsonNode techNode = json.get("technologies");
            JsonNode respNode = json.get("keyResponsibilities");
            JsonNode softNode = json.get("softSkills");
            JsonNode companyNode = json.get("companyType");

            if (jobTitleNode == null || seniorityNode == null || roleNode == null || techNode == null) {
                log.error("Claude JD response missing required fields: {}", claudeResult.text());
                throw new AnalysisException("AI response was incomplete. Please try again.");
            }

            JobDescriptionAnalysis analysis = JobDescriptionAnalysis.builder()
                    .user(user)
                    .jobTitle(jobTitleNode.asText())
                    .seniorityLevel(DifficultyLevel.valueOf(seniorityNode.asText()))
                    .roleType(RoleType.valueOf(roleNode.asText()))
                    .technologies(jsonArrayToSet(techNode))
                    .keyResponsibilities(jsonArrayToSet(respNode))
                    .softSkills(jsonArrayToSet(softNode))
                    .companyType(companyNode != null ? companyNode.asText() : "Unknown")
                    .build();

            jdRepository.save(analysis);

            return toResponse(analysis);

        } catch (AnalysisException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to parse JD analysis from Claude: {}", claudeResult.text(), e);
            Sentry.captureException(e);
            throw new AnalysisException("Failed to analyze job description. Please try again.", e);
        }
    }

    @Transactional(readOnly = true)
    public JobDescriptionAnalysisResponse getByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        JobDescriptionAnalysis analysis = jdRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No job description analysis found. Please submit a job description first."));

        return toResponse(analysis);
    }

    private Set<String> jsonArrayToSet(JsonNode arrayNode) {
        Set<String> set = new LinkedHashSet<>();
        if (arrayNode != null && arrayNode.isArray()) {
            arrayNode.forEach(node -> set.add(node.asText()));
        }
        return set;
    }

    private JobDescriptionAnalysisResponse toResponse(JobDescriptionAnalysis a) {
        return new JobDescriptionAnalysisResponse(
                a.getId(),
                a.getJobTitle(),
                a.getSeniorityLevel(),
                a.getRoleType(),
                a.getTechnologies() != null ? List.copyOf(a.getTechnologies()) : List.of(),
                a.getKeyResponsibilities() != null ? List.copyOf(a.getKeyResponsibilities()) : List.of(),
                a.getSoftSkills() != null ? List.copyOf(a.getSoftSkills()) : List.of(),
                a.getCompanyType(),
                a.getCreatedAt()
        );
    }

    private String repairJson(String json) {
        json = json.replaceAll("\"\\s*\\n(\\s*)\"", "\",\n$1\"");
        json = json.replaceAll("\\}\\s*\\n(\\s*)\"", "},\n$1\"");
        json = json.replaceAll(",\\s*}", "}");
        json = json.replaceAll(",\\s*]", "]");
        return json;
    }
}
