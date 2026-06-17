import { apiClient } from './ApiService';

class AttemptService {
  async startAttempt(quizId) {
    const { data } = await apiClient.post('/attempts/start', { quiz_id: quizId });
    return data;
  }

  async submitAttempt(attemptId, answers) {
    const { data } = await apiClient.post(`/attempts/${attemptId}/submit`, { answers });
    return data;
  }

  async getAttempt(attemptId) {
    const { data } = await apiClient.get(`/attempts/${attemptId}`);
    return data;
  }

  async getMyAttempts() {
    const { data } = await apiClient.get('/attempts');
    return data;
  }
}

export default new AttemptService();
