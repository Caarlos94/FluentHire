package com.fluenthire.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ApiCostTracker {

    // ─── Anthropic Pricing (claude-sonnet-4-20250514) ────────────────────────
    public static final double CLAUDE_SONNET_4_INPUT_PER_MTOK  = 3.00;
    public static final double CLAUDE_SONNET_4_OUTPUT_PER_MTOK = 15.00;

    // ─── OpenAI Pricing ──────────────────────────────────────────────────────
    public static final double TTS1_PER_MILLION_CHARS            = 15.00;
    public static final double TRANSCRIBE_PER_MINUTE             = 0.006;
    public static final double REALTIME_AUDIO_INPUT_PER_MTOK     = 32.00;
    public static final double REALTIME_AUDIO_OUTPUT_PER_MTOK    = 64.00;

    public static final double REALTIME_CACHED_INPUT_PER_MTOK    = 0.40;
    public static final double REALTIME_TEXT_INPUT_PER_MTOK      = 4.00;
    public static final double REALTIME_TEXT_OUTPUT_PER_MTOK     = 16.00;

    // ─── Resend Pricing ──────────────────────────────────────────────────────
    public static final double RESEND_PER_EMAIL = 0.00046;

    // ─── Per-Request Cost Records ────────────────────────────────────────────

    private final CopyOnWriteArrayList<RequestCostRecord> records = new CopyOnWriteArrayList<>();

    // ─── Cost Calculation Helpers ────────────────────────────────────────────

    public static double claudeCost(int inputTokens, int outputTokens) {
        return (inputTokens / 1_000_000.0) * CLAUDE_SONNET_4_INPUT_PER_MTOK
             + (outputTokens / 1_000_000.0) * CLAUDE_SONNET_4_OUTPUT_PER_MTOK;
    }

    public static double ttsCost(int characterCount) {
        return (characterCount / 1_000_000.0) * TTS1_PER_MILLION_CHARS;
    }

    public static double whisperCost(double estimatedMinutes) {
        return estimatedMinutes * TRANSCRIBE_PER_MINUTE;
    }

    /**
     * Estimates Realtime API cost based on session duration.
     * This is a ~60-70% accurate estimate — real cost depends on speaking patterns,
     * caching effectiveness, and turn frequency which we cannot measure server-side.
     * Use the OpenAI billing dashboard for exact costs.
     */
    public static double realtimeCost(int durationSeconds) {
        // OpenAI Realtime audio token rates:
        //   Input:  1 token per 100ms = 10 tokens/sec
        //   Output: 1 token per 50ms  = 20 tokens/sec
        double halfDuration = durationSeconds * 0.50;

        // User input: 80% active speech (VAD filters silence during user's turn)
        double inputTokens  = halfDuration * 0.80 * 10.0;
        // AI output: no silence filtering — AI generates exactly what it speaks
        double outputTokens = halfDuration * 20.0;

        double inputCost  = (inputTokens  / 1_000_000.0) * REALTIME_AUDIO_INPUT_PER_MTOK;
        double outputCost = (outputTokens / 1_000_000.0) * REALTIME_AUDIO_OUTPUT_PER_MTOK;

        // Context accumulation: conversation history resent each turn as cached input
        // Estimate ~15% cost inflation (intermediate scenario, caching works reasonably)
        double baseCost = inputCost + outputCost;
        return baseCost * 1.15;
    }

    /**
     * Computes exact Realtime API cost from actual token usage reported by OpenAI.
     * Each turn's response.done event provides token breakdowns that the frontend collects.
     */
    public static double realtimeCostFromUsage(List<com.fluenthire.dto.InterviewCompleteRequest.RealtimeUsageTurn> turns) {
        double totalCost = 0;
        for (var turn : turns) {
            int totalInput = turn.getInputAudioTokens() + turn.getInputTextTokens();
            int cached = turn.getCachedTokens();

            // All cached tokens cost the same rate ($0.40/MTok) regardless of audio/text
            totalCost += (cached / 1_000_000.0) * REALTIME_CACHED_INPUT_PER_MTOK;

            // Distribute fresh (uncached) input proportionally between audio and text
            int freshTotal = totalInput - cached;
            if (freshTotal > 0 && totalInput > 0) {
                double audioRatio = (double) turn.getInputAudioTokens() / totalInput;
                int freshAudio = (int) Math.round(freshTotal * audioRatio);
                int freshText = freshTotal - freshAudio;

                totalCost += (freshAudio / 1_000_000.0) * REALTIME_AUDIO_INPUT_PER_MTOK;
                totalCost += (freshText / 1_000_000.0) * REALTIME_TEXT_INPUT_PER_MTOK;
            }

            // Output tokens are never cached
            totalCost += (turn.getOutputAudioTokens() / 1_000_000.0) * REALTIME_AUDIO_OUTPUT_PER_MTOK;
            totalCost += (turn.getOutputTextTokens() / 1_000_000.0) * REALTIME_TEXT_OUTPUT_PER_MTOK;
        }
        return totalCost;
    }

    // ─── Record a complete request ───────────────────────────────────────────

    public void record(RequestCostRecord record) {
        records.add(record);

        log.info("[API-COST] feature={} category={} mode={} claude=${} whisper=${} tts=${} realtime=${} total=${}",
                record.feature(), record.category(), record.mode(),
                fmt(record.claudeCost()), fmt(record.whisperCost()),
                fmt(record.ttsCost()), fmt(record.realtimeCost()),
                fmt(record.totalCost()));
    }

    // ─── Aggregation ─────────────────────────────────────────────────────────

    public List<RequestCostRecord> getAllRecords() {
        return Collections.unmodifiableList(records);
    }

    public AggregatedCost aggregateByFeature(String feature) {
        List<RequestCostRecord> filtered = records.stream()
                .filter(r -> r.feature().equals(feature))
                .toList();
        return aggregate(feature, filtered);
    }

    public Map<String, AggregatedCost> aggregateAllByFeature() {
        return records.stream()
                .collect(Collectors.groupingBy(RequestCostRecord::feature))
                .entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> aggregate(e.getKey(), e.getValue())));
    }

    public Map<String, AggregatedCost> aggregateAllByCategory() {
        return records.stream()
                .collect(Collectors.groupingBy(r -> r.category() != null ? r.category() : "N/A"))
                .entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> aggregate(e.getKey(), e.getValue())));
    }

    public Map<String, AggregatedCost> aggregateAllByFeatureAndCategory() {
        return records.stream()
                .collect(Collectors.groupingBy(r -> r.feature() + "/" + (r.category() != null ? r.category() : "N/A")))
                .entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> aggregate(e.getKey(), e.getValue())));
    }

    public double getTotalCost() {
        return records.stream().mapToDouble(RequestCostRecord::totalCost).sum();
    }

    public void reset() {
        records.clear();
        log.info("[API-COST] All cost records cleared");
    }

    // ─── Records & DTOs ──────────────────────────────────────────────────────

    public record RequestCostRecord(
            String feature,       // "qa-practice", "think-out-loud", "ai-interview", "job-description"
            String category,      // "CODING", "BEHAVIORAL", "SYSTEM_DESIGN", "TECHNICAL_KNOWLEDGE"
            String mode,          // "TEXT", "AUDIO", "CODE"
            double claudeCost,
            double whisperCost,
            double ttsCost,
            double realtimeCost,
            double totalCost,
            boolean exactCost,    // true if computed from real OpenAI usage data
            int inputTokens,
            int outputTokens,
            int cachedTokens,
            double cacheRate,     // 0-100
            int durationSeconds,
            LocalDateTime timestamp
    ) {
        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private String feature;
            private String category;
            private String mode;
            private double claudeCost;
            private double whisperCost;
            private double ttsCost;
            private double realtimeCost;
            private boolean exactCost;
            private int inputTokens;
            private int outputTokens;
            private int cachedTokens;
            private int durationSeconds;

            public Builder feature(String feature) { this.feature = feature; return this; }
            public Builder category(String category) { this.category = category; return this; }
            public Builder mode(String mode) { this.mode = mode; return this; }
            public Builder claudeCost(double cost) { this.claudeCost = cost; return this; }
            public Builder whisperCost(double cost) { this.whisperCost = cost; return this; }
            public Builder ttsCost(double cost) { this.ttsCost = cost; return this; }
            public Builder realtimeCost(double cost) { this.realtimeCost = cost; return this; }
            public Builder exactCost(boolean exact) { this.exactCost = exact; return this; }
            public Builder inputTokens(int tokens) { this.inputTokens = tokens; return this; }
            public Builder outputTokens(int tokens) { this.outputTokens = tokens; return this; }
            public Builder cachedTokens(int tokens) { this.cachedTokens = tokens; return this; }
            public Builder durationSeconds(int seconds) { this.durationSeconds = seconds; return this; }

            public RequestCostRecord build() {
                double total = claudeCost + whisperCost + ttsCost + realtimeCost;
                double cacheRate = inputTokens > 0 ? (double) cachedTokens / inputTokens * 100 : 0;
                return new RequestCostRecord(feature, category, mode,
                        claudeCost, whisperCost, ttsCost, realtimeCost,
                        total, exactCost, inputTokens, outputTokens, cachedTokens,
                        cacheRate, durationSeconds, LocalDateTime.now());
            }
        }
    }

    public record AggregatedCost(
            String groupKey,
            int requestCount,
            double totalCost,
            double avgCostPerRequest,
            double avgClaudeCost,
            double avgWhisperCost,
            double avgTtsCost,
            double avgRealtimeCost,
            double avgCacheRate,
            int exactCostCount,
            int estimatedCostCount
    ) {}

    // ─── Internal ────────────────────────────────────────────────────────────

    private AggregatedCost aggregate(String key, List<RequestCostRecord> recs) {
        int count = recs.size();
        if (count == 0) {
            return new AggregatedCost(key, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
        double total    = recs.stream().mapToDouble(RequestCostRecord::totalCost).sum();
        double claude   = recs.stream().mapToDouble(RequestCostRecord::claudeCost).sum();
        double whisper  = recs.stream().mapToDouble(RequestCostRecord::whisperCost).sum();
        double tts      = recs.stream().mapToDouble(RequestCostRecord::ttsCost).sum();
        double realtime = recs.stream().mapToDouble(RequestCostRecord::realtimeCost).sum();

        // Cache rate: average only over sessions that have real usage data
        var exactRecs = recs.stream().filter(RequestCostRecord::exactCost).toList();
        double avgCacheRate = exactRecs.isEmpty() ? -1
                : exactRecs.stream().mapToDouble(RequestCostRecord::cacheRate).average().orElse(-1);

        return new AggregatedCost(key, count, total,
                total / count, claude / count, whisper / count,
                tts / count, realtime / count, avgCacheRate,
                (int) recs.stream().filter(RequestCostRecord::exactCost).count(),
                (int) recs.stream().filter(r -> !r.exactCost()).count());
    }

    private static String fmt(double value) {
        return String.format("%.6f", value);
    }
}
