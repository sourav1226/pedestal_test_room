-- ============================================================
-- Quiz Web App - Complete Database Schema
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS quiz_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE quiz_app;

-- ============================================================
-- T3.1 – Authentication & User Management Tables
-- Author: Inshika Varshney
-- ============================================================

CREATE TABLE roles (
  id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
  role_name   VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE permissions (
  id              BIGINT       AUTO_INCREMENT PRIMARY KEY,
  permission_name VARCHAR(100) NOT NULL UNIQUE,
  module          VARCHAR(100) NOT NULL,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE role_permissions (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  role_id       BIGINT NOT NULL,
  permission_id BIGINT NOT NULL,
  FOREIGN KEY (role_id)       REFERENCES roles(id)       ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE KEY uk_role_permission (role_id, permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
  id                BIGINT       AUTO_INCREMENT PRIMARY KEY,
  role_id           BIGINT       NOT NULL,
  full_name         VARCHAR(150) NOT NULL,
  email             VARCHAR(150) NOT NULL UNIQUE,
  phone             VARCHAR(20)  DEFAULT NULL,
  password          VARCHAR(255) NOT NULL,
  profile_image     VARCHAR(255) DEFAULT NULL,
  status            ENUM('active','inactive') NOT NULL DEFAULT 'active',
  email_verified_at TIMESTAMP    NULL DEFAULT NULL,
  created_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role_id),
  INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE refresh_tokens (
  id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT       NOT NULL,
  token      TEXT         NOT NULL,
  expires_at TIMESTAMP    NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- T3.2 – Course, Batch & Enrollment Tables
-- Author: Sakshi Kumari
-- ============================================================

CREATE TABLE courses (
  id            BIGINT       AUTO_INCREMENT PRIMARY KEY,
  course_name   VARCHAR(200) NOT NULL,
  description   TEXT,
  duration_days INT          NOT NULL DEFAULT 0,
  status        ENUM('active','inactive','archived') NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_courses_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE subjects (
  id           BIGINT       AUTO_INCREMENT PRIMARY KEY,
  course_id    BIGINT       NOT NULL,
  subject_name VARCHAR(150) NOT NULL,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_subjects_course (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE batches (
  id            BIGINT       AUTO_INCREMENT PRIMARY KEY,
  course_id     BIGINT       NOT NULL,
  instructor_id BIGINT       NOT NULL,
  batch_name    VARCHAR(150) NOT NULL,
  start_date    DATE         NOT NULL,
  end_date      DATE         DEFAULT NULL,
  max_students  INT          NOT NULL DEFAULT 0,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id)     REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (instructor_id) REFERENCES users(id)   ON DELETE RESTRICT,
  INDEX idx_batches_course (course_id),
  INDEX idx_batches_instructor (instructor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE batch_students (
  id         BIGINT    AUTO_INCREMENT PRIMARY KEY,
  batch_id   BIGINT    NOT NULL,
  student_id BIGINT    NOT NULL,
  joined_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id)   REFERENCES batches(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE,
  UNIQUE KEY uk_batch_student (batch_id, student_id),
  INDEX idx_bs_batch (batch_id),
  INDEX idx_bs_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- T3.3 – Quiz & Question Bank Tables
-- Author: Divya Sharma
-- ============================================================

CREATE TABLE quizzes (
  id               BIGINT       AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(255) NOT NULL,
  description      TEXT,
  course_id        BIGINT       DEFAULT NULL,
  batch_id         BIGINT       DEFAULT NULL,
  created_by       BIGINT       NOT NULL,
  duration_minutes INT          NOT NULL DEFAULT 0,
  total_marks      INT          NOT NULL DEFAULT 0,
  passing_marks    INT          NOT NULL DEFAULT 0,
  negative_marking BOOLEAN      NOT NULL DEFAULT FALSE,
  status           ENUM('draft','published','active','closed','archived') NOT NULL DEFAULT 'draft',
  start_time       DATETIME     DEFAULT NULL,
  end_time         DATETIME     DEFAULT NULL,
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id)  REFERENCES courses(id) ON DELETE SET NULL,
  FOREIGN KEY (batch_id)   REFERENCES batches(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)   ON DELETE RESTRICT,
  INDEX idx_quizzes_course (course_id),
  INDEX idx_quizzes_batch (batch_id),
  INDEX idx_quizzes_creator (created_by),
  INDEX idx_quizzes_status (status),
  INDEX idx_quizzes_timing (start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE questions (
  id             BIGINT       AUTO_INCREMENT PRIMARY KEY,
  quiz_id        BIGINT       DEFAULT NULL,
  question_type  ENUM('mcq','multiple_correct','true_false','fill_blanks') NOT NULL DEFAULT 'mcq',
  question_text  LONGTEXT     NOT NULL,
  marks          DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  difficulty     ENUM('easy','medium','hard') NOT NULL DEFAULT 'medium',
  explanation    TEXT         DEFAULT NULL,
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  INDEX idx_questions_quiz (quiz_id),
  INDEX idx_questions_type (question_type),
  INDEX idx_questions_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE question_options (
  id            BIGINT    AUTO_INCREMENT PRIMARY KEY,
  question_id   BIGINT    NOT NULL,
  option_text   TEXT      NOT NULL,
  is_correct    BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  INDEX idx_qo_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE question_tags (
  id       BIGINT       AUTO_INCREMENT PRIMARY KEY,
  tag_name VARCHAR(100) NOT NULL UNIQUE,
  INDEX idx_qt_tag (tag_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE question_tag_map (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  question_id BIGINT NOT NULL,
  tag_id      BIGINT NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(id)       ON DELETE CASCADE,
  FOREIGN KEY (tag_id)      REFERENCES question_tags(id)   ON DELETE CASCADE,
  UNIQUE KEY uk_question_tag (question_id, tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- T3.4 – Attempts, Results & Certificates Tables
-- Author: Ekta Sharma
-- ============================================================

CREATE TABLE quiz_attempts (
  id            BIGINT    AUTO_INCREMENT PRIMARY KEY,
  quiz_id       BIGINT    NOT NULL,
  student_id    BIGINT    NOT NULL,
  started_at    DATETIME  NOT NULL,
  submitted_at  DATETIME  DEFAULT NULL,
  total_score   DECIMAL(8,2) DEFAULT 0.00,
  percentage    DECIMAL(5,2) DEFAULT 0.00,
  rank_position INT       DEFAULT NULL,
  status        ENUM('in_progress','completed','timeout','abandoned') NOT NULL DEFAULT 'in_progress',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id)    REFERENCES quizzes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE,
  INDEX idx_qa_quiz (quiz_id),
  INDEX idx_qa_student (student_id),
  INDEX idx_qa_status (status),
  UNIQUE KEY uk_quiz_student_attempt (quiz_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE attempt_answers (
  id                BIGINT        AUTO_INCREMENT PRIMARY KEY,
  attempt_id        BIGINT        NOT NULL,
  question_id       BIGINT        NOT NULL,
  selected_option_id BIGINT       DEFAULT NULL,
  answer_text       TEXT          DEFAULT NULL,
  marks_awarded     DECIMAL(5,2)  DEFAULT 0.00,
  created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id)         REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id)        REFERENCES questions(id)     ON DELETE CASCADE,
  FOREIGN KEY (selected_option_id) REFERENCES question_options(id) ON DELETE SET NULL,
  INDEX idx_aa_attempt (attempt_id),
  INDEX idx_aa_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE results (
  id            BIGINT        AUTO_INCREMENT PRIMARY KEY,
  attempt_id    BIGINT        NOT NULL UNIQUE,
  student_id    BIGINT        NOT NULL,
  quiz_id       BIGINT        NOT NULL,
  final_score   DECIMAL(8,2)  NOT NULL DEFAULT 0.00,
  percentage    DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  result_status ENUM('pass','fail') NOT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id)         ON DELETE CASCADE,
  FOREIGN KEY (quiz_id)    REFERENCES quizzes(id)       ON DELETE CASCADE,
  INDEX idx_results_student (student_id),
  INDEX idx_results_quiz (quiz_id),
  INDEX idx_results_status (result_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE leaderboards (
  id            BIGINT        AUTO_INCREMENT PRIMARY KEY,
  quiz_id       BIGINT        NOT NULL,
  student_id    BIGINT        NOT NULL,
  score         DECIMAL(8,2)  NOT NULL DEFAULT 0.00,
  rank_position INT           NOT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id)    REFERENCES quizzes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE,
  UNIQUE KEY uk_leaderboard_rank (quiz_id, rank_position),
  INDEX idx_lb_quiz (quiz_id),
  INDEX idx_lb_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE certificates (
  id              BIGINT       AUTO_INCREMENT PRIMARY KEY,
  student_id      BIGINT       NOT NULL,
  quiz_id         BIGINT       NOT NULL,
  certificate_no  VARCHAR(100) NOT NULL UNIQUE,
  certificate_url VARCHAR(255) DEFAULT NULL,
  issued_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (quiz_id)    REFERENCES quizzes(id) ON DELETE CASCADE,
  INDEX idx_cert_student (student_id),
  INDEX idx_cert_quiz (quiz_id),
  INDEX idx_cert_no (certificate_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
