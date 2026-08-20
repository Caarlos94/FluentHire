package com.fluenthire.service;

import io.sentry.Sentry;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Set;

@Service
@Slf4j
public class DisposableEmailValidator {

    private Set<String> blockedDomains;

    @PostConstruct
    void loadBlocklist() {
        blockedDomains = new HashSet<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(
                        new ClassPathResource("disposable-domains.txt").getInputStream(),
                        StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String domain = line.trim().toLowerCase();
                if (!domain.isEmpty() && !domain.startsWith("#")) {
                    blockedDomains.add(domain);
                }
            }
            log.info("Loaded {} disposable email domains", blockedDomains.size());
        } catch (Exception e) {
            log.error("Failed to load disposable email blocklist: {}", e.getMessage(), e);
            Sentry.captureException(e);
            blockedDomains = Set.of();
        }
    }

    public boolean isDisposable(String email) {
        if (email == null || !email.contains("@")) {
            return false;
        }
        String domain = email.substring(email.indexOf("@") + 1).toLowerCase();
        return blockedDomains.contains(domain);
    }
}
