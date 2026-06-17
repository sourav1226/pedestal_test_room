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
('CS Programming Basics',   'Fundamentals of programming',        3, 3, 2, 30, 50,  25,  FALSE, 'active',    '2026-03-15 10:00:00', '2026-03-15 11:00:00'),
('Data Structures & Algorithms', 'Test your knowledge of DSA concepts', 3, 3, 2, 45, 80, 32, FALSE, 'published', '2026-04-01 09:00:00', '2026-04-01 10:00:00'),
('Computer Networks',       'Networking fundamentals and protocols', 3, 3, 2, 30, 60, 24, TRUE,  'published', '2026-04-10 10:00:00', '2026-04-10 11:00:00'),
('Database Management Systems', 'SQL and database concepts',      3, 3, 2, 40, 70, 28, FALSE, 'published', '2026-04-15 09:00:00', '2026-04-15 10:00:00'),
('Operating Systems',       'OS concepts including memory management, scheduling', 3, 3, 2, 35, 60, 24, FALSE, 'active', '2026-04-20 10:00:00', '2026-04-20 11:00:00');

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
-- Questions (Quiz 5 – Data Structures & Algorithms)
-- ============================================================
INSERT INTO questions (quiz_id, question_type, question_text, marks, difficulty, explanation) VALUES
(5, 'mcq',             'What is the time complexity of accessing an element in an array by index?',          5.00, 'easy',   'Array access by index is O(1) because elements are stored contiguously in memory'),
(5, 'mcq',             'Which data structure uses LIFO (Last In First Out) principle?',                       5.00, 'easy',   'Stack follows LIFO principle'),
(5, 'mcq',             'What is the worst-case time complexity of a linear search?',                          5.00, 'easy',   'In worst case, linear search checks all n elements, so O(n)'),
(5, 'mcq',             'Which of the following is NOT a type of tree traversal?',                             5.00, 'medium', 'Random traversal is not a valid tree traversal technique'),
(5, 'multiple_correct','Which of the following have O(log n) time complexity?',                             10.00, 'medium', 'Binary search and BST operations have O(log n) average case'),
(5, 'mcq',             'What data structure is used to implement recursion?',                                5.00, 'easy',   'Stack is used to manage function calls in recursion'),
(5, 'true_false',      'A hash table always has O(1) lookup time in the worst case.',                         5.00, 'medium', 'Hash tables have O(n) worst-case due to collisions'),
(5, 'mcq',             'Which sorting algorithm has the best average-case time complexity?',                  10.00, 'hard',   'Merge sort and heap sort have O(n log n) average case'),
(5, 'mcq',             'What is a linked list?',                                                             5.00, 'easy',   'A linked list is a linear data structure with nodes connected via pointers'),
(5, 'fill_blanks',     'In a binary tree, a node with no children is called a ___ node.',                    5.00, 'easy',   'A node with no children is called a leaf node');

-- Questions (Quiz 6 – Computer Networks)
INSERT INTO questions (quiz_id, question_type, question_text, marks, difficulty, explanation) VALUES
(6, 'mcq',             'What does TCP stand for?',                                                     5.00, 'easy',   'TCP stands for Transmission Control Protocol'),
(6, 'mcq',             'Which layer of the OSI model is responsible for routing?',                     5.00, 'easy',   'The network layer handles routing of packets'),
(6, 'mcq',             'What is the default port for HTTP?',                                           5.00, 'easy',   'HTTP uses port 80 by default'),
(6, 'true_false',      'UDP is connection-oriented protocol.',                                          5.00, 'easy',   'UDP is connectionless, TCP is connection-oriented'),
(6, 'mcq',             'Which device is used to connect two different networks?',                       5.00, 'medium', 'A router connects different networks together'),
(6, 'mcq',             'What is the full form of IP?',                                                  5.00, 'easy',   'IP stands for Internet Protocol'),
(6, 'multiple_correct','Which of the following are transport layer protocols?',                        10.00, 'medium', 'TCP and UDP both operate at the transport layer'),
(6, 'mcq',             'What is a MAC address?',                                                        5.00, 'medium', 'MAC address is a unique hardware identifier for network interfaces'),
(6, 'true_false',      'IPv6 uses 128-bit addresses.',                                                  5.00, 'medium', 'IPv6 uses 128-bit addresses (IPv4 uses 32-bit)'),
(6, 'mcq',             'Which protocol is used to automatically assign IP addresses?',                  10.00, 'medium', 'DHCP (Dynamic Host Configuration Protocol) assigns IP addresses');

