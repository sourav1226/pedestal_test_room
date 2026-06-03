/**
 * Question Service
 *
 * Handles all question-related operations:
 * - CRUD operations on questions
 * - Question bank management
 * - Search and filtering
 * - Question validation
 */
import { ApiService } from './ApiService';
import { generateId, getMockQuestionsFromStorage, saveMockQuestionsToStorage, initializeMockData } from '@mock/data';
class QuestionService extends ApiService {
    constructor() {
        super();
        initializeMockData();
        this.questions = getMockQuestionsFromStorage();
    }
    /**
     * Get all questions with pagination and filtering
     */
    async getAllQuestions(params) {
        const { page = 1, limit = 10, category, difficulty, type, search } = params || {};
        // Apply filters
        let filtered = this.questions.filter((q) => {
            if (category && q.category !== category)
                return false;
            if (difficulty && q.difficulty !== difficulty)
                return false;
            if (type && q.type !== type)
                return false;
            if (search && !q.text.toLowerCase().includes(search.toLowerCase()))
                return false;
            return true;
        });
        const total = filtered.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = filtered.slice(start, end);
        return this.simulateApiCall({
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    }
    /**
     * Get a single question by ID
     */
    async getQuestionById(questionId) {
        const question = this.questions.find((q) => q.id === questionId);
        if (!question) {
            return {
                success: false,
                error: `Question with ID ${questionId} not found`,
            };
        }
        return this.simulateApiCall(question);
    }
    /**
     * Create a new question
     */
    async createQuestion(questionData) {
        const newQuestion = {
            id: generateId('q'),
            text: questionData.text || '',
            type: questionData.type || 'multiple-choice',
            difficulty: questionData.difficulty || 'medium',
            marks: questionData.marks || 1,
            category: questionData.category || 'General Knowledge',
            tags: questionData.tags || [],
            options: questionData.options || [],
            correctAnswer: questionData.correctAnswer || '',
            explanation: questionData.explanation || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.questions.push(newQuestion);
        saveMockQuestionsToStorage(this.questions);
        return this.simulateApiCall(newQuestion);
    }
    /**
     * Update an existing question
     */
    async updateQuestion(questionId, questionData) {
        const questionIndex = this.questions.findIndex((q) => q.id === questionId);
        if (questionIndex === -1) {
            return {
                success: false,
                error: `Question with ID ${questionId} not found`,
            };
        }
        const updatedQuestion = {
            ...this.questions[questionIndex],
            ...questionData,
            id: questionId,
            createdAt: this.questions[questionIndex].createdAt,
            updatedAt: new Date().toISOString(),
        };
        this.questions[questionIndex] = updatedQuestion;
        saveMockQuestionsToStorage(this.questions);
        return this.simulateApiCall(updatedQuestion);
    }
    /**
     * Delete a question
     */
    async deleteQuestion(questionId) {
        const questionIndex = this.questions.findIndex((q) => q.id === questionId);
        if (questionIndex === -1) {
            return {
                success: false,
                error: `Question with ID ${questionId} not found`,
            };
        }
        this.questions.splice(questionIndex, 1);
        saveMockQuestionsToStorage(this.questions);
        return this.simulateApiCall({ success: true });
    }
    /**
     * Bulk delete questions
     */
    async deleteQuestions(questionIds) {
        let deleted = 0;
        for (const id of questionIds) {
            const index = this.questions.findIndex((q) => q.id === id);
            if (index !== -1) {
                this.questions.splice(index, 1);
                deleted++;
            }
        }
        saveMockQuestionsToStorage(this.questions);
        return this.simulateApiCall({ deleted });
    }
    /**
     * Search questions
     */
    async searchQuestions(searchTerm, filters) {
        let results = this.questions.filter((q) => q.text.toLowerCase().includes(searchTerm.toLowerCase()));
        if (filters?.category) {
            results = results.filter((q) => q.category === filters.category);
        }
        if (filters?.difficulty) {
            results = results.filter((q) => q.difficulty === filters.difficulty);
        }
        if (filters?.type) {
            results = results.filter((q) => q.type === filters.type);
        }
        return this.simulateApiCall(results);
    }
    /**
     * Get questions by category
     */
    async getQuestionsByCategory(category) {
        const questions = this.questions.filter((q) => q.category === category);
        return this.simulateApiCall(questions);
    }
    /**
     * Get questions by difficulty
     */
    async getQuestionsByDifficulty(difficulty) {
        const questions = this.questions.filter((q) => q.difficulty === difficulty);
        return this.simulateApiCall(questions);
    }
    /**
     * Validate question data
     */
    async validateQuestion(questionData) {
        const errors = [];
        if (!questionData.text || questionData.text.trim().length === 0) {
            errors.push('Question text is required');
        }
        if (!questionData.type) {
            errors.push('Question type is required');
        }
        if (!questionData.category) {
            errors.push('Category is required');
        }
        if (questionData.type === 'multiple-choice') {
            if (!questionData.options || questionData.options.length < 2) {
                errors.push('Multiple choice questions must have at least 2 options');
            }
            if (!questionData.correctAnswer || questionData.correctAnswer === '') {
                errors.push('Correct answer is required');
            }
        }
        return this.simulateApiCall({
            valid: errors.length === 0,
            errors,
        });
    }
    /**
     * Get all categories
     */
    async getCategories() {
        const categories = Array.from(new Set(this.questions.map((q) => q.category)));
        return this.simulateApiCall(categories);
    }
    /**
     * Get all tags
     */
    async getTags() {
        const tags = Array.from(new Set(this.questions.flatMap((q) => q.tags)));
        return this.simulateApiCall(tags);
    }
    /**
     * Get question statistics
     */
    async getQuestionStats() {
        const stats = {
            totalQuestions: this.questions.length,
            byDifficulty: {
                easy: this.questions.filter((q) => q.difficulty === 'easy').length,
                medium: this.questions.filter((q) => q.difficulty === 'medium').length,
                hard: this.questions.filter((q) => q.difficulty === 'hard').length,
            },
            byType: {
                'multiple-choice': this.questions.filter((q) => q.type === 'multiple-choice').length,
                'true-false': this.questions.filter((q) => q.type === 'true-false').length,
                'short-answer': this.questions.filter((q) => q.type === 'short-answer').length,
                'paragraph': this.questions.filter((q) => q.type === 'paragraph').length,
            },
            byCategory: this.questions.reduce((acc, q) => {
                acc[q.category] = (acc[q.category] || 0) + 1;
                return acc;
            }, {}),
        };
        return this.simulateApiCall(stats);
    }
}
export const questionService = new QuestionService();
