package com.fluenthire.config.seed;

import com.fluenthire.entity.DifficultyLevel;
import com.fluenthire.entity.Question;
import com.fluenthire.entity.QuestionCategory;
import com.fluenthire.entity.QuestionTier;

import java.util.List;

public final class BehavioralQuestions {

    private BehavioralQuestions() {}

    public static List<Question> getAll() {
        return List.of(
                // ── TIER 1: MUST KNOW ──
                bq("Tell me about yourself",
                        "Give me a brief overview of your background, experience, and what you're looking for in your next role.",
                        DifficultyLevel.JUNIOR, QuestionTier.MUST_KNOW, "introduction", "general", "soft-skills"),

                bq("Why are you leaving your current job?",
                        "What motivates you to look for a new opportunity? What are you hoping to find in your next role?",
                        DifficultyLevel.JUNIOR, QuestionTier.MUST_KNOW, "motivation", "career-goals", "general"),

                bq("Disagreement with a teammate",
                        "Tell me about a time you had a conflict or disagreement with a coworker. How did you handle it and what was the outcome?",
                        DifficultyLevel.MID, QuestionTier.MUST_KNOW, "conflict-resolution", "teamwork", "communication"),

                bq("A challenging problem you solved",
                        "Tell me about a challenging or complex technical problem you solved. Walk me through your diagnostic process, what alternatives you considered, and the result.",
                        DifficultyLevel.MID, QuestionTier.MUST_KNOW, "problem-solving", "resilience", "technical-depth"),

                bq("Biggest professional failure",
                        "Tell me about a time you failed at work. What happened, what did you learn, and how did it change your approach?",
                        DifficultyLevel.MID, QuestionTier.MUST_KNOW, "self-awareness", "growth", "accountability"),

                bq("Handling ambiguous requirements",
                        "Tell me about a time you had to adapt to a major change or navigate ambiguity. How did you maintain quality and deliver results despite the uncertainty?",
                        DifficultyLevel.MID, QuestionTier.MUST_KNOW, "ambiguity", "adaptability", "resilience"),

                bq("Cross-team collaboration",
                        "Tell me about a time you worked effectively within a team. Describe your specific role, how you divided work, and how you handled any friction or misalignment.",
                        DifficultyLevel.MID, QuestionTier.MUST_KNOW, "cross-team", "collaboration", "communication"),

                bq("Leadership without authority",
                        "Tell me about a time you demonstrated leadership or drove a project forward without having formal authority. How did you influence others and what was the result?",
                        DifficultyLevel.SENIOR, QuestionTier.MUST_KNOW, "leadership", "influence", "ownership"),

                bq("Why should we hire you?",
                        "What makes you the right person for this role? Highlight your unique strengths, relevant experience, and the specific value you would bring to the team.",
                        DifficultyLevel.JUNIOR, QuestionTier.MUST_KNOW, "self-advocacy", "motivation", "soft-skills"),

                bq("Why are you interested in this role?",
                        "What attracted you to this position and this company? How does it align with your career goals and what you're looking for in your next opportunity?",
                        DifficultyLevel.JUNIOR, QuestionTier.MUST_KNOW, "motivation", "career-goals", "general"),

                bq("What is your greatest strength and weakness?",
                        "Describe a professional strength that makes you effective in your role, and a genuine weakness you've been working to improve. Give specific examples for both.",
                        DifficultyLevel.JUNIOR, QuestionTier.MUST_KNOW, "self-awareness", "growth", "soft-skills"),

                // ── TIER 2: COMMONLY ASKED ──
                bq("Receiving constructive feedback",
                        "Tell me about a time you received constructive feedback. What was your honest initial reaction, and what concrete changes did you make afterward?",
                        DifficultyLevel.JUNIOR, QuestionTier.COMMONLY_ASKED, "feedback", "growth", "self-awareness"),

                bq("Meeting a tight deadline",
                        "Tell me about a time you had to meet a tight deadline or prioritize competing demands. How did you decide what to focus on and what to cut?",
                        DifficultyLevel.JUNIOR, QuestionTier.COMMONLY_ASKED, "time-management", "prioritization", "pressure"),

                bq("Working under pressure",
                        "Describe a situation where you had to deliver results under high pressure or high stakes. How did you manage the stress and stay effective?",
                        DifficultyLevel.MID, QuestionTier.COMMONLY_ASKED, "time-management", "stress", "delivery"),

                bq("Convincing your team to change approach",
                        "Tell me about a time you influenced someone or convinced them to change their mind — without formal authority. How did you build your case?",
                        DifficultyLevel.MID, QuestionTier.COMMONLY_ASKED, "influence", "communication", "decision-making"),

                bq("Taking initiative without being asked",
                        "Tell me about a time you took initiative to fix a problem no one asked you to solve. How did you identify the gap and what was the impact?",
                        DifficultyLevel.MID, QuestionTier.COMMONLY_ASKED, "ownership", "proactivity", "initiative"),

                bq("Project you're most proud of",
                        "Tell me about the project you're most proud of. What made it special, what was your specific contribution, and what was the measurable impact?",
                        DifficultyLevel.MID, QuestionTier.COMMONLY_ASKED, "motivation", "impact", "technical-depth"),

                bq("Navigating disagreement with management",
                        "Tell me about a time you disagreed with your manager or superior on a technical decision. How did you present your case and what was the outcome?",
                        DifficultyLevel.SENIOR, QuestionTier.COMMONLY_ASKED, "conflict-resolution", "communication", "leadership"),

                bq("Dealing with a production incident",
                        "Tell me about a critical production incident you handled. Walk me through your response, from detection to resolution to post-mortem.",
                        DifficultyLevel.SENIOR, QuestionTier.COMMONLY_ASKED, "incident-response", "production", "leadership"),

                bq("Driving a project from zero",
                        "Describe a project you led from initial idea to production. What decisions did you make, what trade-offs did you evaluate, and what would you do differently?",
                        DifficultyLevel.SENIOR, QuestionTier.COMMONLY_ASKED, "ownership", "project-management", "leadership"),

                bq("Decision with incomplete information",
                        "Tell me about a time you had to make an important technical decision with incomplete information. How did you assess risk and what was the outcome?",
                        DifficultyLevel.SENIOR, QuestionTier.COMMONLY_ASKED, "judgment", "decision-making", "risk-assessment"),

                // ── TIER 3: REMOTE-SPECIFIC ──
                bq("Getting unstuck without immediate help",
                        "What do you do when you get stuck on a problem and can't get immediate help? Walk me through your process for unblocking yourself, from first steps to knowing when to escalate.",
                        DifficultyLevel.JUNIOR, QuestionTier.REMOTE_SPECIFIC, "problem-solving", "resourcefulness", "remote-work"),

                bq("Structuring your remote workday",
                        "Describe how you structure a typical remote workday. How do you prioritize tasks, manage focus time, and communicate availability to your team?",
                        DifficultyLevel.JUNIOR, QuestionTier.REMOTE_SPECIFIC, "self-management", "remote-work", "productivity"),

                bq("Staying current with technology",
                        "How do you stay current with technology and continue growing your skills? Give specific examples of what you've learned recently and how you applied it.",
                        DifficultyLevel.MID, QuestionTier.REMOTE_SPECIFIC, "learning", "growth", "continuous-improvement"),

                bq("Async and written communication",
                        "Tell me about a time you had to rely on written or async communication to get your ideas across. How did you ensure clarity and achieve alignment without a meeting?",
                        DifficultyLevel.MID, QuestionTier.REMOTE_SPECIFIC, "async", "written-communication", "remote-work"),

                bq("Working without direct supervision",
                        "Tell me about a time you worked without direct supervision for an extended period. How did you stay productive, accountable, and keep stakeholders informed?",
                        DifficultyLevel.MID, QuestionTier.REMOTE_SPECIFIC, "autonomy", "self-management", "remote-work"),

                bq("Cross-timezone collaboration",
                        "Tell me about a time you collaborated with people in different time zones or cultures. How did you handle communication gaps and ensure work continued smoothly?",
                        DifficultyLevel.MID, QuestionTier.REMOTE_SPECIFIC, "timezone", "remote-work", "collaboration"),

                bq("Going above and beyond for a client",
                        "Tell me about a time you went above and beyond for a customer or client. What did you do and what was the impact on the relationship or project?",
                        DifficultyLevel.SENIOR, QuestionTier.REMOTE_SPECIFIC, "customer-focus", "proactivity", "remote-work")
        );
    }

    private static Question bq(String title, String content, DifficultyLevel difficulty, QuestionTier tier, String... tags) {
        return Question.builder()
                .title(title)
                .content(content)
                .category(QuestionCategory.BEHAVIORAL)
                .difficulty(difficulty)
                .tier(tier)
                .tags(List.of(tags))
                .build();
    }
}
