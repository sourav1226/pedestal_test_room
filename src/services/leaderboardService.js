// Leaderboard Service - Handles leaderboard data operations
import { mockLeaderboardData, leaderboardStats } from '../mock/leaderboardData';

class LeaderboardService {
  /**
   * Fetch leaderboard data
   * @param {string} quizId - Quiz ID
   * @param {object} filters - Filter options (sortBy, order, limit, search)
   * @returns {Promise} Leaderboard data
   */
  async getLeaderboard(quizId, filters = {}) {
    // TODO: Replace with actual API call with filters
    // return await fetch(`/api/leaderboard/${quizId}?sort=${filters.sortBy}&order=${filters.order}`).then(r => r.json());
    
    return new Promise((resolve) => {
      let data = [...mockLeaderboardData];
      
      // Apply filters if provided
      if (filters.search) {
        data = data.filter(entry =>
          entry.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
          entry.email.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      // Apply sorting
      if (filters.sortBy) {
        data.sort((a, b) => {
          const aValue = a[filters.sortBy];
          const bValue = b[filters.sortBy];
          
          if (typeof aValue === 'string') {
            return filters.order === 'desc'
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          }
          
          return filters.order === 'desc'
            ? bValue - aValue
            : aValue - bValue;
        });
      }

      // Apply limit if provided
      if (filters.limit) {
        data = data.slice(0, filters.limit);
      }

      setTimeout(() => resolve(data), 300);
    });
  }

  /**
   * Get top performers
   * @param {string} quizId - Quiz ID
   * @param {number} limit - Number of top performers to fetch
   * @returns {Promise} Top performers data
   */
  async getTopPerformers(quizId, limit = 3) {
    return this.getLeaderboard(quizId, { limit, sortBy: 'score', order: 'desc' });
  }

  /**
   * Get leaderboard statistics
   * @param {string} quizId - Quiz ID
   * @returns {Promise} Leaderboard statistics
   */
  async getLeaderboardStats(quizId) {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(leaderboardStats), 200);
    });
  }

  /**
   * Search leaderboard by name or email
   * @param {string} quizId - Quiz ID
   * @param {string} searchTerm - Search term
   * @returns {Promise} Filtered leaderboard data
   */
  async searchLeaderboard(quizId, searchTerm) {
    return this.getLeaderboard(quizId, { search: searchTerm });
  }

  /**
   * Get student's rank
   * @param {string} quizId - Quiz ID
   * @param {string} studentId - Student ID
   * @returns {Promise} Student rank information
   */
  async getStudentRank(quizId, studentId) {
    const leaderboard = await this.getLeaderboard(quizId);
    const student = leaderboard.find(entry => entry.studentId === studentId);
    return student || null;
  }

  /**
   * Get percentile rank
   * @param {number} score - Student score
   * @param {array} allScores - All scores
   * @returns {number} Percentile
   */
  calculatePercentile(score, allScores) {
    const betterScores = allScores.filter(s => s > score).length;
    return Math.round(((allScores.length - betterScores) / allScores.length) * 100);
  }
}

export default new LeaderboardService();
