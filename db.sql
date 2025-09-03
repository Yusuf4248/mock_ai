-- -- 1. Users (unchanged)
-- CREATE TABLE users (
--     id BIGSERIAL PRIMARY KEY,
--     full_name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password_hash TEXT NOT NULL,
--     role VARCHAR(50) DEFAULT 'student',
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- -- 2. Mock Tests (added type for listening/reading/etc. to differentiate)
-- CREATE TABLE mock_tests (
--     id BIGSERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     description TEXT,
--     type VARCHAR(50) NOT NULL DEFAULT 'listening', -- e.g., 'listening', 'reading', 'writing', 'speaking'
--     duration_minutes INT NOT NULL,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- -- 3. Test Sections (unchanged, but for listening, these will represent Section 1-4)
-- CREATE TABLE test_sections (
--     id BIGSERIAL PRIMARY KEY,
--     mock_test_id BIGINT REFERENCES mock_tests(id) ON DELETE CASCADE,
--     title VARCHAR(255) NOT NULL, -- e.g., 'Section 1'
--     description TEXT, -- added: for section type like 'Form filling, personal information'
--     section_type VARCHAR(50) NOT NULL, -- listening, but can specify sub-types if needed
--     order_no INT NOT NULL
-- );

-- -- 4. Questions (general questions table, but we'll use listening_questions for specificity; unchanged for now)
-- CREATE TABLE questions (
--     id BIGSERIAL PRIMARY KEY,
--     section_id BIGINT REFERENCES test_sections(id) ON DELETE CASCADE,
--     sub_group_id BIGINT REFERENCES question_sub_groups(id) ON DELETE SET NULL, -- added: link to sub-group
--     question_number INT NOT NULL, -- added: explicit question starting number
--     question_text TEXT NOT NULL,
--     question_type VARCHAR(50), -- e.g., 'multiple_choice', 'fill_blank', 'plan_map_diagram_completion'
--     image_path TEXT, -- added: for map/diagram image file path
--     image_description TEXT, -- added: accessibility description
--     correct_answer TEXT, -- comma-separated for multi-blank completions
--     points INT DEFAULT 1, -- can be >1 for multi-answer questions
--     order_no INT -- added: for ordering within section/sub-group
-- );

-- -- 5. Attempts (unchanged)
-- CREATE TABLE attempts (
--     id BIGSERIAL PRIMARY KEY,
--     user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
--     mock_test_id BIGINT REFERENCES mock_tests(id) ON DELETE CASCADE,
--     started_at TIMESTAMP DEFAULT NOW(),
--     finished_at TIMESTAMP
-- );

-- -- 6. Answers (unchanged)
-- CREATE TABLE answers (
--     id BIGSERIAL PRIMARY KEY,
--     attempt_id BIGINT REFERENCES attempts(id) ON DELETE CASCADE,
--     question_id BIGINT REFERENCES questions(id) ON DELETE CASCADE,
--     user_answer TEXT,
--     is_correct BOOLEAN,
--     answered_at TIMESTAMP DEFAULT NOW()
-- );

-- -- 7. Feedback (unchanged)
-- CREATE TABLE feedback (
--     id BIGSERIAL PRIMARY KEY,
--     attempt_id BIGINT REFERENCES attempts(id) ON DELETE CASCADE,
--     teacher_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
--     comments TEXT,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- -- 8. User Progress (unchanged)
-- CREATE TABLE user_progress (
--     id BIGSERIAL PRIMARY KEY,
--     user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
--     total_tests_taken INT DEFAULT 0,
--     average_score NUMERIC(5,2),
--     last_attempt TIMESTAMP
-- );

-- -- 9. Listening Tests (updated: linked directly to mock_test_id, added transcript)
-- CREATE TABLE listening_tests (
--     id BIGSERIAL PRIMARY KEY,
--     mock_test_id BIGINT REFERENCES mock_tests(id) ON DELETE CASCADE,
--     title VARCHAR(255) NOT NULL,
--     audio_file_id BIGINT REFERENCES audio_files(id) ON DELETE SET NULL,
--     transcript TEXT -- added: full audio transcript text
-- );

-- -- 10. Listening Sections (removed, as we're using test_sections for Section 1-4 to unify)

-- -- 11. Question Sub Groups (updated: added fields to match frontend sub-groups)
-- CREATE TABLE question_sub_groups (
--     id BIGSERIAL PRIMARY KEY,
--     section_id BIGINT REFERENCES test_sections(id) ON DELETE CASCADE,
--     sub_title VARCHAR(255), -- e.g., 'Questions 11-16'
--     topic_title VARCHAR(255), -- e.g., 'The Middletown Urban Farming Scheme'
--     question_start INT, -- e.g., 11
--     question_end INT, -- e.g., 16
--     instructions TEXT, -- e.g., 'Choose the correct letter A, B or C'
--     order_no INT
-- );

-- -- 12. Listening Questions (removed, consolidated into general questions table with added fields)

-- -- 13. Question Dependencies (unchanged)
-- CREATE TABLE question_dependencies (
--     id BIGSERIAL PRIMARY KEY,
--     question_id BIGINT REFERENCES questions(id) ON DELETE CASCADE,
--     depends_on BIGINT REFERENCES questions(id) ON DELETE CASCADE
-- );

-- -- 14. Audio Files (unchanged, but can be used for listening audio)
-- CREATE TABLE audio_files (
--     id BIGSERIAL PRIMARY KEY,
--     file_path TEXT NOT NULL,
--     duration_seconds INT,
--     uploaded_at TIMESTAMP DEFAULT NOW()
-- );

-- -- 15. Test Templates (updated: added type to match mock_tests)
-- CREATE TABLE test_templates (
--     id BIGSERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     description TEXT,
--     type VARCHAR(50) NOT NULL DEFAULT 'listening', -- added: to specify template type
--     created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- -- Additional Table: Media Files (new: for question images like maps/diagrams, to separate from audio)
-- CREATE TABLE media_files (
--     id BIGSERIAL PRIMARY KEY,
--     file_path TEXT NOT NULL,
--     file_type VARCHAR(50) NOT NULL, -- e.g., 'image', 'pdf'
--     description TEXT,
--     uploaded_at TIMESTAMP DEFAULT NOW()
-- );

-- -- Alter existing tables if needed (for migration):
-- -- Assuming this is an upgrade, you can run these ALTER statements on your current DB

-- -- Add sub_group_id to questions if not exists
-- ALTER TABLE questions ADD COLUMN IF NOT EXISTS sub_group_id BIGINT REFERENCES question_sub_groups(id) ON DELETE SET NULL;

-- -- Add question_number to questions
-- ALTER TABLE questions ADD COLUMN IF NOT EXISTS question_number INT NOT NULL DEFAULT 1;

-- -- Add image_path and image_description to questions
-- ALTER TABLE questions ADD COLUMN IF NOT EXISTS image_path TEXT;
-- ALTER TABLE questions ADD COLUMN IF NOT EXISTS image_description TEXT;

-- -- Add order_no to questions
-- ALTER TABLE questions ADD COLUMN IF NOT EXISTS order_no INT;

-- -- Add description to test_sections
-- ALTER TABLE test_sections ADD COLUMN IF NOT EXISTS description TEXT;

-- -- Add type to mock_tests
-- ALTER TABLE mock_tests ADD COLUMN IF NOT EXISTS type VARCHAR(50) NOT NULL DEFAULT 'listening';

-- -- Add transcript to listening_tests
-- ALTER TABLE listening_tests ADD COLUMN IF NOT EXISTS transcript TEXT;

-- -- Add fields to question_sub_groups
-- ALTER TABLE question_sub_groups ADD COLUMN IF NOT EXISTS sub_title VARCHAR(255);
-- ALTER TABLE question_sub_groups ADD COLUMN IF NOT EXISTS topic_title VARCHAR(255);
-- ALTER TABLE question_sub_groups ADD COLUMN IF NOT EXISTS question_start INT;
-- ALTER TABLE question_sub_groups ADD COLUMN IF NOT EXISTS question_end INT;
-- ALTER TABLE question_sub_groups ADD COLUMN IF NOT EXISTS instructions TEXT;

-- -- Add type to test_templates
-- ALTER TABLE test_templates ADD COLUMN IF NOT EXISTS type VARCHAR(50) NOT NULL DEFAULT 'listening';


-- DrawSQL import-friendly schema (PostgreSQL)
-- Simplified: only core tables + relationships (no enums, no triggers)

-- DrawSQL-friendly PostgreSQL schema for mockAI Listening (parts-in-one-table design)
-- Import this file into DrawSQL or run in PostgreSQL to create core tables.

-- LISTENINGS (a single listening test or practice set)
CREATE TABLE listenings (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  short_description TEXT,
  language VARCHAR(10),
  level VARCHAR(20),
  estimated_duration_seconds INT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PARTS (all parts for a listening stored here; part_number = 1..4 normally)
CREATE TABLE listening_parts (
  id BIGSERIAL PRIMARY KEY,
  listening_id BIGINT NOT NULL REFERENCES listenings(id) ON DELETE CASCADE,
  part_number INT NOT NULL,
  title TEXT,
  description TEXT,
  order_idx INT DEFAULT 0,
  estimated_duration_seconds INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_listening_part UNIQUE (listening_id, part_number)
);

-- AUDIO FILES (central audio storage)
CREATE TABLE audio_files (
  id BIGSERIAL PRIMARY KEY,
  storage_key TEXT NOT NULL,
  url TEXT,
  filename TEXT,
  mime_type TEXT,
  duration_seconds INT,
  size_bytes BIGINT,
  checksum TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PART_AUDIOS (many-to-many with offsets and order)
CREATE TABLE part_audios (
  id BIGSERIAL PRIMARY KEY,
  listening_part_id BIGINT NOT NULL REFERENCES listening_parts(id) ON DELETE CASCADE,
  audio_file_id BIGINT NOT NULL REFERENCES audio_files(id) ON DELETE RESTRICT,
  order_idx INT DEFAULT 0,
  start_offset_seconds INT DEFAULT 0,
  end_offset_seconds INT,
  transcription TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- QUESTIONS (all questions across parts)
CREATE TABLE questions (
  id BIGSERIAL PRIMARY KEY,
  listening_part_id BIGINT NOT NULL REFERENCES listening_parts(id) ON DELETE CASCADE,
  question_number INT NOT NULL, -- 1..10 (unique per part)
  type TEXT NOT NULL, -- e.g. mcq, gap_fill, short_answer, matching, true_false
  prompt TEXT NOT NULL,
  prompt_html TEXT,
  points NUMERIC(6,2) DEFAULT 1,
  time_limit_seconds INT,
  shuffle_options BOOLEAN DEFAULT true,
  allow_partial_scoring BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_part_question_number UNIQUE (listening_part_id, question_number)
);

-- QUESTION OPTIONS (for MCQ/multiple choice)
CREATE TABLE question_options (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  order_idx INT DEFAULT 0,
  explanation TEXT,
  metadata JSONB
);

-- QUESTION MEDIA (images, supplemental audio/video linked to a question)
CREATE TABLE question_media (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  audio_file_id BIGINT REFERENCES audio_files(id) ON DELETE SET NULL,
  media_url TEXT,
  kind TEXT, -- image | audio | video
  order_idx INT DEFAULT 0
);

-- TRANSLATIONS (generic i18n table)
CREATE TABLE translations (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id BIGINT NOT NULL,
  locale VARCHAR(10) NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TAGS and many-to-many mapping to listenings
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE listening_tags (
  listening_id BIGINT NOT NULL REFERENCES listenings(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (listening_id, tag_id)
);

-- USER ATTEMPTS (records when a user starts/completes a listening test)
CREATE TABLE listening_attempts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  listening_id BIGINT NOT NULL REFERENCES listenings(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  total_score NUMERIC(8,2) DEFAULT 0,
  max_score NUMERIC(8,2) DEFAULT 0,
  status TEXT DEFAULT 'in_progress', -- in_progress | completed | abandoned
  metadata JSONB
);

-- PART ATTEMPTS (progress and score per part)
CREATE TABLE part_attempts (
  id BIGSERIAL PRIMARY KEY,
  listening_attempt_id BIGINT NOT NULL REFERENCES listening_attempts(id) ON DELETE CASCADE,
  listening_part_id BIGINT NOT NULL REFERENCES listening_parts(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  score NUMERIC(8,2) DEFAULT 0
);

-- USER ANSWERS (each question answer submitted by user during an attempt)
CREATE TABLE user_answers (
  id BIGSERIAL PRIMARY KEY,
  listening_attempt_id BIGINT NOT NULL REFERENCES listening_attempts(id) ON DELETE CASCADE,
  question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_option_id BIGINT REFERENCES question_options(id) ON DELETE SET NULL,
  text_answer TEXT,
  is_correct BOOLEAN,
  awarded_points NUMERIC(8,2) DEFAULT 0,
  answered_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB
);

-- INDEXES (helpful for DrawSQL and runtime performance)
CREATE INDEX idx_listening_parts_listening_partnum ON listening_parts(listening_id, part_number);
CREATE INDEX idx_part_audios_part ON part_audios(listening_part_id, order_idx);
CREATE INDEX idx_questions_part_qnum ON questions(listening_part_id, question_number);
CREATE INDEX idx_question_options_question ON question_options(question_id, order_idx);
CREATE INDEX idx_listening_attempts_user ON listening_attempts(user_id);
CREATE INDEX idx_user_answers_attempt ON user_answers(listening_attempt_id);

-- Notes:
-- 1) DrawSQL will import these tables and show FKs. If you need to remove JSONB columns or timestamps for simplicity, you can.
-- 2) Adjust data types (user_id BIGINT => FK to your users table) as needed.
-- 3) Constraints enforce one (listening, part_number) pair and question_number uniqueness per part.

-- End of schema
