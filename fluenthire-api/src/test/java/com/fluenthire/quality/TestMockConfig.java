package com.fluenthire.quality;

import com.fluenthire.service.EmailService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import static org.mockito.Mockito.mock;

/**
 * Overrides beans that make external HTTP calls not needed by quality tests.
 * EmailService is replaced with a Mockito mock to prevent any Resend API calls.
 */
@TestConfiguration
public class TestMockConfig {

    @Bean
    @Primary
    public EmailService emailService() {
        return mock(EmailService.class);
    }
}
