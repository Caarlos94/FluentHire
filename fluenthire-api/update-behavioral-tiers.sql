-- Migration: Add tier column and update behavioral questions
-- Run this on existing databases. For fresh installs, DataSeeder handles it.

BEGIN;

-- Step 1: Add tier column
ALTER TABLE questions ADD COLUMN IF NOT EXISTS tier VARCHAR(20);

-- Step 2: Delete replaced behavioral questions and their tags/responses/analyses
-- First delete analyses for responses to these questions
DELETE FROM analyses WHERE user_response_id IN (
    SELECT id FROM user_responses WHERE question_id IN (8, 101, 108, 110, 113, 114, 116, 117)
);
-- Delete responses
DELETE FROM user_responses WHERE question_id IN (8, 101, 108, 110, 113, 114, 116, 117);
-- Delete tags
DELETE FROM question_tags WHERE question_id IN (8, 101, 108, 110, 113, 114, 116, 117);
-- Delete questions
DELETE FROM questions WHERE id IN (8, 101, 108, 110, 113, 114, 116, 117);

-- Step 3: Update existing behavioral questions with tier values

-- TIER 1: MUST_KNOW
UPDATE questions SET tier = 'MUST_KNOW' WHERE id = 1; -- Tell me about yourself
UPDATE questions SET tier = 'MUST_KNOW' WHERE id = 4; -- Why are you leaving
UPDATE questions SET tier = 'MUST_KNOW' WHERE id = 2; -- Disagreement with teammate
UPDATE questions SET tier = 'MUST_KNOW' WHERE id = 3; -- A challenging project
UPDATE questions SET tier = 'MUST_KNOW' WHERE id = 6; -- Biggest professional failure
UPDATE questions SET tier = 'MUST_KNOW' WHERE id = 5; -- Leadership without authority
UPDATE questions SET tier = 'MUST_KNOW' WHERE id = 107; -- Handling ambiguous requirements
UPDATE questions SET tier = 'MUST_KNOW' WHERE id = 109; -- Cross-team collaboration

-- TIER 2: COMMONLY_ASKED
UPDATE questions SET tier = 'COMMONLY_ASKED' WHERE id = 102; -- Receiving constructive feedback
UPDATE questions SET tier = 'COMMONLY_ASKED' WHERE id = 105; -- Meeting a tight deadline
UPDATE questions SET tier = 'COMMONLY_ASKED' WHERE id = 7;   -- Working under pressure
UPDATE questions SET tier = 'COMMONLY_ASKED' WHERE id = 106; -- Convincing your team
UPDATE questions SET tier = 'COMMONLY_ASKED' WHERE id = 111; -- Navigating disagreement with mgmt
UPDATE questions SET tier = 'COMMONLY_ASKED' WHERE id = 112; -- Dealing with production incident
UPDATE questions SET tier = 'COMMONLY_ASKED' WHERE id = 115; -- Driving a project from zero

-- Step 4: Update the 2 upgraded questions with new titles/content
UPDATE questions SET
    title = 'Getting unstuck without immediate help',
    content = 'What do you do when you get stuck on a problem and can''t get immediate help? Walk me through your process for unblocking yourself, from first steps to knowing when to escalate.',
    tier = 'REMOTE_SPECIFIC'
WHERE id = 104;

UPDATE questions SET
    title = 'Staying current with technology',
    content = 'How do you stay current with technology and continue growing your skills? Give specific examples of what you''ve learned recently and how you applied it.',
    difficulty = 'MID',
    tier = 'REMOTE_SPECIFIC'
WHERE id = 103;

-- Update tags for upgraded questions
DELETE FROM question_tags WHERE question_id IN (103, 104);
INSERT INTO question_tags (question_id, tag) VALUES
(103, 'learning'), (103, 'growth'), (103, 'continuous-improvement'),
(104, 'problem-solving'), (104, 'resourcefulness'), (104, 'remote-work');

-- Step 5: Insert new behavioral questions

