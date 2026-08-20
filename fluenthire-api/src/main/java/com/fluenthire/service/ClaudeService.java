package com.fluenthire.service;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.MessageParam;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@Slf4j
public class ClaudeService {

    @Value("${claude.api-key}")
    private String apiKey;

    @Value("${claude.model}")
    private String model;

    private AnthropicClient client;

    @PostConstruct
    public void init() {
        this.client = AnthropicOkHttpClient.builder()
                .apiKey(apiKey)
                .timeout(Duration.ofSeconds(60))
                .build();
    }

    public record ClaudeResult(String text, int inputTokens, int outputTokens, double cost) {}

    public ClaudeResult analyze(String systemPrompt, String userMessage) {
        Message response = client.messages().create(
                MessageCreateParams.builder()
                        .model(model)
                        .maxTokens(2048)
                        .system(systemPrompt)
                        .addMessage(MessageParam.builder()
                                .role(MessageParam.Role.USER)
                                .content(userMessage)
                                .build())
                        .build()
        );

        int inputTokens = (int) response.usage().inputTokens();
        int outputTokens = (int) response.usage().outputTokens();
        double cost = ApiCostTracker.claudeCost(inputTokens, outputTokens);

        String text = response.content().stream()
                .filter(block -> block.isText())
                .map(block -> block.asText().text())
                .findFirst()
                .orElse("");

        log.info("[CLAUDE] model={} input_tokens={} output_tokens={} cost=${}",
                model, inputTokens, outputTokens, String.format("%.6f", cost));

        return new ClaudeResult(text, inputTokens, outputTokens, cost);
    }
}
