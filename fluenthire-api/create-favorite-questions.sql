-- Migration: Create favorite_questions table
-- Run this on existing databases. For fresh installs, Hibernate ddl-auto: update handles it.

BEGIN;

CREATE TABLE IF NOT EXISTS favorite_questions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    question_id BIGINT NOT NULL REFERENCES questions(id),
    created_at TIMESTAMP,
    CONSTRAINT uk_favorite_question_user UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_favorite_questions_user_id ON favorite_questions(user_id);

COMMIT;
