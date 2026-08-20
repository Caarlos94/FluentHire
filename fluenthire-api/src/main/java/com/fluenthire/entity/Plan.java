package com.fluenthire.entity;

public enum Plan {
    FREE("Free"),
    INTERVIEW_READY("Interview Ready"),   // Legacy — kept for DB backward compat, will be removed after migration
    INTERVIEW_STARTER("Interview Starter"),
    INTERVIEW_PRO("Interview Pro"),
    INTERVIEW_INTENSIVE("Interview Intensive");

    private final String displayName;

    Plan(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
