package com.fluenthire.dto;

import com.fluenthire.entity.DifficultyLevel;
import com.fluenthire.entity.RoleType;

import java.time.LocalDateTime;
import java.util.List;

public record JobDescriptionAnalysisResponse(
        Long id,
        String jobTitle,
        DifficultyLevel seniorityLevel,
        RoleType roleType,
        List<String> technologies,
        List<String> keyResponsibilities,
        List<String> softSkills,
        String companyType,
        LocalDateTime analyzedAt
) {}
