package com.fluenthire.dto;

import com.fluenthire.entity.CommunicationChallenge;
import com.fluenthire.entity.DifficultyLevel;
import com.fluenthire.entity.EnglishLevel;
import com.fluenthire.entity.NativeLanguage;
import com.fluenthire.entity.ProgrammingLanguage;
import com.fluenthire.entity.RoleType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileRequest {

    @NotNull(message = "Native language is required")
    private NativeLanguage nativeLanguage;

    @NotNull(message = "English level is required")
    private EnglishLevel englishLevel;

    @NotEmpty(message = "Select at least one communication challenge")
    private Set<CommunicationChallenge> communicationChallenges;

    @NotNull(message = "Experience level is required")
    private DifficultyLevel experienceLevel;

    @NotNull(message = "Role type is required")
    private RoleType roleType;

    @NotNull(message = "Main programming language is required")
    private ProgrammingLanguage mainLanguage;
}
