package com.fluenthire.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class RateLimitInterceptor implements HandlerInterceptor {

    private record RateRule(int maxRequests, int windowSeconds) {}

    // IP-based rules (exact path match)
    private static final Map<String, RateRule> IP_RULES = Map.of(
            "/api/auth/login", new RateRule(10, 60),            // 10 per minute
            "/api/auth/register", new RateRule(5, 3600),         // 5 per hour
            "/api/auth/forgot-password", new RateRule(3, 3600),  // 3 per hour
            "/api/auth/reset-password", new RateRule(5, 3600)    // 5 per hour
    );

    // User-based rules (pattern match for authenticated endpoints)
    private record UserRateRule(String prefix, String suffix, RateRule rule, String message) {
        boolean matches(String path) {
            if (suffix.isEmpty()) {
                return path.equals(prefix); // exact match for paths with no dynamic segment
            }
            return path.startsWith(prefix) && path.endsWith(suffix);
        }

        String patternKey() {
            if (suffix.isEmpty()) {
                return prefix;
            }
            return prefix + "*" + suffix;
        }
    }

    private static final List<UserRateRule> USER_RULES = List.of(
            new UserRateRule("/api/responses/", "/analyze", new RateRule(20, 3600),
                    "You've reached the limit for answer analyses (20 per hour). Please try again later."),
            new UserRateRule("/api/speech/transcribe", "", new RateRule(30, 3600),
                    "You've reached the limit for speech transcriptions (30 per hour). Please try again later."),
            new UserRateRule("/api/users/job-description", "", new RateRule(5, 3600),
                    "You've reached the limit for job description submissions (5 per hour). Please try again later.")
    );

    private record BucketKey(String identifier, String path) {}

    private record Bucket(int tokens, Instant lastRefill) {}

    private final ConcurrentHashMap<BucketKey, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getRequestURI();

        // 1. Check IP-based rules (auth endpoints)
        RateRule ipRule = IP_RULES.get(path);
        if (ipRule != null) {
            String clientIp = getClientIp(request);
            BucketKey key = new BucketKey(clientIp, path);

            if (!tryConsume(key, ipRule)) {
                log.warn("Rate limit exceeded: ip={}, path={}", clientIp, path);
                return rejectRequest(response, "Too many requests. Please try again later.");
            }
        }

        // 2. Check user-based rules (authenticated AI endpoints)
        for (UserRateRule userRule : USER_RULES) {
            if (userRule.matches(path)) {
                String userEmail = getAuthenticatedUserEmail();
                if (userEmail != null) {
                    BucketKey key = new BucketKey(userEmail, userRule.patternKey());

                    if (!tryConsume(key, userRule.rule)) {
                        log.warn("Rate limit exceeded: user={}, path={}", userEmail, path);
                        return rejectRequest(response, userRule.message);
                    }
                }
                break;
            }
        }

        return true;
    }

    private boolean rejectRequest(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.getWriter().write(
                "{\"status\":429,\"error\":\"" + message + "\"}"
        );
        return false;
    }

    private String getAuthenticatedUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return auth.getName();
        }
        return null;
    }

    private boolean tryConsume(BucketKey key, RateRule rule) {
        Instant now = Instant.now();

        Bucket bucket = buckets.compute(key, (k, existing) -> {
            if (existing == null) {
                // First request — start with max tokens minus 1
                return new Bucket(rule.maxRequests - 1, now);
            }

            long elapsed = now.getEpochSecond() - existing.lastRefill.getEpochSecond();
            int refill = (int) (elapsed * rule.maxRequests / rule.windowSeconds);
            // Clamp to 0 before refill so denied requests don't accumulate debt
            int newTokens = Math.min(rule.maxRequests, Math.max(0, existing.tokens) + refill);
            Instant newRefill = refill > 0 ? now : existing.lastRefill;

            // Always consume: tokens >= 0 means allowed, < 0 means denied
            return new Bucket(newTokens - 1, newRefill);
        });

        return bucket.tokens >= 0;
    }

    private String getClientIp(HttpServletRequest request) {
        // Check proxy headers (Cloudflare, nginx, load balancer)
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && !ip.isBlank()) {
            // X-Forwarded-For can contain multiple IPs; take the first (original client)
            return ip.split(",")[0].trim();
        }
        ip = request.getHeader("X-Real-IP");
        if (ip != null && !ip.isBlank()) {
            return ip.trim();
        }
        return request.getRemoteAddr();
    }
}
