package com.fluenthire.dto;

import com.fluenthire.entity.CommunicationChallenge;
import com.fluenthire.entity.DifficultyLevel;
import com.fluenthire.entity.EnglishLevel;
import com.fluenthire.entity.NativeLanguage;
import com.fluenthire.entity.ProgrammingLanguage;
import com.fluenthire.entity.Role;
import com.fluenthire.entity.RoleType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class ProfileResponse {

    private String email;
    private String firstName;
    private String lastName;
    private NativeLanguage nativeLanguage;
    private EnglishLevel englishLevel;
    private Set<CommunicationChallenge> communicationChallenges;
    private DifficultyLevel experienceLevel;
    private RoleType roleType;
    private ProgrammingLanguage mainLanguage;
    private boolean onboardingCompleted;
    private boolean hasJobDescription;
    private boolean hasJobDescriptionAnalysis;
    private int credits;
    private String createdAt;
    private boolean hasPassword;
    private String plan;
    private String subscriptionStatus;
    private Role role;
}
