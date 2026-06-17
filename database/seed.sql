-- ============================================================
-- Quiz Web App - Seed Data
-- ============================================================

USE quiz_app;

-- ============================================================
-- Roles
-- ============================================================
INSERT INTO roles (role_name, description) VALUES
('Admin',      'Full system access and management'),
('Instructor', 'Can create quizzes, manage courses, view results'),
('Student',    'Can attempt quizzes and view own results'),
('Moderator',  'Can review content and moderate activity');

-- ============================================================
-- Permissions
-- ============================================================
INSERT INTO permissions (permission_name, module) VALUES
('users.create',  'Users'),
('users.read',    'Users'),
('users.update',  'Users'),
('users.delete',  'Users'),
('courses.create','Courses'),
('courses.read',  'Courses'),
('courses.update','Courses'),
('courses.delete','Courses'),
('quizzes.create','Quizzes'),
('quizzes.read',  'Quizzes'),
('quizzes.update','Quizzes'),
('quizzes.delete','Quizzes'),
('attempts.read', 'Attempts'),
('results.read',  'Results'),
('certificates.issue','Certificates');

-- ============================================================
-- Role-Permission Mapping
-- ============================================================
-- Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Instructor permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions
WHERE permission_name IN (
  'courses.read','courses.create','courses.update',
  'quizzes.read','quizzes.create','quizzes.update','quizzes.delete',
  'attempts.read','results.read','certificates.issue'
);

-- Student permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions
WHERE permission_name IN ('courses.read','quizzes.read','attempts.read','results.read');

-- Moderator permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions
WHERE permission_name IN (
  'users.read','courses.read','quizzes.read',
  'attempts.read','results.read'
);

-- ============================================================
-- Users (password: "password123" bcrypt hash)
-- ============================================================
INSERT INTO users (role_id, full_name, email, phone, password, status) VALUES
(1, 'Admin User',   'admin@quizapp.com',  '9999999991', '$2b$10$8DFA1dXzSblj4MVrCp87dufew3TDgkAbT2bcFwJpzb8Lcpd4QZTFm', 'active'),
(2, 'Instructor A', 'instructor@quizapp.com', '9999999992', '$2b$10$8DFA1dXzSblj4MVrCp87dufew3TDgkAbT2bcFwJpzb8Lcpd4QZTFm', 'active'),
(3, 'Student One',  'student1@quizapp.com', '9999999993', '$2b$10$8DFA1dXzSblj4MVrCp87dufew3TDgkAbT2bcFwJpzb8Lcpd4QZTFm', 'active'),
(3, 'Student Two',  'student2@quizapp.com', '9999999994', '$2b$10$8DFA1dXzSblj4MVrCp87dufew3TDgkAbT2bcFwJpzb8Lcpd4QZTFm', 'active'),
(3, 'Student Three','student3@quizapp.com', '9999999995', '$2b$10$8DFA1dXzSblj4MVrCp87dufew3TDgkAbT2bcFwJpzb8Lcpd4QZTFm', 'inactive'),
(4, 'Moderator One','moderator@quizapp.com','9999999996', '$2b$10$8DFA1dXzSblj4MVrCp87dufew3TDgkAbT2bcFwJpzb8Lcpd4QZTFm', 'active');

-- ============================================================
-- Courses
-- ============================================================
INSERT INTO courses (course_name, description, duration_days, status) VALUES
('Mathematics 101',  'Basic mathematics covering algebra, geometry, and trigonometry', 90, 'active'),
('Physics 101',      'Introductory physics with mechanics and thermodynamics',         90, 'active'),
('Computer Science', 'Programming fundamentals and data structures',                    120, 'active'),
('English Grammar',  'English language grammar and composition',                        60, 'active');

-- ============================================================
-- Subjects
-- ============================================================
INSERT INTO subjects (course_id, subject_name) VALUES
(1, 'Algebra'),
(1, 'Geometry'),
(1, 'Trigonometry'),
(2, 'Mechanics'),
(2, 'Thermodynamics'),
(3, 'Programming Basics'),
(3, 'Data Structures'),
(4, 'Grammar'),
(4, 'Composition');

-- ============================================================
-- Batches
-- ============================================================
INSERT INTO batches (course_id, instructor_id, batch_name, start_date, end_date, max_students) VALUES
(1, 2, 'Math Batch A', '2026-01-15', '2026-04-15', 30),
(2, 2, 'Physics Batch A', '2026-02-01', '2026-05-01', 25),
(3, 2, 'CS Batch A', '2026-01-20', '2026-05-20', 20);

-- ============================================================
-- Batch Students
-- ============================================================
INSERT INTO batch_students (batch_id, student_id) VALUES
(1, 3),
(1, 4),
(2, 3),
(3, 4);

-- ============================================================
-- Quizzes
-- ============================================================
INSERT INTO quizzes (title, description, course_id, batch_id, created_by, duration_minutes, total_marks, passing_marks, negative_marking, status, start_time, end_time) VALUES
('Algebra Basics Quiz',     'Test your algebra fundamentals',     1, 1, 2, 30, 50,  20,  FALSE, 'published', '2026-03-01 09:00:00', '2026-03-01 10:00:00'),
('Geometry Fundamentals',   'Test your geometry knowledge',       1, 1, 2, 45, 100, 40,  TRUE,  'published', '2026-03-10 09:00:00', '2026-03-10 10:00:00'),
('Mechanics Midterm',       'Midterm assessment for mechanics',   2, 2, 2, 60, 100, 35,  FALSE, 'draft',     NULL,                   NULL),
('CS Programming Basics',   'Fundamentals of programming',        3, 3, 2, 30, 50,  25,  FALSE, 'active',    '2026-03-15 10:00:00', '2026-03-15 11:00:00');

