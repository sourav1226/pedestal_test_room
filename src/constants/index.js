// Application constants
export const APP_NAME = 'Quiz Portal';
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
// Difficulty levels
export const DIFFICULTY_LEVELS = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
};
export const DIFFICULTY_LABELS = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
};
// Question types
export const QUESTION_TYPES = {
    MULTIPLE_CHOICE: 'multiple-choice',
    TRUE_FALSE: 'true-false',
    SHORT_ANSWER: 'short-answer',
    PARAGRAPH: 'paragraph',
};
export const QUESTION_TYPE_LABELS = {
    'multiple-choice': 'Multiple Choice',
    'true-false': 'True / False',
    'short-answer': 'Short Answer',
    'paragraph': 'Paragraph',
};
// Quiz status
export const QUIZ_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
};
export const QUIZ_STATUS_LABELS = {
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
};
// Categories
export const CATEGORIES = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'General Knowledge',
    'Programming',
    'Web Development',
    'Data Science',
];
// Tags
export const DEFAULT_TAGS = [
    'Important',
    'Frequently Asked',
    'Conceptual',
    'Practical',
    'Theory',
    'Review',
];
// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 50];
// Validation
export const VALIDATION = {
    QUIZ_TITLE_MIN: 3,
    QUIZ_TITLE_MAX: 100,
    DESCRIPTION_MAX: 500,
    QUESTION_TEXT_MIN: 5,
    QUESTION_TEXT_MAX: 1000,
    OPTION_TEXT_MIN: 1,
    OPTION_TEXT_MAX: 200,
    DURATION_MIN: 1,
    DURATION_MAX: 480, // 8 hours
    MARKS_MIN: 1,
    MARKS_MAX: 1000,
};
// Import settings
export const IMPORT_SETTINGS = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FORMATS: ['csv', 'json'],
};
// Notifications
export const NOTIFICATION_DURATION = 5000; // 5 seconds
