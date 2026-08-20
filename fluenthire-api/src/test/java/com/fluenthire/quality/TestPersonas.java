package com.fluenthire.quality;

import com.fluenthire.entity.*;

import java.util.Set;

public final class TestPersonas {

    private TestPersonas() {}

    /** Junior dev, native Spanish speaker, BEGINNER English, grammar challenges */
    public static User juniorSpanish() {
        return User.builder()
                .email("test-quality-junior-es@fluenthire.test")
                .firstName("Maria")
                .lastName("Garcia")
                .enabled(true)
                .onboardingCompleted(true)
                .experienceLevel(DifficultyLevel.JUNIOR)
                .nativeLanguage(NativeLanguage.SPANISH)
                .englishLevel(EnglishLevel.BEGINNER)
                .communicationChallenges(Set.of(CommunicationChallenge.GRAMMAR))
                .credits(10)
                .build();
    }

    /** Mid-level dev, native English speaker, no language barriers */
    public static User midEnglish() {
        return User.builder()
                .email("test-quality-mid-en@fluenthire.test")
                .firstName("James")
                .lastName("Wilson")
                .enabled(true)
                .onboardingCompleted(true)
                .experienceLevel(DifficultyLevel.MID)
                .nativeLanguage(null)
                .englishLevel(null)
                .communicationChallenges(Set.of())
                .credits(10)
                .build();
    }

    /** Senior dev, native Portuguese speaker, INTERMEDIATE English, filler words */
    public static User seniorPortuguese() {
        return User.builder()
                .email("test-quality-senior-pt@fluenthire.test")
                .firstName("Rafael")
                .lastName("Silva")
                .enabled(true)
                .onboardingCompleted(true)
                .experienceLevel(DifficultyLevel.SENIOR)
                .nativeLanguage(NativeLanguage.PORTUGUESE)
                .englishLevel(EnglishLevel.INTERMEDIATE)
                .communicationChallenges(Set.of(CommunicationChallenge.FILLER_WORDS))
                .credits(10)
                .build();
    }
}
