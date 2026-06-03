/**
 * Import Service
 *
 * Handles file import operations:
 * - CSV parsing
 * - JSON parsing
 * - Data validation
 * - Error reporting
 * - Preview generation
 *
 * Currently handles local parsing. Backend integration can process large files async.
 */
import { ApiService } from './ApiService';
import Papa from 'papaparse';
import { generateId } from '@mock/data';
class ImportService extends ApiService {
    /**
     * Parse and validate CSV file
     */
    async parseCSV(file) {
        return new Promise((resolve) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors && results.errors.length > 0) {
                        return resolve({
                            success: false,
                            error: 'Error parsing CSV file',
                            data: results.errors,
                        });
                    }
                    resolve({
                        success: true,
                        data: results.data,
                    });
                },
                error: (error) => {
                    resolve({
                        success: false,
                        error: error.message,
                    });
                },
            });
        });
    }
    /**
     * Parse and validate JSON file
     */
    async parseJSON(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const content = event.target?.result;
                    const data = JSON.parse(content);
                    // Validate that it's an array
                    if (!Array.isArray(data)) {
                        return resolve({
                            success: false,
                            error: 'JSON file must contain an array of questions',
                        });
                    }
                    resolve({
                        success: true,
                        data,
                    });
                }
                catch (error) {
                    resolve({
                        success: false,
                        error: 'Invalid JSON file format',
                    });
                }
            };
            reader.onerror = () => {
                resolve({
                    success: false,
                    error: 'Error reading file',
                });
            };
            reader.readAsText(file);
        });
    }
    /**
     * Validate file size and type
     */
    validateFile(file, maxSize = 5 * 1024 * 1024) {
        if (file.size > maxSize) {
            return {
                success: false,
                error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
            };
        }
        const allowedTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel'];
        if (!allowedTypes.includes(file.type)) {
            return {
                success: false,
                error: 'File type not supported. Please use CSV or JSON.',
            };
        }
        return { success: true, data: true };
    }
    /**
     * Convert imported row to Question object
     */
    rowToQuestion(row, rowIndex) {
        const errors = [];
        // Validate required fields
        if (!row.text || row.text.trim() === '') {
            errors.push({
                rowIndex,
                field: 'text',
                error: 'Question text is required',
            });
        }
        if (!row.type) {
            errors.push({
                rowIndex,
                field: 'type',
                error: 'Question type is required',
            });
        }
        if (!row.category) {
            errors.push({
                rowIndex,
                field: 'category',
                error: 'Category is required',
            });
        }
        // Validate difficulty
        const validDifficulties = ['easy', 'medium', 'hard'];
        if (!validDifficulties.includes(row.difficulty)) {
            errors.push({
                rowIndex,
                field: 'difficulty',
                error: `Difficulty must be one of: ${validDifficulties.join(', ')}`,
            });
        }
        // Validate marks
        const marks = parseInt(row.marks) || 1;
        if (marks < 1 || marks > 1000) {
            errors.push({
                rowIndex,
                field: 'marks',
                error: 'Marks must be between 1 and 1000',
            });
        }
        if (errors.length > 0) {
            return { question: null, errors };
        }
        // Build question object
        const question = {
            id: generateId('q'),
            text: row.text.trim(),
            type: row.type,
            difficulty: row.difficulty || 'medium',
            marks,
            category: row.category,
            tags: (row.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
            options: this.parseOptions(row),
            correctAnswer: row.correctAnswer || '',
            explanation: row.explanation || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            importedFrom: 'import',
        };
        return { question, errors };
    }
    /**
     * Parse options from imported data
     * Expected format: option1|option2|option3 (for multiple choice)
     */
    parseOptions(row) {
        const optionsStr = row.options || '';
        if (!optionsStr || optionsStr.trim() === '') {
            return [];
        }
        return optionsStr.split('|').map((opt, index) => ({
            id: `opt-${index}`,
            text: opt.trim(),
            isCorrect: opt.trim() === row.correctAnswer,
        }));
    }
    /**
     * Import questions from file
     */
    async importQuestions(file) {
        // Validate file
        const validation = this.validateFile(file);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error,
            };
        }
        // Determine file type and parse
        const isJSON = file.type === 'application/json' || file.name.endsWith('.json');
        const parseResult = await (isJSON ? this.parseJSON(file) : this.parseCSV(file));
        if (!parseResult.success) {
            return {
                success: false,
                error: parseResult.error,
            };
        }
        // Convert rows to questions and validate
        const questions = [];
        const allErrors = [];
        let successCount = 0;
        let failCount = 0;
        (parseResult.data || []).forEach((row, index) => {
            const { question, errors } = this.rowToQuestion(row, index + 1);
            if (question) {
                questions.push(question);
                successCount++;
            }
            else {
                failCount++;
                allErrors.push(...errors);
            }
        });
        return this.simulateApiCall({
            success: true,
            data: {
                success: successCount,
                failed: failCount,
                errors: allErrors,
                questions,
            },
        });
    }
    /**
     * Generate import preview
     */
    async generatePreview(file, maxRows = 5) {
        const isJSON = file.type === 'application/json' || file.name.endsWith('.json');
        const parseResult = await (isJSON ? this.parseJSON(file) : this.parseCSV(file));
        if (!parseResult.success) {
            return parseResult;
        }
        const rows = (parseResult.data || []).slice(0, maxRows);
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        return this.simulateApiCall({
            columns,
            rows,
            totalRows: (parseResult.data || []).length,
        });
    }
    /**
     * Get import template
     */
    getImportTemplate(format) {
        if (format === 'json') {
            return JSON.stringify([
                {
                    text: 'What is the capital of France?',
                    type: 'multiple-choice',
                    difficulty: 'easy',
                    marks: 1,
                    category: 'Geography',
                    tags: 'capitals,europe',
                    options: 'London|Paris|Berlin|Madrid',
                    correctAnswer: 'Paris',
                    explanation: 'Paris is the capital and largest city of France.',
                },
            ], null, 2);
        }
        // CSV template
        return `text,type,difficulty,marks,category,tags,options,correctAnswer,explanation
What is the capital of France?,multiple-choice,easy,1,Geography,capitals|europe,London|Paris|Berlin|Madrid,Paris,Paris is the capital and largest city of France.
Is JavaScript a programming language?,true-false,easy,1,Programming,javascript|programming,True|False,True,Yes JavaScript is a high-level interpreted programming language.`;
    }
}
export const importService = new ImportService();
