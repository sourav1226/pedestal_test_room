import { apiClient, handleApiError } from './ApiService';

const TYPE_MAP = {
  mcq: 'multiple-choice',
  true_false: 'true-false',
  multiple_correct: 'multiple-choice',
  fill_blanks: 'short-answer',
};

const TYPE_MAP_REVERSE = {
  'multiple-choice': 'mcq',
  'true-false': 'true_false',
  'short-answer': 'fill_blanks',
};

function mapQuestionFromApi(q) {
  const correctOption = (q.options || []).find((o) => o.is_correct);
  return {
    id: String(q.id),
    text: q.question_text,
    type: TYPE_MAP[q.question_type] || q.question_type || 'multiple-choice',
    difficulty: q.difficulty || 'medium',
    marks: q.marks,
    category: q.quiz_title || 'General',
    tags: [],
    options: (q.options || []).map((o) => ({
      id: String(o.id),
      text: o.option_text,
      isCorrect: !!o.is_correct,
    })),
    correctAnswer: correctOption ? String(correctOption.id) : '',
    explanation: q.explanation || '',
    createdAt: q.created_at,
    updatedAt: q.updated_at,
    quizId: q.quiz_id ? String(q.quiz_id) : null,
  };
}

function mapQuestionToApi(data) {
  const questionType = TYPE_MAP_REVERSE[data.type] || data.type || 'mcq';
  const options = (data.options || []).map((opt) => ({
    option_text: opt.text,
    is_correct: opt.isCorrect || (data.correctAnswer === opt.id),
  }));
  return {
    question_type: questionType,
    question_text: data.text,
    marks: data.marks || 1,
    difficulty: data.difficulty || 'medium',
    explanation: data.explanation || null,
    options,
  };
}

class QuestionService {
  async getAllQuestions(params = {}) {
    try {
      const { page = 1, limit = 10, difficulty, type, search } = params;
      const queryParams = { page, limit };
      if (difficulty) queryParams.difficulty = difficulty;
      if (type) queryParams.question_type = TYPE_MAP_REVERSE[type] || type;
      if (search) queryParams.search = search;
      const response = await apiClient.get('/questions', { params: queryParams });
      const data = response.data;
      return {
        success: true,
        data: {
          data: (data.questions || []).map(mapQuestionFromApi),
          total: data.pagination?.total || 0,
          page: data.pagination?.page || 1,
          limit: data.pagination?.limit || 10,
          totalPages: Math.ceil((data.pagination?.total || 0) / (data.pagination?.limit || 10)),
        },
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async getQuestionById(questionId) {
    try {
      const response = await apiClient.get(`/questions/${questionId}`);
      const q = response.data.question;
      return { success: true, data: mapQuestionFromApi(q) };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async createQuestion(questionData) {
    try {
      const payload = {
        ...mapQuestionToApi(questionData),
        quiz_id: questionData.quiz_id || null,
      };
      const response = await apiClient.post('/questions', payload);
      const q = response.data.question;
      return { success: true, data: mapQuestionFromApi(q) };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async updateQuestion(questionId, questionData) {
    try {
      const payload = mapQuestionToApi(questionData);
      const response = await apiClient.put(`/questions/${questionId}`, payload);
      const q = response.data.question;
      return { success: true, data: mapQuestionFromApi(q) };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async deleteQuestion(questionId) {
    try {
      await apiClient.delete(`/questions/${questionId}`);
      return { success: true, data: { success: true } };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async deleteQuestions(questionIds) {
    let deleted = 0;
    for (const id of questionIds) {
      try {
        await apiClient.delete(`/questions/${id}`);
        deleted++;
      } catch {
        // continue
      }
    }
    return { success: true, data: { deleted } };
  }

  async searchQuestions(searchTerm, filters = {}) {
    try {
      const params = { search: searchTerm, limit: 50 };
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.type) params.question_type = TYPE_MAP_REVERSE[filters.type] || filters.type;
      const response = await apiClient.get('/questions', { params });
      const data = response.data;
      return {
        success: true,
        data: (data.questions || []).map(mapQuestionFromApi),
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async getQuestionsByCategory(category) {
    return this.getAllQuestions({ category, limit: 1000 });
  }

  async getQuestionsByDifficulty(difficulty) {
    return this.getAllQuestions({ difficulty, limit: 1000 });
  }

  async validateQuestion(questionData) {
    const errors = [];
    if (!questionData.text || questionData.text.trim().length === 0) {
      errors.push('Question text is required');
    }
    if (!questionData.type) errors.push('Question type is required');
    if (!questionData.category) errors.push('Category is required');
    if (questionData.type === 'multiple-choice') {
      if (!questionData.options || questionData.options.length < 2) {
        errors.push('Multiple choice questions must have at least 2 options');
      }
      if (!questionData.correctAnswer || questionData.correctAnswer === '') {
        errors.push('Correct answer is required');
      }
    }
    return { success: true, data: { valid: errors.length === 0, errors } };
  }

  async getCategories() {
    try {
      const response = await apiClient.get('/questions', { params: { limit: 1000 } });
      const categories = [...new Set((response.data.questions || []).map((q) => q.quiz_title || 'General').filter(Boolean))];
      return { success: true, data: categories };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async getTags() {
    return { success: true, data: [] };
  }

  async getQuestionStats() {
    try {
      const response = await apiClient.get('/questions', { params: { limit: 10000 } });
      const questions = response.data.questions || [];
      const byDifficulty = { easy: 0, medium: 0, hard: 0 };
      const byType = { 'multiple-choice': 0, 'true-false': 0, 'short-answer': 0 };
      questions.forEach((q) => {
        const d = q.difficulty || 'medium';
        byDifficulty[d] = (byDifficulty[d] || 0) + 1;
        const t = TYPE_MAP[q.question_type] || 'multiple-choice';
        byType[t] = (byType[t] || 0) + 1;
      });
      return {
        success: true,
        data: {
          totalQuestions: questions.length,
          byDifficulty,
          byType,
          byCategory: {},
        },
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export const questionService = new QuestionService();