-- ============================================================
-- Questions (Quiz 1 – Algebra Basics)
-- ============================================================
INSERT INTO questions (quiz_id, question_type, question_text, marks, difficulty, explanation) VALUES
(1, 'mcq',             'What is the value of x in 2x + 5 = 15?',                 5.00, 'easy',   'Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5'),
(1, 'mcq',             'What is the slope of the line y = 3x + 2?',             5.00, 'easy',   'The slope is the coefficient of x, which is 3'),
(1, 'multiple_correct','Which of the following are prime numbers?',             10.00,'medium', 'Prime numbers have exactly two factors: 1 and itself'),
(1, 'true_false',      'The expression (a+b)² = a² + b²',                       5.00, 'easy',   'This is false. (a+b)² = a² + 2ab + b²'),
(1, 'fill_blanks',     'The quadratic formula is x = [-b ± √(b² - 4ac)] / ___', 5.00, 'medium', 'The denominator is 2a'),
(1, 'mcq',             'What is the value of √144?',                             5.00, 'easy',   '√144 = 12'),
(1, 'mcq',             'If f(x) = 2x² + 3x - 5, what is f(2)?',                10.00,'hard',   'f(2) = 2(4) + 6 - 5 = 8 + 6 - 5 = 9'),
(1, 'true_false',      'Every integer is a rational number',                     5.00, 'medium', 'True - every integer can be written as n/1');

-- ============================================================
-- Question Options
-- ============================================================
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
-- Q1: 2x + 5 = 15
(1, 'x = 5',   TRUE),
(1, 'x = 10',  FALSE),
(1, 'x = 7.5', FALSE),
(1, 'x = 20',  FALSE),

-- Q2: Slope of y = 3x + 2
(2, '2',   FALSE),
(2, '3',   TRUE),
(2, '3x',  FALSE),
(2, '3x+2',FALSE),

-- Q3: Which are prime numbers? (multiple correct)
(3, '2',  TRUE),
(3, '4',  FALSE),
(3, '7',  TRUE),
(3, '9',  FALSE),
(3, '13', TRUE),

-- Q4: (a+b)² = a² + b²
(4, 'True',  FALSE),
(4, 'False', TRUE),

-- Q6: √144
(6, '10', FALSE),
(6, '11', FALSE),
(6, '12', TRUE),
(6, '14', FALSE),

-- Q7: f(2) where f(x)=2x²+3x-5
(7, '7',  FALSE),
(7, '8',  FALSE),
(7, '9',  TRUE),
(7, '15', FALSE),

-- Q8: Every integer is a rational number
(8, 'True',  TRUE),
(8, 'False', FALSE);

-- ============================================================
-- Quiz Attempts
-- ============================================================
INSERT INTO quiz_attempts (quiz_id, student_id, started_at, submitted_at, total_score, percentage, rank_position, status) VALUES
(1, 3, '2026-03-01 09:05:00', '2026-03-01 09:25:00', 35.00, 70.00, 1, 'completed'),
(1, 4, '2026-03-01 09:10:00', '2026-03-01 09:35:00', 25.00, 50.00, 2, 'completed');

-- ============================================================
-- Attempt Answers
-- ============================================================
-- Student 3 answers (Quiz 1)
INSERT INTO attempt_answers (attempt_id, question_id, selected_option_id, answer_text, marks_awarded) VALUES
(1, 1, 1,  NULL, 5.00),
(1, 2, 6,  NULL, 5.00),
(1, 3, NULL, NULL, 10.00), -- selected 1,3,5 (all correct)
(1, 4, 10, NULL, 5.00),
(1, 5, NULL, '2a', 5.00), -- correct fill
(1, 6, 15, NULL, 5.00),
(1, 7, 19, NULL, 0.00),  -- wrong
(1, 8, 21, NULL, 0.00);  -- wrong

-- Student 4 answers (Quiz 1)
INSERT INTO attempt_answers (attempt_id, question_id, selected_option_id, answer_text, marks_awarded) VALUES
(2, 1, 2,  NULL, 0.00), -- wrong
(2, 2, 6,  NULL, 5.00),
(2, 3, NULL, NULL, 0.00), -- selected wrong ones
(2, 4, 10, NULL, 5.00),
(2, 5, NULL, '2a', 5.00),
(2, 6, 14, NULL, 0.00), -- wrong
(2, 7, 18, NULL, 0.00), -- wrong
(2, 8, 22, NULL, 5.00); -- correct (True)

-- ============================================================
-- Results
-- ============================================================
INSERT INTO results (attempt_id, student_id, quiz_id, final_score, percentage, result_status) VALUES
(1, 3, 1, 35.00, 70.00, 'pass'),
(2, 4, 1, 25.00, 50.00, 'pass');

-- ============================================================
-- Leaderboards
-- ============================================================
INSERT INTO leaderboards (quiz_id, student_id, score, rank_position) VALUES
(1, 3, 35.00, 1),
(1, 4, 25.00, 2);

-- ============================================================
-- Certificates
-- ============================================================
INSERT INTO certificates (student_id, quiz_id, certificate_no, certificate_url) VALUES
(3, 1, 'CERT-2026-0001', '/certificates/CERT-2026-0001.pdf'),
(4, 1, 'CERT-2026-0002', '/certificates/CERT-2026-0002.pdf');
