import { apiClient, handleApiError } from './ApiService';

function formatDateForInput(date) {
  if (!date) return '';
  if (typeof date === 'string') return date.includes('T') ? date.slice(0, 16) : date.slice(0, 16).replace(' ', 'T');
  if (date instanceof Date && !isNaN(date)) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  return '';
}

function formatDateForApi(date) {
  if (!date) return null;
  if (typeof date === 'string') {
    if (date.includes('T')) return date.replace('T', ' ') + ':00';
    return date;
  }
  if (date instanceof Date && !isNaN(date)) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
  return null;
}

function mapQuizFromApi(quiz) {
  return {
    id: String(quiz.id),
    title: quiz.title,
    description: quiz.description || '',
    category: quiz.course_name || 'General',
    difficulty: 'medium',
    duration: quiz.duration_minutes,
    totalMarks: quiz.total_marks,
    passingScore: quiz.passing_marks || 0,
    status: quiz.status || 'draft',
    questions: typeof quiz.question_count === 'number' ? quiz.question_count : (quiz.questions || 0),
    settings: {
      shuffleQuestions: quiz.shuffle_questions === 1 || quiz.shuffle_questions === true,
      shuffleOptions: quiz.shuffle_options === 1 || quiz.shuffle_options === true,
      showResultsImmediately: quiz.show_results_immediately === 1 || quiz.show_results_immediately === true,
      negativeMarking: quiz.negative_marking ? 0.25 : 0,
      allowReview: quiz.allow_review === 1 || quiz.allow_review === true,
      allowSkip: quiz.allow_skip === 1 || quiz.allow_skip === true,
      singleAttempt: quiz.single_attempt === 1 || quiz.single_attempt === true,
    },
    isLive: quiz.is_live === 1 || quiz.is_live === true,
    startTime: formatDateForInput(quiz.start_time),
    endTime: formatDateForInput(quiz.end_time),
    createdBy: quiz.created_by_name || 'Unknown',
    createdAt: quiz.created_at,
    updatedAt: quiz.updated_at,
  };
}