-- Questions (Quiz 7 – Database Management Systems)
INSERT INTO questions (quiz_id, question_type, question_text, marks, difficulty, explanation) VALUES
(7, 'mcq',             'What does SQL stand for?',                                                   5.00, 'easy',   'SQL stands for Structured Query Language'),
(7, 'mcq',             'Which command is used to retrieve data from a database?',                    5.00, 'easy',   'SELECT is used to query/retrieve data from tables'),
(7, 'mcq',             'What is a primary key?',                                                     5.00, 'easy',   'A primary key uniquely identifies each record in a table'),
(7, 'mcq',             'Which normal form eliminates transitive dependencies?',                      5.00, 'medium', '3NF (Third Normal Form) eliminates transitive dependencies'),
(7, 'true_false',      'A foreign key can contain NULL values.',                                      5.00, 'medium', 'Foreign keys can be NULL if the relationship is optional'),
(7, 'mcq',             'What is ACID in databases?',                                                10.00, 'hard',   'ACID stands for Atomicity, Consistency, Isolation, Durability'),
(7, 'mcq',             'Which join returns all records from the left table and matched records from the right?', 5.00, 'medium', 'LEFT JOIN returns all left table records with matching right records'),
(7, 'mcq',             'What is a database index used for?',                                          5.00, 'easy',   'Indexes speed up data retrieval operations'),
(7, 'multiple_correct','Which of the following are DDL (Data Definition Language) commands?',        10.00, 'medium', 'CREATE, ALTER, DROP, and TRUNCATE are DDL commands'),
(7, 'fill_blanks',     'The command to remove a table from a database is ___.',                      5.00, 'easy',   'The DROP TABLE command removes a table from the database');

-- Questions (Quiz 8 – Operating Systems)
INSERT INTO questions (quiz_id, question_type, question_text, marks, difficulty, explanation) VALUES
(8, 'mcq',             'Which scheduling algorithm gives the smallest job the highest priority?',      5.00, 'medium', 'SJF (Shortest Job First) schedules the smallest job first'),
(8, 'mcq',             'What is a deadlock?',                                                          5.00, 'easy',   'Deadlock is a state where processes wait indefinitely for resources held by each other'),
(8, 'mcq',             'What is virtual memory?',                                                     5.00, 'easy',   'Virtual memory allows execution of processes not completely in memory'),
(8, 'true_false',      'Round Robin scheduling uses a time quantum.',                                  5.00, 'easy',   'Round Robin assigns a fixed time quantum to each process'),
(8, 'mcq',             'Which memory management scheme suffers from external fragmentation?',         5.00, 'medium', 'Paging eliminates external fragmentation; segmentation suffers from it'),
(8, 'mcq',             'What is a process?',                                                          5.00, 'easy',   'A process is a program in execution'),
(8, 'mcq',             'What is the function of an operating system?',                                5.00, 'easy',   'An OS manages hardware resources and provides services to applications'),
(8, 'multiple_correct','Which of the following are CPU scheduling algorithms?',                       10.00, 'medium', 'FCFS, SJF, and Round Robin are all CPU scheduling algorithms'),
(8, 'true_false',      'Mutex is used for synchronization between processes.',                         5.00, 'medium', 'Mutex (mutual exclusion) is used to prevent race conditions'),
(8, 'mcq',             'Which page replacement algorithm suffers from Belady anomaly?',               10.00, 'hard',   'FIFO page replacement can exhibit Belady anomaly (more frames -> more page faults)');

