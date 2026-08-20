package com.fluenthire.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.sentry.Sentry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAIRealtimeService {

    private static final String REALTIME_CLIENT_SECRETS_URL = "https://api.openai.com/v1/realtime/client_secrets";
    private static final String MODEL = "gpt-realtime-1.5";

    @Value("${openai.api-key}")
    private String openaiApiKey;

    private final ObjectMapper objectMapper;

    /**
     * Creates an ephemeral token for the OpenAI Realtime API.
     * This token is short-lived and safe to send to the client.
     *
     * @return JsonNode with client_secret.value and expires_at
     */
    public JsonNode createEphemeralToken() {
        try {
            String requestBody = objectMapper.writeValueAsString(new java.util.HashMap<>() {{
                put("session", new java.util.HashMap<>() {{
                    put("type", "realtime");
                    put("model", MODEL);
                }});
            }});

            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(REALTIME_CLIENT_SECRETS_URL))
                    .header("Authorization", "Bearer " + openaiApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .timeout(Duration.ofSeconds(30))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("OpenAI Realtime API returned status {} — body: {}", response.statusCode(), response.body());
                throw new RuntimeException("Failed to create realtime session with OpenAI (status: " + response.statusCode() + ")");
            }

            return objectMapper.readTree(response.body());

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to create ephemeral token: {}", e.getMessage(), e);
            Sentry.captureException(e);
            throw new RuntimeException("Failed to create realtime session", e);
        }
    }
}