class QuizService {
  async getAllQuizzes(params = {}) {
    try {
      const { page = 1, limit = 10, status } = params;
      const queryParams = { page, limit };
      if (status) queryParams.status = status;
      const response = await apiClient.get('/quizzes', { params: queryParams });
      const data = response.data;
      return {
        success: true,
        data: {
          data: (data.quizzes || []).map(mapQuizFromApi),
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

  async getQuizById(quizId) {
    try {
      const response = await apiClient.get(`/quizzes/${quizId}`);
      const data = response.data;
      const quiz = mapQuizFromApi(data.quiz);
      quiz.questions = (data.questions || []).map((q) => ({
        id: String(q.id),
        text: q.question_text,
        type: q.question_type === 'mcq' ? 'multiple-choice'
          : q.question_type === 'true_false' ? 'true-false'
          : q.question_type === 'multiple_correct' ? 'multiple-choice'
          : q.question_type === 'fill_blanks' ? 'short-answer'
          : q.question_type,
        difficulty: q.difficulty || 'medium',
        marks: q.marks,
        options: [],
        optionCount: q.option_count || 0,
      }));
      return { success: true, data: quiz };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async createQuiz(quizData) {
    try {
      const payload = {
        title: quizData.title,
        description: quizData.description,
        duration_minutes: quizData.duration,
        total_marks: quizData.totalMarks,
        passing_marks: quizData.passingScore,
        negative_marking: quizData.settings?.negativeMarking ? true : false,
        shuffle_questions: quizData.settings?.shuffleQuestions ?? true,
        shuffle_options: quizData.settings?.shuffleOptions ?? true,
        show_results_immediately: quizData.settings?.showResultsImmediately ?? false,
        allow_review: quizData.settings?.allowReview ?? true,
        allow_skip: quizData.settings?.allowSkip ?? false,
        single_attempt: quizData.settings?.singleAttempt ?? false,
        status: quizData.status || 'draft',
        start_time: formatDateForApi(quizData.startTime),
        end_time: formatDateForApi(quizData.endTime),
        question_ids: (quizData.questions || []).map((q) => q.id),
      };
      const response = await apiClient.post('/quizzes', payload);
      const quiz = mapQuizFromApi(response.data.quiz);
      quiz.questions = (response.data.questions || []).map((q) => ({
        id: String(q.id),
        text: q.question_text,
        type: q.question_type === 'mcq' ? 'multiple-choice'
          : q.question_type === 'true_false' ? 'true-false'
          : q.question_type === 'multiple_correct' ? 'multiple-choice'
          : q.question_type === 'fill_blanks' ? 'short-answer'
          : q.question_type,
        difficulty: q.difficulty || 'medium',
        marks: q.marks,
        options: [],
        optionCount: q.option_count || 0,
      }));
      return { success: true, data: quiz };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async updateQuiz(quizId, quizData) {
    try {
      const payload = {};
      if (quizData.title !== undefined) payload.title = quizData.title;
      if (quizData.description !== undefined) payload.description = quizData.description;
      if (quizData.duration !== undefined) payload.duration_minutes = quizData.duration;
      if (quizData.totalMarks !== undefined) payload.total_marks = quizData.totalMarks;
      if (quizData.passingScore !== undefined) payload.passing_marks = quizData.passingScore;
      if (quizData.status !== undefined) payload.status = quizData.status;
      if (quizData.startTime !== undefined) payload.start_time = formatDateForApi(quizData.startTime);
      if (quizData.endTime !== undefined) payload.end_time = formatDateForApi(quizData.endTime);
      if (quizData.settings?.negativeMarking !== undefined) {
        payload.negative_marking = !!quizData.settings.negativeMarking;
      }
      if (quizData.settings?.shuffleQuestions !== undefined) payload.shuffle_questions = quizData.settings.shuffleQuestions;
      if (quizData.settings?.shuffleOptions !== undefined) payload.shuffle_options = quizData.settings.shuffleOptions;
      if (quizData.settings?.showResultsImmediately !== undefined) payload.show_results_immediately = quizData.settings.showResultsImmediately;
      if (quizData.settings?.allowReview !== undefined) payload.allow_review = quizData.settings.allowReview;
      if (quizData.settings?.allowSkip !== undefined) payload.allow_skip = quizData.settings.allowSkip;
      if (quizData.settings?.singleAttempt !== undefined) payload.single_attempt = quizData.settings.singleAttempt;
      if (quizData.questions !== undefined) {
        payload.question_ids = quizData.questions.map((q) => q.id);
      }
      const response = await apiClient.put(`/quizzes/${quizId}`, payload);
      const quiz = mapQuizFromApi(response.data.quiz);
      quiz.questions = (response.data.questions || []).map((q) => ({
        id: String(q.id),
        text: q.question_text,
        type: q.question_type === 'mcq' ? 'multiple-choice'
          : q.question_type === 'true_false' ? 'true-false'
          : q.question_type === 'multiple_correct' ? 'multiple-choice'
          : q.question_type === 'fill_blanks' ? 'short-answer'
          : q.question_type,
        difficulty: q.difficulty || 'medium',
        marks: q.marks,
        options: [],
        optionCount: q.option_count || 0,
      }));
      return { success: true, data: quiz };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async deleteQuiz(quizId) {
    try {
      await apiClient.delete(`/quizzes/${quizId}`);
      return { success: true, data: { success: true } };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async publishQuiz(quizId, startTime, endTime) {
    return this.updateQuiz(quizId, { status: 'published', startTime, endTime });
  }

  async archiveQuiz(quizId) {
    return this.updateQuiz(quizId, { status: 'archived' });
  }

  async addQuestionsToQuiz(quizId, questionIds) {
    try {
      const response = await apiClient.put(`/quizzes/${quizId}`, { question_ids: questionIds });
      const quiz = mapQuizFromApi(response.data.quiz);
      quiz.questions = (response.data.questions || []).map((q) => ({
        id: String(q.id),
        text: q.question_text,
        type: q.question_type === 'mcq' ? 'multiple-choice'
          : q.question_type === 'true_false' ? 'true-false'
          : q.question_type === 'multiple_correct' ? 'multiple-choice'
          : q.question_type === 'fill_blanks' ? 'short-answer'
          : q.question_type,
        difficulty: q.difficulty || 'medium',
        marks: q.marks,
        options: [],
        optionCount: q.option_count || 0,
      }));
      return { success: true, data: quiz };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async getQuizStats() {
    try {
      const response = await apiClient.get('/quizzes', { params: { limit: 1000 } });
      const quizzes = response.data.quizzes || [];
      return {
        success: true,
        data: {
          totalQuizzes: quizzes.length,
          publishedQuizzes: quizzes.filter((q) => q.status === 'published').length,
          draftQuizzes: quizzes.filter((q) => q.status === 'draft').length,
          archivedQuizzes: quizzes.filter((q) => q.status === 'archived').length,
          totalQuestions: quizzes.reduce((acc, q) => acc + (q.question_count || 0), 0),
        },
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export const quizService = new QuizService();