-- TIER 2: COMMONLY_ASKED (3 new)
INSERT INTO questions (id, title, content, category, difficulty, tier, created_at) VALUES
(120, 'Taking initiative without being asked', 'Tell me about a time you took initiative to fix a problem no one asked you to solve. How did you identify the gap and what was the impact?', 'BEHAVIORAL', 'MID', 'COMMONLY_ASKED', NOW()),
(121, 'Project you''re most proud of', 'Tell me about the project you''re most proud of. What made it special, what was your specific contribution, and what was the measurable impact?', 'BEHAVIORAL', 'MID', 'COMMONLY_ASKED', NOW()),
(122, 'Decision with incomplete information', 'Tell me about a time you had to make an important technical decision with incomplete information. How did you assess risk and what was the outcome?', 'BEHAVIORAL', 'SENIOR', 'COMMONLY_ASKED', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(120, 'ownership'), (120, 'proactivity'), (120, 'initiative'),
(121, 'motivation'), (121, 'impact'), (121, 'technical-depth'),
(122, 'judgment'), (122, 'decision-making'), (122, 'risk-assessment');

-- TIER 3: REMOTE_SPECIFIC (5 new — 2 were upgraded above)
INSERT INTO questions (id, title, content, category, difficulty, tier, created_at) VALUES
(123, 'Structuring your remote workday', 'Describe how you structure a typical remote workday. How do you prioritize tasks, manage focus time, and communicate availability to your team?', 'BEHAVIORAL', 'JUNIOR', 'REMOTE_SPECIFIC', NOW()),
(124, 'Async and written communication', 'Tell me about a time you had to rely on written or async communication to get your ideas across. How did you ensure clarity and achieve alignment without a meeting?', 'BEHAVIORAL', 'MID', 'REMOTE_SPECIFIC', NOW()),
(125, 'Working without direct supervision', 'Tell me about a time you worked without direct supervision for an extended period. How did you stay productive, accountable, and keep stakeholders informed?', 'BEHAVIORAL', 'MID', 'REMOTE_SPECIFIC', NOW()),
(126, 'Cross-timezone collaboration', 'Tell me about a time you collaborated with people in different time zones or cultures. How did you handle communication gaps and ensure work continued smoothly?', 'BEHAVIORAL', 'MID', 'REMOTE_SPECIFIC', NOW()),
(127, 'Going above and beyond for a client', 'Tell me about a time you went above and beyond for a customer or client. What did you do and what was the impact on the relationship or project?', 'BEHAVIORAL', 'SENIOR', 'REMOTE_SPECIFIC', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(123, 'self-management'), (123, 'remote-work'), (123, 'productivity'),
(124, 'async'), (124, 'written-communication'), (124, 'remote-work'),
(125, 'autonomy'), (125, 'self-management'), (125, 'remote-work'),
(126, 'timezone'), (126, 'remote-work'), (126, 'collaboration'),
(127, 'customer-focus'), (127, 'proactivity'), (127, 'remote-work');

-- Also update some existing questions' content to better match the research
UPDATE questions SET
    content = 'Tell me about a time you had a conflict or disagreement with a coworker. How did you handle it and what was the outcome?'
WHERE id = 2;

UPDATE questions SET
    title = 'A challenging problem you solved',
    content = 'Tell me about a challenging or complex technical problem you solved. Walk me through your diagnostic process, what alternatives you considered, and the result.'
WHERE id = 3;

UPDATE questions SET
    content = 'Tell me about a time you had to adapt to a major change or navigate ambiguity. How did you maintain quality and deliver results despite the uncertainty?'
WHERE id = 107;

UPDATE questions SET
    content = 'Tell me about a time you worked effectively within a team. Describe your specific role, how you divided work, and how you handled any friction or misalignment.'
WHERE id = 109;

UPDATE questions SET
    content = 'Tell me about a time you demonstrated leadership or drove a project forward without having formal authority. How did you influence others and what was the result?'
WHERE id = 5;

COMMIT;
