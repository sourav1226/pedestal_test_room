# Quiz App - Database Setup

## Prerequisites

- MySQL 8.0+ or MariaDB 10.5+
- MySQL client (mysql CLI, MySQL Workbench, or any SQL client)

## Quick Start

```bash
# Step 1: Create schema and tables
mysql -u root -p < database/schema.sql

# Step 2: Insert seed data
mysql -u root -p quiz_app < database/seed.sql
```

Or run both at once:

```bash
mysql -u root -p < database/schema.sql && mysql -u root -p quiz_app < database/seed.sql
```

## Manual Setup

1. Open your MySQL client
2. Run `source database/schema.sql` to create the database and all tables
3. Run `source database/seed.sql` to populate demo data

## Database Configuration

```
Database: quiz_app
Charset:  utf8mb4
Collation: utf8mb4_unicode_ci
Engine:   InnoDB
```

## Schema Overview

### T3.1 — Authentication & User Management
| Table | Description |
|-------|-------------|
| `roles` | User roles (Admin, Instructor, Student, Moderator) |
| `permissions` | System permissions mapped to modules |
| `role_permissions` | Many-to-many role ↔ permission mapping |
| `users` | All platform users with auth fields |
| `refresh_tokens` | JWT refresh token storage |

### T3.2 — Course, Batch & Enrollment
| Table | Description |
|-------|-------------|
| `courses` | Course catalog |
| `subjects` | Subjects within a course |
| `batches` | Batch/section assignments per course |
| `batch_students` | Student enrollment in batches |

### T3.3 — Quiz & Question Bank
| Table | Description |
|-------|-------------|
| `quizzes` | Quiz definitions with timing and scoring rules |
| `questions` | Question bank linked to quizzes |
| `question_options` | MCQ options with correct answer flag |
| `question_tags` | Tag taxonomy |
| `question_tag_map` | Many-to-many question ↔ tag mapping |

### T3.4 — Attempts, Results & Certificates
| Table | Description |
|-------|-------------|
| `quiz_attempts` | Student quiz attempt sessions |
| `attempt_answers` | Individual answer records per attempt |
| `results` | Final result summary per attempt |
| `leaderboards` | Ranked scores per quiz |
| `certificates` | Issued certificates for passed quizzes |

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@quizapp.com | password123 |
| Instructor | instructor@quizapp.com | password123 |
| Student | student1@quizapp.com | password123 |
| Student | student2@quizapp.com | password123 |
| Student | student3@quizapp.com | password123 (inactive) |
| Moderator | moderator@quizapp.com | password123 |

## CASCADE Rules

| Action | Behavior |
|--------|----------|
| Delete role → role_permissions | CASCADE |
| Delete user → refresh_tokens, quiz_attempts, results, certificates, batch_students | CASCADE |
| Delete course → subjects, batches | CASCADE |
| Delete batch → batch_students | CASCADE |
| Delete quiz → questions, quiz_attempts, results, leaderboards, certificates | CASCADE |
| Delete question → question_options, attempt_answers | CASCADE |
| Delete attempt → attempt_answers | CASCADE |
| Delete role with active users | RESTRICT |
| Delete instructor with batches | RESTRICT |
| Delete question_option with answers | SET NULL |

## ER Diagram

Generate an ER diagram using MySQL Workbench:
1. Open MySQL Workbench
2. File → New Model
3. Database → Reverse Engineer
4. Select the `quiz_app` database
5. The diagram will auto-generate

Or use a tool like dbdiagram.io with the schema.