-- ============================================================
-- Question Options for Quiz 5 (Data Structures) – questions 9-18
-- ============================================================
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
-- Q9: Array access time complexity
(9, 'O(1)', TRUE),
(9, 'O(n)', FALSE),
(9, 'O(log n)', FALSE),
(9, 'O(n²)', FALSE),
-- Q10: LIFO data structure
(10, 'Queue', FALSE),
(10, 'Stack', TRUE),
(10, 'Tree', FALSE),
(10, 'Graph', FALSE),
-- Q11: Linear search worst-case
(11, 'O(1)', FALSE),
(11, 'O(n)', TRUE),
(11, 'O(log n)', FALSE),
(11, 'O(n log n)', FALSE),
-- Q12: NOT a tree traversal
(12, 'Inorder', FALSE),
(12, 'Preorder', FALSE),
(12, 'Postorder', FALSE),
(12, 'Random', TRUE),
-- Q13: O(log n) operations (multiple correct)
(13, 'Binary search', TRUE),
(13, 'Linear search', FALSE),
(13, 'BST search', TRUE),
(13, 'Bubble sort', FALSE),
-- Q14: Recursion data structure
(14, 'Queue', FALSE),
(14, 'Stack', TRUE),
(14, 'Array', FALSE),
(14, 'Tree', FALSE),
-- Q15: Hash table worst-case
(15, 'True', FALSE),
(15, 'False', TRUE),
-- Q16: Best average-case sorting
(16, 'Bubble sort', FALSE),
(16, 'Selection sort', FALSE),
(16, 'Merge sort', TRUE),
(16, 'Insertion sort', FALSE),
-- Q17: Linked list definition
(17, 'A linear data structure with nodes containing data and pointers', TRUE),
(17, 'A hierarchical data structure', FALSE),
(17, 'A collection of key-value pairs', FALSE),
(17, 'A sorted array of elements', FALSE);
-- Q18: Fill blanks - leaf node (correct answer stored in option_text for reference)

-- ============================================================
-- Question Options for Quiz 6 (Computer Networks) – questions 19-28
-- ============================================================
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
-- Q19: TCP stands for
(19, 'Transmission Control Protocol', TRUE),
(19, 'Transfer Control Protocol', FALSE),
(19, 'Transmission Communication Protocol', FALSE),
(19, 'Transfer Communication Protocol', FALSE),
-- Q20: OSI routing layer
(20, 'Application', FALSE),
(20, 'Transport', FALSE),
(20, 'Network', TRUE),
(20, 'Data Link', FALSE),
-- Q21: HTTP port
(21, '21', FALSE),
(21, '80', TRUE),
(21, '443', FALSE),
(21, '8080', FALSE),
-- Q22: UDP connection-oriented
(22, 'True', FALSE),
(22, 'False', TRUE),
-- Q23: Connects two networks
(23, 'Switch', FALSE),
(23, 'Hub', FALSE),
(23, 'Router', TRUE),
(23, 'Modem', FALSE),
-- Q24: IP full form
(24, 'Internet Process', FALSE),
(24, 'Internal Protocol', FALSE),
(24, 'Internet Protocol', TRUE),
(24, 'Interconnect Protocol', FALSE),
-- Q25: Transport layer protocols (multiple correct)
(25, 'TCP', TRUE),
(25, 'UDP', TRUE),
(25, 'IP', FALSE),
(25, 'HTTP', FALSE),
-- Q26: MAC address
(26, 'A software address assigned by DHCP', FALSE),
(26, 'A unique hardware identifier for network interfaces', TRUE),
(26, 'An IP address version', FALSE),
(26, 'A type of network cable', FALSE),
-- Q27: IPv6 address size
(27, 'True', TRUE),
(27, 'False', FALSE),
-- Q28: Auto-assign IP addresses
(28, 'DNS', FALSE),
(28, 'DHCP', TRUE),
(28, 'HTTP', FALSE),
(28, 'FTP', FALSE);

