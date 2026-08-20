package com.fluenthire.service;

import com.fluenthire.entity.InterviewSessionStatus;
import com.fluenthire.entity.User;
import com.fluenthire.repository.InterviewSessionRepository;
import com.fluenthire.repository.UserRepository;
import com.fluenthire.repository.UserResponseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailSchedulerService {

    private final UserRepository userRepository;
    private final InterviewSessionRepository interviewSessionRepository;
    private final UserResponseRepository userResponseRepository;
    private final EmailService emailService;
    private final CreditService creditService;

    /**
     * Runs daily at 10:00 AM UTC.
     * Sends credit reminder emails to free users who signed up >= 5 days ago,
     * still have credits > 0, and haven't tried a live interview yet.
     */
    @Scheduled(cron = "0 0 10 * * *")
    @Transactional
    public void sendCreditReminderEmails() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(5);
        List<User> eligible = userRepository.findEligibleForCreditReminder(cutoff);

        int sent = 0;
        for (User user : eligible) {
            // Skip users who have already completed at least one interview
            int completedSessions = interviewSessionRepository.countByUserIdAndStatus(
                    user.getId(), InterviewSessionStatus.COMPLETED);
            if (completedSessions > 0) continue;

            emailService.sendCreditReminderEmail(
                    user.getEmail(), user.getFirstName(), user.getCredits());

            user.setCreditReminderSentAt(LocalDateTime.now());
            userRepository.save(user);
            sent++;
        }

        if (sent > 0) {
            log.info("Credit reminder emails sent: {} (of {} eligible)", sent, eligible.size());
        }
    }

    /**
     * Runs daily at 10:30 AM UTC.
     * Sends win-back emails to users who have been inactive for 7+ days
     * (no Q&A responses and no interview sessions since the cutoff).
     */
    @Scheduled(cron = "0 30 10 * * *")
    @Transactional
    public void sendWinbackEmails() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);
        List<User> eligible = userRepository.findEligibleForWinbackEmail(cutoff);

        int sent = 0;
        for (User user : eligible) {
            String lastQuestion = userResponseRepository
                    .findLastQuestionTitleByUserId(user.getId())
                    .orElse(null);

            emailService.sendWinbackEmail(
                    user.getEmail(), user.getFirstName(), lastQuestion);

            user.setWinbackEmailSentAt(LocalDateTime.now());
            userRepository.save(user);
            sent++;
        }

        if (sent > 0) {
            log.info("Winback emails sent: {} (of {} eligible)", sent, eligible.size());
        }
    }

    /**
     * Runs on the 1st of every month at 10:00 AM UTC.
     * Grants 1 free credit to free-tier users who have 0 credits
     * and haven't already received a MONTHLY_BONUS this month.
     * Credits cannot accumulate — users with 1+ credits are skipped.
     */
    @Scheduled(cron = "0 0 10 1 * *")
    @Transactional
    public void grantMonthlyBonusCredits() {
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        List<User> eligible = userRepository.findEligibleForMonthlyBonus(monthStart);

        int granted = 0;
        for (User user : eligible) {
            creditService.grantMonthlyBonus(user);

            emailService.sendMonthlyBonusCreditEmail(
                    user.getEmail(), user.getFirstName());
            granted++;
        }

        if (granted > 0) {
            log.info("Monthly bonus credits granted: {} (of {} eligible)", granted, eligible.size());
        }
    }
}
