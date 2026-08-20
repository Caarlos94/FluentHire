package com.fluenthire.dto;

public record RealtimeSessionResponse(
        String sessionId,
        String ephemeralToken,
        String expiresAt
) {
}
