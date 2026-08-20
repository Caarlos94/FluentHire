package com.fluenthire.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InterviewCompleteRequest {

    @Size(max = 2000, message = "Transcript exceeds maximum allowed size")
    private List<TranscriptMessage> transcript;

    @Size(max = 10, message = "Too many code snapshots")
    private List<CodeSnapshot> codeSnapshots;

    @Size(max = 500, message = "Too many usage entries")
    private List<RealtimeUsageTurn> realtimeUsage;

    @Getter
    @Setter
    public static class TranscriptMessage {
        private String id;
        private String role;
        private String text;
        private Long timestamp;
    }

    @Getter
    @Setter
    public static class CodeSnapshot {
        private Long questionId;
        private String code;
        private String language;
    }

    @Getter
    @Setter
    public static class RealtimeUsageTurn {
        private int inputTokens;
        private int outputTokens;
        private int cachedTokens;
        private int inputAudioTokens;
        private int outputAudioTokens;
        private int inputTextTokens;
        private int outputTextTokens;
    }
}