-- ============================================================
-- Question Options for Quiz 7 (DBMS) – questions 29-38
-- ============================================================
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
-- Q29: SQL stands for
(29, 'Simple Query Language', FALSE),
(29, 'Structured Query Language', TRUE),
(29, 'Standard Query Language', FALSE),
(29, 'Sequential Query Language', FALSE),
-- Q30: Retrieve data command
(30, 'INSERT', FALSE),
(30, 'UPDATE', FALSE),
(30, 'SELECT', TRUE),
(30, 'DELETE', FALSE),
-- Q31: Primary key
(31, 'A key used for encryption', FALSE),
(31, 'A unique identifier for each record in a table', TRUE),
(31, 'A key that links two tables', FALSE),
(31, 'An index on a table', FALSE),
-- Q32: 3NF eliminates
(32, '1NF', FALSE),
(32, '2NF', FALSE),
(32, 'Transitive dependencies', TRUE),
(32, 'Functional dependencies', FALSE),
-- Q33: Foreign key NULL
(33, 'True', TRUE),
(33, 'False', FALSE),
-- Q34: ACID
(34, 'A unit of database storage', FALSE),
(34, 'Atomicity, Consistency, Isolation, Durability', TRUE),
(34, 'A type of database join', FALSE),
(34, 'A database indexing method', FALSE),
-- Q35: LEFT JOIN
(35, 'INNER JOIN', FALSE),
(35, 'RIGHT JOIN', FALSE),
(35, 'LEFT JOIN', TRUE),
(35, 'FULL JOIN', FALSE),
-- Q36: Database index
(36, 'To delete data faster', FALSE),
(36, 'To speed up data retrieval', TRUE),
(36, 'To encrypt data', FALSE),
(36, 'To create backups', FALSE),
-- Q37: DDL commands (multiple correct)
(37, 'CREATE', TRUE),
(37, 'SELECT', FALSE),
(37, 'ALTER', TRUE),
(37, 'INSERT', FALSE);
-- Q38: Fill blanks - DROP TABLE answer is in option_text

-- ============================================================
-- Question Options for Quiz 8 (Operating Systems) – questions 39-48
-- ============================================================
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
-- Q39: SJF scheduling
(39, 'FCFS', FALSE),
(39, 'SJF', TRUE),
(39, 'Round Robin', FALSE),
(39, 'Priority', FALSE),
-- Q40: Deadlock
(40, 'A process that never terminates', FALSE),
(40, 'A state where processes wait indefinitely for resources', TRUE),
(40, 'A hardware malfunction', FALSE),
(40, 'A type of virus', FALSE),
-- Q41: Virtual memory
(41, 'Memory on a separate virtual machine', FALSE),
(41, 'Allows execution of processes not completely in memory', TRUE),
(41, 'A type of cache memory', FALSE),
(41, 'RAM that uses virtual addresses', FALSE),
-- Q42: Round Robin time quantum
(42, 'True', TRUE),
(42, 'False', FALSE),
-- Q43: External fragmentation
(43, 'Paging', FALSE),
(43, 'Segmentation', TRUE),
(43, 'Virtual memory', FALSE),
(43, 'Caching', FALSE),
-- Q44: Process definition
(44, 'A running program', FALSE),
(44, 'A program in execution', TRUE),
(44, 'A thread', FALSE),
(44, 'A file on disk', FALSE),
-- Q45: OS function
(45, 'Only runs web browsers', FALSE),
(45, 'Manages hardware resources and provides services to applications', TRUE),
(45, 'Only manages files', FALSE),
(45, 'Is the same as firmware', FALSE),
-- Q46: CPU scheduling algorithms (multiple correct)
(46, 'FCFS', TRUE),
(46, 'SJF', TRUE),
(46, 'Round Robin', TRUE),
(46, 'Paging', FALSE),
-- Q47: Mutex
(47, 'True', TRUE),
(47, 'False', FALSE),
-- Q48: Belady anomaly
(48, 'LRU', FALSE),
(48, 'Optimal', FALSE),
(48, 'FIFO', TRUE),
(48, 'Clock', FALSE);

