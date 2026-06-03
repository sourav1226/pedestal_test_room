/**
 * Quiz Service
 *
 * Handles all quiz-related operations:
 * - CRUD operations on quizzes
 * - Fetching quiz data
 * - Publishing/archiving quizzes
 * - Quiz statistics
 *
 * Currently uses mock data. Replace with HTTP calls for production.
 */
import { ApiService } from './ApiService';
import { generateId, getMockQuizzesFromStorage, saveMockQuizzesToStorage, initializeMockData } from '@mock/data';
class QuizService extends ApiService {
    constructor() {
        super();
        initializeMockData();
        this.quizzes = getMockQuizzesFromStorage();
    }
    /**
     * Get all quizzes with optional pagination and filtering
     */
    async getAllQuizzes(params) {
        const { page = 1, limit = 10, status } = params || {};
        // Simulate filtering
        let filtered = [...this.quizzes];
        if (status) {
            filtered = filtered.filter((q) => q.status === status);
        }
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
     * Get a single quiz by ID
     */
    async getQuizById(quizId) {
        const quiz = this.quizzes.find((q) => q.id === quizId);
        if (!quiz) {
            return {
                success: false,
                error: `Quiz with ID ${quizId} not found`,
            };
        }
        return this.simulateApiCall(quiz);
    }
    /**
     * Create a new quiz
     */
    async createQuiz(quizData) {
        const newQuiz = {
            id: generateId('quiz'),
            title: quizData.title || 'Untitled Quiz',
            description: quizData.description || '',
            category: quizData.category || 'General Knowledge',
            difficulty: quizData.difficulty || 'medium',
            duration: quizData.duration || 30,
            totalMarks: quizData.totalMarks || 100,
            passingScore: quizData.passingScore || 50,
            status: 'draft',
            questions: [],
            settings: quizData.settings || {
                shuffleQuestions: true,
                shuffleOptions: true,
                showResultsImmediately: false,
                negativeMarking: 0.25,
                allowReview: true,
                allowSkip: false,
                singleAttempt: false,
            },
            createdBy: 'current-user@example.com',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.quizzes.push(newQuiz);
        saveMockQuizzesToStorage(this.quizzes);
        return this.simulateApiCall(newQuiz);
    }
    /**
     * Update an existing quiz
     */
    async updateQuiz(quizId, quizData) {
        const quizIndex = this.quizzes.findIndex((q) => q.id === quizId);
        if (quizIndex === -1) {
            return {
                success: false,
                error: `Quiz with ID ${quizId} not found`,
            };
        }
        const updatedQuiz = {
            ...this.quizzes[quizIndex],
            ...quizData,
            id: quizId, // Prevent ID change
            createdAt: this.quizzes[quizIndex].createdAt, // Prevent creation date change
            updatedAt: new Date().toISOString(),
        };
        this.quizzes[quizIndex] = updatedQuiz;
        saveMockQuizzesToStorage(this.quizzes);
        return this.simulateApiCall(updatedQuiz);
    }
    /**
     * Delete a quiz
     */
    async deleteQuiz(quizId) {
        const quizIndex = this.quizzes.findIndex((q) => q.id === quizId);
        if (quizIndex === -1) {
            return {
                success: false,
                error: `Quiz with ID ${quizId} not found`,
            };
        }
        this.quizzes.splice(quizIndex, 1);
        saveMockQuizzesToStorage(this.quizzes);
        return this.simulateApiCall({ success: true });
    }
    /**
     * Publish a quiz
     */
    async publishQuiz(quizId) {
        const quiz = this.quizzes.find((q) => q.id === quizId);
        if (!quiz) {
            return {
                success: false,
                error: `Quiz with ID ${quizId} not found`,
            };
        }
        if (quiz.questions.length === 0) {
            return {
                success: false,
                error: 'Cannot publish quiz without questions',
            };
        }
        quiz.status = 'published';
        quiz.publishedAt = new Date().toISOString();
        quiz.updatedAt = new Date().toISOString();
        saveMockQuizzesToStorage(this.quizzes);
        return this.simulateApiCall(quiz);
    }
    /**
     * Archive a quiz
     */
    async archiveQuiz(quizId) {
        const quiz = this.quizzes.find((q) => q.id === quizId);
        if (!quiz) {
            return {
                success: false,
                error: `Quiz with ID ${quizId} not found`,
            };
        }
        quiz.status = 'archived';
        quiz.updatedAt = new Date().toISOString();
        saveMockQuizzesToStorage(this.quizzes);
        return this.simulateApiCall(quiz);
    }
    /**
     * Add questions to quiz
     */
    async addQuestionsToQuiz(quizId, questionIds) {
        const quiz = this.quizzes.find((q) => q.id === quizId);
        if (!quiz) {
            return {
                success: false,
                error: `Quiz with ID ${quizId} not found`,
            };
        }
        // In production, fetch actual questions from DB
        // For now, just update the reference
        quiz.updatedAt = new Date().toISOString();
        return this.simulateApiCall(quiz);
    }
    /**
     * Get quiz statistics (for dashboard)
     */
    async getQuizStats() {
        const stats = {
            totalQuizzes: this.quizzes.length,
            publishedQuizzes: this.quizzes.filter((q) => q.status === 'published').length,
            draftQuizzes: this.quizzes.filter((q) => q.status === 'draft').length,
            archivedQuizzes: this.quizzes.filter((q) => q.status === 'archived').length,
            totalQuestions: this.quizzes.reduce((acc, q) => acc + q.questions.length, 0),
        };
        return this.simulateApiCall(stats);
    }
}
// Export singleton instance
export const quizService = new QuizService();
