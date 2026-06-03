/**
 * Utility functions
 */
import { VALIDATION } from '@constants/index';
// ============ Validation ============
export const validateQuizTitle = (title) => {
    if (!title || title.trim().length < VALIDATION.QUIZ_TITLE_MIN) {
        return { valid: false, error: `Title must be at least ${VALIDATION.QUIZ_TITLE_MIN} characters` };
    }
    if (title.length > VALIDATION.QUIZ_TITLE_MAX) {
        return { valid: false, error: `Title must not exceed ${VALIDATION.QUIZ_TITLE_MAX} characters` };
    }
    return { valid: true };
};
export const validateQuestionText = (text) => {
    if (!text || text.trim().length < VALIDATION.QUESTION_TEXT_MIN) {
        return { valid: false, error: `Question text must be at least ${VALIDATION.QUESTION_TEXT_MIN} characters` };
    }
    if (text.length > VALIDATION.QUESTION_TEXT_MAX) {
        return { valid: false, error: `Question text must not exceed ${VALIDATION.QUESTION_TEXT_MAX} characters` };
    }
    return { valid: true };
};
export const validateMarks = (marks) => {
    if (marks < VALIDATION.MARKS_MIN || marks > VALIDATION.MARKS_MAX) {
        return {
            valid: false,
            error: `Marks must be between ${VALIDATION.MARKS_MIN} and ${VALIDATION.MARKS_MAX}`,
        };
    }
    return { valid: true };
};
export const validateDuration = (duration) => {
    if (duration < VALIDATION.DURATION_MIN || duration > VALIDATION.DURATION_MAX) {
        return {
            valid: false,
            error: `Duration must be between ${VALIDATION.DURATION_MIN} and ${VALIDATION.DURATION_MAX} minutes`,
        };
    }
    return { valid: true };
};
// ============ Formatting ============
export const formatDuration = (minutes) => {
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
export const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
// ============ String Utilities ============
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
        return text;
    }
    return `${text.substring(0, maxLength)}...`;
};
export const toTitleCase = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
export const toKebabCase = (str) => {
    return str.toLowerCase().replace(/\s+/g, '-');
};
// ============ Array Utilities ============
export const chunk = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};
export const removeDuplicates = (array, key) => {
    if (!key) {
        return Array.from(new Set(array));
    }
    const seen = new Set();
    return array.filter((item) => {
        const k = key(item);
        if (seen.has(k)) {
            return false;
        }
        seen.add(k);
        return true;
    });
};
// ============ Object Utilities ============
export const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
export const filterObject = (obj, predicate) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (predicate(key, value)) {
            acc[key] = value;
        }
        return acc;
    }, {});
};
// ============ CSV/JSON Export ============
export const exportToCSV = (data, filename = 'export.csv') => {
    if (data.length === 0)
        return;
    const headers = Object.keys(data[0]);
    const csv = [
        headers.join(','),
        ...data.map((row) => headers.map((header) => JSON.stringify(row[header])).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadFile(blob, filename);
};
export const exportToJSON = (data, filename = 'export.json') => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadFile(blob, filename);
};
const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
};
// ============ Sorting ============
export const sortBy = (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal)
            return order === 'asc' ? -1 : 1;
        if (aVal > bVal)
            return order === 'asc' ? 1 : -1;
        return 0;
    });
};
// ============ Color Utilities ============
export const getDifficultyColor = (difficulty) => {
    const colors = {
        easy: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        hard: 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
};
export const getStatusColor = (status) => {
    const colors = {
        draft: 'bg-gray-100 text-gray-800',
        published: 'bg-green-100 text-green-800',
        archived: 'bg-gray-300 text-gray-900',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};