-- ============================================================
-- Quiz Attempts (for new CS quizzes)
-- ============================================================
INSERT INTO quiz_attempts (quiz_id, student_id, started_at, submitted_at, total_score, percentage, rank_position, status) VALUES
(5, 3, '2026-04-01 09:05:00', '2026-04-01 09:35:00', 60.00, 75.00, 1, 'completed'),
(5, 4, '2026-04-01 09:10:00', '2026-04-01 09:40:00', 45.00, 56.25, 2, 'completed'),
(6, 3, '2026-04-10 10:05:00', '2026-04-10 10:25:00', 50.00, 83.33, 1, 'completed'),
(6, 4, '2026-04-10 10:10:00', '2026-04-10 10:30:00', 35.00, 58.33, 2, 'completed'),
(7, 3, '2026-04-15 09:05:00', '2026-04-15 09:35:00', 55.00, 78.57, 1, 'completed'),
(7, 4, '2026-04-15 09:10:00', '2026-04-15 09:40:00', 40.00, 57.14, 2, 'completed'),
(8, 3, '2026-04-20 10:05:00', '2026-04-20 10:30:00', 45.00, 75.00, 1, 'completed'),
(8, 4, '2026-04-20 10:10:00', '2026-04-20 10:35:00', 30.00, 50.00, 2, 'completed');

-- ============================================================
-- Results (for new CS quizzes)
-- ============================================================
INSERT INTO results (attempt_id, student_id, quiz_id, final_score, percentage, result_status) VALUES
(3, 3, 5, 60.00, 75.00, 'pass'),
(4, 4, 5, 45.00, 56.25, 'pass'),
(5, 3, 6, 50.00, 83.33, 'pass'),
(6, 4, 6, 35.00, 58.33, 'pass'),
(7, 3, 7, 55.00, 78.57, 'pass'),
(8, 4, 7, 40.00, 57.14, 'pass'),
(9, 3, 8, 45.00, 75.00, 'pass'),
(10, 4, 8, 30.00, 50.00, 'pass');

-- ============================================================
-- Leaderboards (for new CS quizzes)
-- ============================================================
INSERT INTO leaderboards (quiz_id, student_id, score, rank_position) VALUES
(5, 3, 60.00, 1),
(5, 4, 45.00, 2),
(6, 3, 50.00, 1),
(6, 4, 35.00, 2),
(7, 3, 55.00, 1),
(7, 4, 40.00, 2),
(8, 3, 45.00, 1),
(8, 4, 30.00, 2);

-- ============================================================
-- Certificates (for new CS quizzes)
-- ============================================================
INSERT INTO certificates (student_id, quiz_id, certificate_no, certificate_url) VALUES
(3, 5, 'CERT-2026-0003', '/certificates/CERT-2026-0003.pdf'),
(4, 5, 'CERT-2026-0004', '/certificates/CERT-2026-0004.pdf'),
(3, 6, 'CERT-2026-0005', '/certificates/CERT-2026-0005.pdf'),
(4, 6, 'CERT-2026-0006', '/certificates/CERT-2026-0006.pdf'),
(3, 7, 'CERT-2026-0007', '/certificates/CERT-2026-0007.pdf'),
(4, 7, 'CERT-2026-0008', '/certificates/CERT-2026-0008.pdf'),
(3, 8, 'CERT-2026-0009', '/certificates/CERT-2026-0009.pdf'),
(4, 8, 'CERT-2026-0010', '/certificates/CERT-2026-0010.pdf');

-- ============================================================
-- Certificate
-- ============================================================
INSERT INTO certificates (student_id, quiz_id, certificate_no, certificate_url) VALUES
(3, 1, 'CERT-2026-0001', '/certificates/CERT-2026-0001.pdf'),
(4, 1, 'CERT-2026-0002', '/certificates/CERT-2026-0002.pdf');
