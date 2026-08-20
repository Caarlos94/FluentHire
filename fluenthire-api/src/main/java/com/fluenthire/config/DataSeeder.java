package com.fluenthire.config;

import com.fluenthire.config.seed.BehavioralQuestions;
import com.fluenthire.config.seed.CodingQuestions;
import com.fluenthire.config.seed.SystemDesignQuestions;
import com.fluenthire.config.seed.TechnicalKnowledgeQuestions;
import com.fluenthire.entity.Question;
import com.fluenthire.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final QuestionRepository questionRepository;

    @Override
    public void run(String... args) {
        if (questionRepository.count() > 0) {
            log.info("Questions already seeded. Skipping.");
            return;
        }

        List<Question> questions = new ArrayList<>();
        questions.addAll(BehavioralQuestions.getAll());
        questions.addAll(CodingQuestions.getAll());
        questions.addAll(SystemDesignQuestions.getAll());
        questions.addAll(TechnicalKnowledgeQuestions.getAll());

        questionRepository.saveAll(questions);
        log.info("Seeded {} questions into the database.", questions.size());
    }
}
