package com.fluenthire.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import io.sentry.Sentry;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class EmailService {

    private static final String RESEND_URL = "https://api.resend.com/emails";

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String appBaseUrl;

    private static final String REPLY_TO = "support@fluenthire.app";

    private final ApiCostTracker costTracker;
    private RestClient restClient;

    public EmailService(ApiCostTracker costTracker) {
        this.costTracker = costTracker;
    }

    @PostConstruct
    public void init() {
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(
                HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build());
        requestFactory.setReadTimeout(Duration.ofSeconds(30));

        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .baseUrl(RESEND_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .build();
    }

    public void sendPasswordResetEmail(String toEmail, String firstName, String resetLink) {
        try {
            String displayName = (firstName != null && !firstName.isBlank()) ? firstName : "there";

            String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
                        <h2 style="color: #111; margin-bottom: 24px;">Reset your password</h2>
                        <p>Hi %s,</p>
                        <p>We received a request to reset your FluentHire password. Click the button below to choose a new one:</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="%s" style="background-color: #2563eb; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Reset Password</a>
                        </div>
                        <p style="color: #666; font-size: 14px;">This link will expire in <strong>1 hour</strong>.</p>
                        <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                        <p style="color: #999; font-size: 12px;">FluentHire — Practice English technical interviews and land remote US jobs.</p>
                    </body>
                    </html>
                    """.formatted(displayName, resetLink);

            Map<String, Object> body = Map.of(
                    "from", "FluentHire <" + fromEmail + ">",
                    "to", List.of(toEmail),
                    "reply_to", REPLY_TO,
                    "subject", "Reset your FluentHire password",
                    "html", html
            );

            restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            costTracker.record(ApiCostTracker.RequestCostRecord.builder()
                    .feature("email-password-reset").build());
            log.info("Password reset email sent to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage(), e);
            Sentry.captureException(e);
            // Don't throw — endpoint should always return success (security requirement)
        }
    }

    public void sendWelcomeEmail(String toEmail, String firstName) {
        try {
            String displayName = (firstName != null && !firstName.isBlank()) ? firstName : "there";
            String onboardingLink = appBaseUrl + "/onboarding";

            String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
                        <h2 style="color: #111; margin-bottom: 24px;">Welcome to FluentHire!</h2>
                        <p>Hi %s,</p>
                        <p>You're in. Your account is ready and you have <strong>3 free Live AI Interview credits</strong> waiting for you — plus unlimited Q&amp;A and Think Out Loud practice.</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="%s" style="background-color: #2563eb; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Start Your First Practice</a>
                        </div>
                        <p style="color: #666; font-size: 14px;">Each session gives you AI-powered feedback on both your <strong>communication skills</strong> and <strong>technical accuracy</strong> — so you know exactly what to improve before your next real interview.</p>
                        <p style="color: #666; font-size: 14px;">Questions? Just reply to this email or reach us at <a href="mailto:support@fluenthire.app" style="color: #2563eb; text-decoration: none;">support@fluenthire.app</a>.</p>
                        <p style="color: #666; font-size: 14px;">Good luck out there,<br><strong>The FluentHire Team</strong></p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                        <p style="color: #999; font-size: 12px;">FluentHire — Practice English technical interviews and land remote US jobs.</p>
                    </body>
                    </html>
                    """.formatted(displayName, onboardingLink);

            Map<String, Object> body = Map.of(
                    "from", "FluentHire <" + fromEmail + ">",
                    "to", List.of(toEmail),
                    "reply_to", REPLY_TO,
                    "subject", "Welcome to FluentHire — your free interview credits are ready",
                    "html", html
            );

            restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            costTracker.record(ApiCostTracker.RequestCostRecord.builder()
                    .feature("email-welcome").build());
            log.info("Welcome email sent to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage(), e);
            Sentry.captureException(e);
        }
    }

    public void sendSubscriptionConfirmationEmail(String toEmail, String firstName, String planName, int monthlyCredits) {
        try {
            String displayName = (firstName != null && !firstName.isBlank()) ? firstName : "there";
            String dashboardLink = appBaseUrl + "/dashboard";

            String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
                        <h2 style="color: #111; margin-bottom: 24px;">You're on the %s plan!</h2>
                        <p>Hi %s,</p>
                        <p>Your subscription is confirmed. You now have <strong>%d practice credits per month</strong> to sharpen your interview skills.</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="%s" style="background-color: #2563eb; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Go to Dashboard</a>
                        </div>
                        <p style="color: #666; font-size: 14px;">You can manage your subscription anytime from your <a href="%s" style="color: #2563eb; text-decoration: none;">profile page</a>.</p>
                        <p style="color: #666; font-size: 14px;">Thank you for investing in your career,<br><strong>The FluentHire Team</strong></p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                        <p style="color: #999; font-size: 12px;">FluentHire — Practice English technical interviews and land remote US jobs.</p>
                    </body>
                    </html>
                    """.formatted(planName, displayName, monthlyCredits, dashboardLink, appBaseUrl + "/profile");

            Map<String, Object> body = Map.of(
                    "from", "FluentHire <" + fromEmail + ">",
                    "to", List.of(toEmail),
                    "reply_to", REPLY_TO,
                    "subject", "Subscription confirmed — " + planName + " plan",
                    "html", html
            );

            restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            costTracker.record(ApiCostTracker.RequestCostRecord.builder()
                    .feature("email-subscription-confirmation").build());
            log.info("Subscription confirmation email sent to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send subscription confirmation email to {}: {}", toEmail, e.getMessage(), e);
            Sentry.captureException(e);
        }
    }

    public void sendCreditsExpiredEmail(
            String toEmail, String firstName,
            int s1Comm, int s1Tech, int s1Ps,
            int s2Comm, int s2Tech, int s2Ps,
            int s3Comm, int s3Tech, int s3Ps) {
        try {
            String displayName = (firstName != null && !firstName.isBlank()) ? firstName : "there";
            String pricingLink = appBaseUrl + "/pricing";
            String insight = buildInsightLine(s1Comm, s1Tech, s1Ps, s3Comm, s3Tech, s3Ps);

            // Change = session 3 vs session 1
            String commChange = formatDelta(s3Comm - s1Comm);
            String techChange = formatDelta(s3Tech - s1Tech);
            String psChange = formatDelta(s3Ps - s1Ps);
            String commColor = deltaColor(s3Comm - s1Comm);
            String techColor = deltaColor(s3Tech - s1Tech);
            String psColor = deltaColor(s3Ps - s1Ps);

            String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
                        <h2 style="color: #111; margin-bottom: 24px;">You completed 3 live interviews. Here's your progress.</h2>
                        <p>Hi %s,</p>
                        <p>You've used all 3 of your free Live AI Interview credits. Before you decide what's next, here's how your scores evolved:</p>
                        <table style="width: 100%%; border-collapse: collapse; margin: 24px 0; font-size: 14px;">
                            <tr style="border-bottom: 2px solid #eee;">
                                <th style="text-align: left; padding: 10px 12px; color: #666; font-weight: 600;"></th>
                                <th style="text-align: center; padding: 10px 12px; color: #666; font-weight: 600;">Interview 1</th>
                                <th style="text-align: center; padding: 10px 12px; color: #666; font-weight: 600;">Interview 2</th>
                                <th style="text-align: center; padding: 10px 12px; color: #666; font-weight: 600;">Interview 3</th>
                                <th style="text-align: center; padding: 10px 12px; color: #666; font-weight: 600;">Change</th>
                            </tr>
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 10px 12px; font-weight: 600;">Communication</td>
                                <td style="text-align: center; padding: 10px 12px;">%d</td>
                                <td style="text-align: center; padding: 10px 12px;">%d</td>
                                <td style="text-align: center; padding: 10px 12px;">%d</td>
                                <td style="text-align: center; padding: 10px 12px; color: %s; font-weight: 600;">%s</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 10px 12px; font-weight: 600;">Technical</td>
                                <td style="text-align: center; padding: 10px 12px;">%d</td>
                                <td style="text-align: center; padding: 10px 12px;">%d</td>
                                <td style="text-align: center; padding: 10px 12px;">%d</td>
                                <td style="text-align: center; padding: 10px 12px; color: %s; font-weight: 600;">%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 12px; font-weight: 600;">Problem Solving</td>
                                <td style="text-align: center; padding: 10px 12px;">%d</td>
                                <td style="text-align: center; padding: 10px 12px;">%d</td>
                                <td style="text-align: center; padding: 10px 12px;">%d</td>
                                <td style="text-align: center; padding: 10px 12px; color: %s; font-weight: 600;">%s</td>
                            </tr>
                        </table>
                        <p style="background-color: #f8fafc; border-left: 3px solid #2563eb; padding: 12px 16px; margin: 24px 0; font-size: 14px; color: #444;">
                            %s
                        </p>
                        <p>Developers who complete 5+ practice interviews report feeling significantly more confident in real interviews. You're 3 sessions in — the hardest part is already done.</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="%s" style="background-color: #2563eb; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Continue Practicing — Plans from $9.99/mo</a>
                        </div>
                        <p style="text-align: center; font-size: 14px; color: #666;">
                            Not ready for a subscription? <a href="%s" style="color: #2563eb; text-decoration: none; font-weight: 500;">Grab a 3-pack for $8.99</a> — no commitment, credits never expire.
                        </p>
                        <p style="color: #666; font-size: 14px;">Your free Q&amp;A and Think Out Loud practice are still unlimited — keep using them anytime.</p>
                        <p style="color: #666; font-size: 14px;">Good luck with your preparation,<br><strong>The FluentHire Team</strong></p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                        <p style="color: #999; font-size: 12px;">FluentHire — Practice English technical interviews and land remote US jobs.</p>
                    </body>
                    </html>
                    """.formatted(
                    displayName,
                    s1Comm, s2Comm, s3Comm, commColor, commChange,
                    s1Tech, s2Tech, s3Tech, techColor, techChange,
                    s1Ps, s2Ps, s3Ps, psColor, psChange,
                    insight,
                    pricingLink,
                    pricingLink
            );

            Map<String, Object> body = Map.of(
                    "from", "FluentHire <" + fromEmail + ">",
                    "to", List.of(toEmail),
                    "reply_to", REPLY_TO,
                    "subject", "Your 3 free interviews are done \u2014 here's your progress",
                    "html", html
            );

            restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            costTracker.record(ApiCostTracker.RequestCostRecord.builder()
                    .feature("email-credits-expired").build());
            log.info("Credits expired email sent to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send credits expired email to {}: {}", toEmail, e.getMessage(), e);
            Sentry.captureException(e);
        }
    }

    public void sendCreditReminderEmail(String toEmail, String firstName, int credits) {
        try {
            String displayName = (firstName != null && !firstName.isBlank()) ? firstName : "there";
            String dashboardLink = appBaseUrl + "/dashboard";

            String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
                        <h2 style="color: #111; margin-bottom: 24px;">You still have %d free interview credit%s waiting</h2>
                        <p>Hi %s,</p>
                        <p>You signed up for FluentHire but haven't tried a <strong>Live AI Interview</strong> yet. Your %d free credit%s %s still ready to use.</p>
                        <p>Here's what makes the live interview different from Q&amp;A practice:</p>
                        <table style="margin: 20px 0; font-size: 14px; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 16px 8px 0; vertical-align: top; color: #2563eb; font-weight: 600;">Real-time conversation</td>
                                <td style="padding: 8px 0; color: #666;">An AI interviewer that listens, follows up, and challenges you — like the real thing.</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px 8px 0; vertical-align: top; color: #2563eb; font-weight: 600;">English fluency scoring</td>
                                <td style="padding: 8px 0; color: #666;">Get scored on clarity, grammar, and filler words — the areas that matter most for LATAM developers.</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 16px 8px 0; vertical-align: top; color: #2563eb; font-weight: 600;">Technical feedback</td>
                                <td style="padding: 8px 0; color: #666;">See exactly where your technical communication needs work, with specific improvement tips.</td>
                            </tr>
                        </table>
                        <p>Most users try their first live interview within the first week. It takes 5–15 minutes and you'll get your scores instantly.</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="%s" style="background-color: #2563eb; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Try Your First Live Interview</a>
                        </div>
                        <p style="color: #666; font-size: 14px;">Your free Q&amp;A and Think Out Loud practice are always available too — no credits needed.</p>
                        <p style="color: #666; font-size: 14px;">Good luck with your preparation,<br><strong>The FluentHire Team</strong></p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                        <p style="color: #999; font-size: 12px;">FluentHire — Practice English technical interviews and land remote US jobs.</p>
                    </body>
                    </html>
                    """.formatted(
                    credits, credits == 1 ? "" : "s",
                    displayName,
                    credits, credits == 1 ? "" : "s", credits == 1 ? "is" : "are",
                    dashboardLink
            );

            Map<String, Object> body = Map.of(
                    "from", "FluentHire <" + fromEmail + ">",
                    "to", List.of(toEmail),
                    "reply_to", REPLY_TO,
                    "subject", "You still have " + credits + " free interview credit" + (credits == 1 ? "" : "s") + " waiting",
                    "html", html
            );

            restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            costTracker.record(ApiCostTracker.RequestCostRecord.builder()
                    .feature("email-credit-reminder").build());
            log.info("Credit reminder email sent to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send credit reminder email to {}: {}", toEmail, e.getMessage(), e);
            Sentry.captureException(e);
        }
    }

    public void sendWinbackEmail(String toEmail, String firstName, String lastQuestionTitle) {
        try {
            String displayName = (firstName != null && !firstName.isBlank()) ? firstName : "there";
            String dashboardLink = appBaseUrl + "/dashboard";

            String contextLine = (lastQuestionTitle != null && !lastQuestionTitle.isBlank())
                    ? "You were working on <strong>" + lastQuestionTitle + "</strong> — pick up where you left off, or try something new."
                    : "You have questions waiting for you — pick up where you left off.";

            String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
                        <h2 style="color: #111; margin-bottom: 24px;">It's been a while — your interview skills are waiting</h2>
                        <p>Hi %s,</p>
                        <p>%s</p>
                        <p style="background-color: #f8fafc; border-left: 3px solid #2563eb; padding: 12px 16px; margin: 24px 0; font-size: 14px; color: #444;">
                            Developers who practice at least 3 times per week score <strong>22%% higher</strong> in real interviews than those who practice once a month.
                        </p>
                        <p>Even 10 minutes today keeps your English sharp and your technical communication on point. The gap between "I know the answer" and "I can explain it clearly in English" closes with consistent practice.</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="%s" style="background-color: #2563eb; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Continue Practicing</a>
                        </div>
                        <p style="color: #666; font-size: 14px;">Q&amp;A and Think Out Loud practice are free and unlimited — no credits needed.</p>
                        <p style="color: #666; font-size: 14px;">Good luck with your preparation,<br><strong>The FluentHire Team</strong></p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                        <p style="color: #999; font-size: 12px;">FluentHire — Practice English technical interviews and land remote US jobs.</p>
                    </body>
                    </html>
                    """.formatted(displayName, contextLine, dashboardLink);

            Map<String, Object> body = Map.of(
                    "from", "FluentHire <" + fromEmail + ">",
                    "to", List.of(toEmail),
                    "reply_to", REPLY_TO,
                    "subject", "Your interview skills miss you \u2014 come back and practice",
                    "html", html
            );

            restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            costTracker.record(ApiCostTracker.RequestCostRecord.builder()
                    .feature("email-winback").build());
            log.info("Winback email sent to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send winback email to {}: {}", toEmail, e.getMessage(), e);
            Sentry.captureException(e);
        }
    }

    public void sendMonthlyBonusCreditEmail(String toEmail, String firstName) {
        try {
            String displayName = (firstName != null && !firstName.isBlank()) ? firstName : "there";
            String dashboardLink = appBaseUrl + "/dashboard";
            String pricingLink = appBaseUrl + "/pricing";

            String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
                        <h2 style="color: #111; margin-bottom: 24px;">You just got a free interview credit</h2>
                        <p>Hi %s,</p>
                        <p>We added <strong>1 free Live AI Interview credit</strong> to your account. It's yours for this month — use it before it's gone.</p>
                        <p style="background-color: #f8fafc; border-left: 3px solid #2563eb; padding: 12px 16px; margin: 24px 0; font-size: 14px; color: #444;">
                            One focused practice session can make the difference between a "maybe" and an offer. Developers who practice consistently score <strong>22%% higher</strong> in real interviews.
                        </p>
                        <p>Pick a question, run through a 5–15 minute live interview, and get instant AI feedback on your communication and technical skills.</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="%s" style="background-color: #2563eb; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Use Your Free Credit Now</a>
                        </div>
                        <p style="text-align: center; font-size: 14px; color: #666;">
                            Want unlimited practice? <a href="%s" style="color: #2563eb; text-decoration: none; font-weight: 500;">Plans start at $9.99/mo</a>
                        </p>
                        <p style="color: #666; font-size: 14px;">Your free Q&amp;A and Think Out Loud practice are always available too — no credits needed.</p>
                        <p style="color: #666; font-size: 14px;">Good luck with your preparation,<br><strong>The FluentHire Team</strong></p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                        <p style="color: #999; font-size: 12px;">FluentHire — Practice English technical interviews and land remote US jobs.</p>
                    </body>
                    </html>
                    """.formatted(displayName, dashboardLink, pricingLink);

            Map<String, Object> body = Map.of(
                    "from", "FluentHire <" + fromEmail + ">",
                    "to", List.of(toEmail),
                    "reply_to", REPLY_TO,
                    "subject", "You have a free interview credit waiting \u2014 practice today",
                    "html", html
            );

            restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            costTracker.record(ApiCostTracker.RequestCostRecord.builder()
                    .feature("email-monthly-bonus").build());
            log.info("Monthly bonus credit email sent to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send monthly bonus credit email to {}: {}", toEmail, e.getMessage(), e);
            Sentry.captureException(e);
        }
    }

    private String buildInsightLine(int s1Comm, int s1Tech, int s1Ps,
                                     int s2Comm, int s2Tech, int s2Ps) {
        int commDelta = s2Comm - s1Comm;
        int techDelta = s2Tech - s1Tech;
        int psDelta = s2Ps - s1Ps;

        String bestArea = null;
        int bestDelta = 0;
        if (commDelta > bestDelta) { bestArea = "Communication"; bestDelta = commDelta; }
        if (techDelta > bestDelta) { bestArea = "Technical"; bestDelta = techDelta; }
        if (psDelta > bestDelta) { bestArea = "Problem Solving"; bestDelta = psDelta; }

        if (bestDelta >= 5) {
            return "Your <strong>" + bestArea + "</strong> score jumped +"
                    + bestDelta + " points across 3 interviews. That's real progress — imagine where a few more sessions would put you.";
        }
        if (bestDelta > 0) {
            return "You're already improving across 3 sessions. A few more targeted sessions could push your scores significantly higher.";
        }
        int avg = (s2Comm + s2Tech + s2Ps) / 3;
        if (avg >= 70) {
            return "You're scoring above 70 on average — a few more sessions could push you into interview-ready territory.";
        }
        return "Scores often fluctuate in the first few sessions. Candidates typically hit their stride around session 5 — you've built the foundation.";
    }

    public void sendPaymentFailedEmail(String toEmail, String firstName) {
        try {
            String displayName = (firstName != null && !firstName.isBlank()) ? firstName : "there";
            String profileLink = appBaseUrl + "/profile";

            String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
                        <h2 style="color: #111; margin-bottom: 24px;">Your payment didn't go through</h2>
                        <p>Hi %s,</p>
                        <p>We tried to charge your card for your FluentHire subscription, but the payment failed. This can happen if your card expired, was declined, or has insufficient funds.</p>
                        <p style="background-color: #fef2f2; border-left: 3px solid #dc2626; padding: 12px 16px; margin: 24px 0; font-size: 14px; color: #444;">
                            Your live interview credits are paused until the payment is resolved. Free Q&amp;A and Think Out Loud practice are still available.
                        </p>
                        <p>Please update your payment method to restore access. Stripe will retry the charge automatically, but if all retries fail your subscription will be canceled.</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="%s" style="background-color: #2563eb; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Update Payment Method</a>
                        </div>
                        <p style="color: #666; font-size: 14px;">If you believe this is an error, contact your bank or reach out to us at <a href="mailto:support@fluenthire.app" style="color: #2563eb; text-decoration: none;">support@fluenthire.app</a>.</p>
                        <p style="color: #666; font-size: 14px;">— The FluentHire Team</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                        <p style="color: #999; font-size: 12px;">FluentHire — Practice English technical interviews and land remote US jobs.</p>
                    </body>
                    </html>
                    """.formatted(displayName, profileLink);

            Map<String, Object> body = Map.of(
                    "from", "FluentHire <" + fromEmail + ">",
                    "to", List.of(toEmail),
                    "reply_to", REPLY_TO,
                    "subject", "Action required — your FluentHire payment failed",
                    "html", html
            );

            restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            costTracker.record(ApiCostTracker.RequestCostRecord.builder()
                    .feature("email-payment-failed").build());
            log.info("Payment failed email sent to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send payment failed email to {}: {}", toEmail, e.getMessage(), e);
            Sentry.captureException(e);
        }
    }

    public void sendCreditPackConfirmationEmail(String toEmail, String firstName, int creditsPurchased, int totalCredits) {
        try {
            String displayName = (firstName != null && !firstName.isBlank()) ? firstName : "there";
            String dashboardLink = appBaseUrl + "/dashboard";

            String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
                        <h2 style="color: #111; margin-bottom: 24px;">%d credits added to your account!</h2>
                        <p>Hi %s,</p>
                        <p>Your credit pack purchase is confirmed. You now have <strong>%d total credits</strong> ready to use.</p>
                        <p style="color: #666; font-size: 14px;">Credit pack credits never expire — use them whenever you're ready to practice.</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="%s" style="background-color: #2563eb; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Start Practicing</a>
                        </div>
                        <p style="color: #666; font-size: 14px;">Thank you for investing in your career,<br><strong>The FluentHire Team</strong></p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                        <p style="color: #999; font-size: 12px;">FluentHire — Practice English technical interviews and land remote US jobs.</p>
                    </body>
                    </html>
                    """.formatted(creditsPurchased, displayName, totalCredits, dashboardLink);

            Map<String, Object> body = Map.of(
                    "from", "FluentHire <" + fromEmail + ">",
                    "to", List.of(toEmail),
                    "reply_to", REPLY_TO,
                    "subject", creditsPurchased + " interview credits added to your account",
                    "html", html
            );

            restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            costTracker.record(ApiCostTracker.RequestCostRecord.builder()
                    .feature("email-credit-pack-confirmation").build());
            log.info("Credit pack confirmation email sent to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send credit pack confirmation email to {}: {}", toEmail, e.getMessage(), e);
            Sentry.captureException(e);
        }
    }

    private String formatDelta(int delta) {
        if (delta > 0) return "+" + delta;
        if (delta < 0) return String.valueOf(delta);
        return "\u2014";
    }

    private String deltaColor(int delta) {
        if (delta > 0) return "#16a34a";
        if (delta < 0) return "#dc2626";
        return "#666";
    }
}
