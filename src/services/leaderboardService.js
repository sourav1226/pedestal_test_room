import { apiClient } from './ApiService';

function getGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  return 'F';
}

class LeaderboardService {
  async getLeaderboard(quizId, filters = {}) {
    try {
      const params = {};
      if (filters.limit) params.limit = filters.limit;
      const response = await apiClient.get(`/leaderboards/quiz/${quizId}`, { params });
      const data = response.data;
      const totalMarks = data.quiz?.total_marks || 100;
      const currentUserId = localStorage.getItem('currentUserId');
      const entries = (data.leaderboard || []).map((entry) => ({
        rank: entry.rank_position,
        studentId: String(entry.student_id),
        studentName: entry.student_name,
        email: '',
        score: entry.score,
        percentage: totalMarks > 0 ? Math.round((entry.score / totalMarks) * 100) : 0,
        grade: getGrade(totalMarks > 0 ? (entry.score / totalMarks) * 100 : 0),
        correct: 0,
        submittedAt: '',
        isCurrentUser: currentUserId && String(currentUserId) === String(entry.student_id),
        profileImage: entry.profile_image,
      }));

      if (filters.search) {
        return entries.filter((e) =>
          e.studentName.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      if (filters.sortBy === 'score') {
        entries.sort((a, b) => filters.order === 'desc' ? b.score - a.score : a.score - b.score);
      }
      return entries;
    } catch (error) {
      console.error('Leaderboard error:', error);
      return [];
    }
  }

  async getTopPerformers(quizId, limit = 3) {
    const entries = await this.getLeaderboard(quizId, { limit });
    return entries.slice(0, limit);
  }

  async getLeaderboardStats(quizId) {
    try {
      const response = await apiClient.get(`/leaderboards/quiz/${quizId}`);
      const data = response.data;
      const entries = data.leaderboard || [];
      const scores = entries.map((e) => e.score);
      const totalMarks = data.quiz?.total_marks || 100;
      const avg = scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length / totalMarks) * 100)
        : 0;
      const sorted = [...scores].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length > 0
        ? Math.round((sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2) / totalMarks * 100)
        : 0;

      return {
        totalParticipants: data.total_participants || entries.length,
        averageScore: avg,
        highestScore: scores.length > 0 ? Math.round((Math.max(...scores) / totalMarks) * 100) : 0,
        lowestScore: scores.length > 0 ? Math.round((Math.min(...scores) / totalMarks) * 100) : 0,
        medianScore: median,
      };
    } catch (error) {
      console.error('Leaderboard stats error:', error);
      return { totalParticipants: 0, averageScore: 0, highestScore: 0, lowestScore: 0, medianScore: 0 };
    }
  }

  async searchLeaderboard(quizId, searchTerm) {
    return this.getLeaderboard(quizId, { search: searchTerm });
  }

  async getStudentRank(quizId, studentId) {
    const entries = await this.getLeaderboard(quizId);
    return entries.find((entry) => entry.studentId === String(studentId)) || null;
  }

  calculatePercentile(score, allScores) {
    if (!allScores || allScores.length === 0) return 0;
    const betterScores = allScores.filter((s) => s > score).length;
    return Math.round(((allScores.length - betterScores) / allScores.length) * 100);
  }
}

export default new LeaderboardService();
