package com.fluenthire.quality;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.jupiter.api.extension.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * JUnit 5 extension that collects quality gate results and writes a JSON report
 * to target/quality-reports/ after all tests complete.
 */
public class QualityReportExtension implements TestWatcher, AfterAllCallback {

    private static final List<Map<String, Object>> RESULTS = new CopyOnWriteArrayList<>();
    private static final Instant START_TIME = Instant.now();

    @Override
    public void testSuccessful(ExtensionContext context) {
        RESULTS.add(buildEntry(context, "PASS", null));
    }

    @Override
    public void testFailed(ExtensionContext context, Throwable cause) {
        RESULTS.add(buildEntry(context, "FAIL", cause.getMessage()));
    }

    @Override
    public void testAborted(ExtensionContext context, Throwable cause) {
        RESULTS.add(buildEntry(context, "SKIP", cause != null ? cause.getMessage() : "aborted"));
    }

    @Override
    public void testDisabled(ExtensionContext context, Optional<String> reason) {
        RESULTS.add(buildEntry(context, "SKIP", reason.orElse("disabled")));
    }

    @Override
    public void afterAll(ExtensionContext context) {
        // Only write report from the outermost class (not nested)
        if (context.getParent().flatMap(ExtensionContext::getParent).isPresent()) {
            return;
        }

        try {
            writeReport();
        } catch (IOException e) {
            System.err.println("Failed to write quality report: " + e.getMessage());
        }
    }

    private Map<String, Object> buildEntry(ExtensionContext context, String status, String failReason) {
        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("testClass", context.getTestClass().map(Class::getSimpleName).orElse("unknown"));
        entry.put("testMethod", context.getDisplayName());
        entry.put("status", status);
        if (failReason != null) {
            entry.put("failReason", failReason);
        }
        entry.put("timestamp", Instant.now().toString());
        return entry;
    }

    private void writeReport() throws IOException {
        long passed = RESULTS.stream().filter(r -> "PASS".equals(r.get("status"))).count();
        long failed = RESULTS.stream().filter(r -> "FAIL".equals(r.get("status"))).count();
        long total = RESULTS.size();
        double passRate = total > 0 ? (double) passed / total : 0;

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("timestamp", START_TIME.toString());
        report.put("completedAt", Instant.now().toString());
        report.put("totalTests", total);
        report.put("passed", passed);
        report.put("failed", failed);
        report.put("overallPassRate", Math.round(passRate * 1000.0) / 1000.0);
        report.put("overallPass", failed == 0);
        report.put("conversionReadiness", failed == 0
                ? "3% target achievable — all quality gates passed"
                : "Blockers: " + failed + " quality gate(s) failed");
        report.put("gates", RESULTS);

        Path dir = Path.of("target/quality-reports");
        Files.createDirectories(dir);
        String filename = "report-" + DateTimeFormatter.ISO_INSTANT.format(START_TIME)
                .replaceAll("[:]", "-") + ".json";

        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        mapper.writeValue(dir.resolve(filename).toFile(), report);

        System.out.println("\n══════════════════════════════════════════");
        System.out.println("  QUALITY REPORT: " + passed + "/" + total + " gates passed");
        System.out.println("  Report: " + dir.resolve(filename));
        System.out.println("══════════════════════════════════════════\n");
    }
}
