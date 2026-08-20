package com.fluenthire.controller;

import com.fluenthire.dto.RealtimeSessionRequest;
import com.fluenthire.dto.RealtimeSessionResponse;
import com.fluenthire.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/realtime")
@RequiredArgsConstructor
public class RealtimeController {

    private final InterviewService interviewService;

    @PostMapping("/session")
    public ResponseEntity<RealtimeSessionResponse> createSession(
            Authentication authentication,
            @Valid @RequestBody RealtimeSessionRequest request) {
        RealtimeSessionResponse response = interviewService.createSession(
                authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
