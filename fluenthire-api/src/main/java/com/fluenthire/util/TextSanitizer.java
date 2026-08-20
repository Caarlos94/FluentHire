package com.fluenthire.util;

import java.util.regex.Pattern;

public final class TextSanitizer {

    private TextSanitizer() {}

    // Block-level dangerous tags — strip tag AND content
    private static final Pattern SCRIPT_BLOCK = Pattern.compile(
            "<script[^>]*>[\\s\\S]*?</script>", Pattern.CASE_INSENSITIVE);
    private static final Pattern STYLE_BLOCK = Pattern.compile(
            "<style[^>]*>[\\s\\S]*?</style>", Pattern.CASE_INSENSITIVE);
    private static final Pattern IFRAME_BLOCK = Pattern.compile(
            "<iframe[^>]*>[\\s\\S]*?</iframe>", Pattern.CASE_INSENSITIVE);

    // Dangerous tags — strip the tag itself (catches unclosed script/style/iframe
    // tags that the block patterns above missed, plus other dangerous void/inline tags)
    private static final Pattern DANGEROUS_TAGS = Pattern.compile(
            "</?(?:script|style|iframe|img|object|embed|link|svg|math|form|input|button|textarea|select|meta|base)\\b[^>]*>",
            Pattern.CASE_INSENSITIVE);

    // Event handler attributes: onclick=, onerror=, onload=, etc.
    private static final Pattern EVENT_HANDLERS = Pattern.compile(
            "\\bon\\w+\\s*=", Pattern.CASE_INSENSITIVE);

    // javascript: and data: URI schemes (used in href, src, etc.)
    private static final Pattern JS_URI = Pattern.compile(
            "\\bjavascript\\s*:", Pattern.CASE_INSENSITIVE);
    private static final Pattern DATA_URI = Pattern.compile(
            "\\bdata\\s*:\\s*text/html", Pattern.CASE_INSENSITIVE);

    // All HTML tags — used for name sanitization only
    private static final Pattern ALL_HTML_TAGS = Pattern.compile("<[^>]+>");

    /**
     * Strips dangerous HTML patterns while preserving code-context angle brackets
     * like {@code List<String>}. Suitable for long-form text fields.
     */
    public static String sanitize(String input) {
        if (input == null) return null;

        String result = input;
        result = SCRIPT_BLOCK.matcher(result).replaceAll("");
        result = STYLE_BLOCK.matcher(result).replaceAll("");
        result = IFRAME_BLOCK.matcher(result).replaceAll("");
        result = DANGEROUS_TAGS.matcher(result).replaceAll("");
        result = EVENT_HANDLERS.matcher(result).replaceAll("");
        result = JS_URI.matcher(result).replaceAll("");
        result = DATA_URI.matcher(result).replaceAll("");
        return result.trim();
    }

    /**
     * Strips ALL HTML tags and trims. Suitable for name fields where
     * angle brackets are never legitimate.
     */
    public static String sanitizeName(String input) {
        if (input == null) return null;
        return ALL_HTML_TAGS.matcher(input).replaceAll("").trim();
    }
}
