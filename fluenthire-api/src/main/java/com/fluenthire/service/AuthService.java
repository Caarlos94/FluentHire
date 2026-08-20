package com.fluenthire.service;

import com.fluenthire.config.JwtUtil;
import com.fluenthire.dto.AuthResponse;
import com.fluenthire.dto.LoginRequest;
import com.fluenthire.dto.RegisterRequest;
import com.fluenthire.entity.Role;
import com.fluenthire.entity.User;
import com.fluenthire.exception.DuplicateResourceException;
import com.fluenthire.exception.InvalidCredentialsException;
import com.fluenthire.repository.UserRepository;
import com.fluenthire.util.TextSanitizer;
import io.sentry.Sentry;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final CreditService creditService;
    private final DisposableEmailValidator disposableEmailValidator;

    @Value("${google.client-id}")
    private String googleClientId;

    @Value("${app.base-url}")
    private String appBaseUrl;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (disposableEmailValidator.isDisposable(email)) {
            throw new IllegalArgumentException("Please use a permanent email address to register");
        }

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already registered");
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(TextSanitizer.sanitizeName(request.getFirstName()))
                .lastName(TextSanitizer.sanitizeName(request.getLastName()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        // Grant signup bonus credits
        creditService.grantSignupBonus(user);

        emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName());
    }

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKOUT_MINUTES = 15;

    @Transactional(noRollbackFor = InvalidCredentialsException.class)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (user.getPassword() == null) {
            throw new InvalidCredentialsException("This account uses Google login. Please sign in with Google.");
        }

        // Check lockout
        if (user.getLockoutUntil() != null && java.time.Instant.now().isBefore(user.getLockoutUntil())) {
            long minutesLeft = java.time.Duration.between(java.time.Instant.now(), user.getLockoutUntil()).toMinutes() + 1;
            log.warn("Login attempt on locked account: {}", user.getEmail());
            throw new InvalidCredentialsException(
                    "Account temporarily locked due to too many failed attempts. Try again in " + minutesLeft + " minute" + (minutesLeft != 1 ? "s" : "") + ".");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            int attempts = (user.getFailedLoginAttempts() != null ? user.getFailedLoginAttempts() : 0) + 1;
            user.setFailedLoginAttempts(attempts);

            if (attempts >= MAX_FAILED_ATTEMPTS) {
                user.setLockoutUntil(java.time.Instant.now().plusSeconds(LOCKOUT_MINUTES * 60L));
                userRepository.save(user);
                log.warn("Account locked after {} failed attempts: {}", attempts, user.getEmail());
                throw new InvalidCredentialsException(
                        "Account temporarily locked due to too many failed attempts. Try again in " + LOCKOUT_MINUTES + " minutes.");
            }

            userRepository.save(user);
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Successful login — reset lockout state
        if (user.getFailedLoginAttempts() != null && user.getFailedLoginAttempts() > 0) {
            user.setFailedLoginAttempts(0);
            user.setLockoutUntil(null);
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName());
    }

    @Transactional
    public AuthResponse googleLogin(String idToken) {
        GoogleIdToken.Payload payload = verifyGoogleToken(idToken);

        String email = payload.getEmail().trim().toLowerCase();
        String firstName = TextSanitizer.sanitizeName((String) payload.getOrDefault("given_name", ""));
        String lastName = TextSanitizer.sanitizeName((String) payload.getOrDefault("family_name", ""));

        if (email == null || email.isBlank()) {
            throw new InvalidCredentialsException("Could not retrieve email from Google account.");
        }

        // Find existing user or create new one
        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update name if missing (e.g., user registered with email first)
            if (user.getFirstName() == null || user.getFirstName().isBlank()) {
                user.setFirstName(firstName);
            }
            if (user.getLastName() == null || user.getLastName().isBlank()) {
                user.setLastName(lastName);
            }
            userRepository.save(user);
        } else {
            user = User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .build();
            userRepository.save(user);

            // Grant signup bonus credits for new Google users
            creditService.grantSignupBonus(user);

            emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName());
    }

    @Transactional
    public void requestPasswordReset(String rawEmail) {
        String email = rawEmail.trim().toLowerCase();
        Optional<User> optUser = userRepository.findByEmail(email);
        if (optUser.isEmpty() || optUser.get().getPassword() == null) {
            log.info("Password reset requested for non-existent or Google-only email: {}", email);
            return;
        }

        User user = optUser.get();

        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        String resetLink = appBaseUrl + "/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetLink);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid or expired reset link."));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            throw new InvalidCredentialsException("Reset link has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    private GoogleIdToken.Payload verifyGoogleToken(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken token = verifier.verify(idToken);

            if (token == null) {
                throw new InvalidCredentialsException("Invalid Google token.");
            }

            GoogleIdToken.Payload payload = token.getPayload();

            if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
                throw new InvalidCredentialsException("Google email not verified.");
            }

            return payload;

        } catch (InvalidCredentialsException e) {
            throw e;
        } catch (Exception e) {
            log.error("Google token verification failed: {}", e.getMessage(), e);
            Sentry.captureException(e);
            throw new InvalidCredentialsException("Failed to verify Google login. Please try again.");
        }
    }
}
