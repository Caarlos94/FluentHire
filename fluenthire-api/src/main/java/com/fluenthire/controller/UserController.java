package com.fluenthire.controller;

import com.fluenthire.dto.*;
import com.fluenthire.service.CreditService;
import com.fluenthire.service.JobDescriptionService;
import com.fluenthire.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JobDescriptionService jobDescriptionService;
    private final CreditService creditService;

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        ProfileResponse response = userService.getProfile(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/onboarding")
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileRequest request) {
        ProfileResponse response = userService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/job-description")
    public ResponseEntity<JobDescriptionAnalysisResponse> updateJobDescription(
            Authentication authentication,
            @Valid @RequestBody JobDescriptionRequest request) {
        JobDescriptionAnalysisResponse response = userService.updateJobDescription(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/credits")
    public ResponseEntity<CreditBalanceResponse> getCredits(Authentication authentication) {
        int credits = creditService.getCredits(authentication.getName());
        return ResponseEntity.ok(new CreditBalanceResponse(credits));
    }

    @GetMapping("/job-description/analysis")
    public ResponseEntity<JobDescriptionAnalysisResponse> getJobDescriptionAnalysis(
            Authentication authentication) {
        JobDescriptionAnalysisResponse response = jobDescriptionService.getByUser(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/personal-info")
    public ResponseEntity<ProfileResponse> updatePersonalInfo(
            Authentication authentication,
            @Valid @RequestBody UpdatePersonalInfoRequest request) {
        ProfileResponse response = userService.updatePersonalInfo(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/preferences")
    public ResponseEntity<ProfileResponse> updatePreferences(
            Authentication authentication,
            @Valid @RequestBody ProfileRequest request) {
        ProfileResponse response = userService.updatePreferences(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("profile/password")
    public ResponseEntity<MessageResponse> updatePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        MessageResponse response = userService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("account")
    public ResponseEntity<MessageResponse> deleteAccount(Authentication authentication) {
        userService.deleteProfile(authentication.getName());
        return ResponseEntity.ok(new MessageResponse("Account deleted"));
    }
}
