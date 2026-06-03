// Result Service - Handles all result-related data operations
import { mockResultData, performanceTrendData, scoreDistributionData } from '../mock/resultData';

class ResultService {
  /**
   * Fetch result data for a specific quiz and student
   * @param {string} quizId - Quiz ID
   * @param {string} studentId - Student ID
   * @returns {Promise} Result data
   */
  async getResultData(quizId, studentId) {
    // Currently returns mock data
    // TODO: Replace with actual API call
    // return await fetch(`/api/results/${quizId}/${studentId}`).then(r => r.json());
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockResultData), 300);
    });
  }

  /**
   * Fetch performance trend data (for charts)
   * @param {string} quizId - Quiz ID
   * @returns {Promise} Performance trend data
   */
  async getPerformanceTrend(quizId) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(performanceTrendData), 200);
    });
  }

  /**
   * Fetch score distribution data (for visualization)
   * @param {string} quizId - Quiz ID
   * @returns {Promise} Score distribution data
   */
  async getScoreDistribution(quizId) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(scoreDistributionData), 200);
    });
  }

  /**
   * Calculate percentile rank
   * @param {number} score - Student score
   * @param {array} allScores - Array of all scores
   * @returns {number} Percentile
   */
  calculatePercentile(score, allScores = []) {
    if (allScores.length === 0) return 0;
    const betterScores = allScores.filter(s => s > score).length;
    return Math.round(((allScores.length - betterScores) / allScores.length) * 100);
  }

  /**
   * Get detailed feedback based on performance
   * @param {object} resultData - Result data object
   * @returns {object} Personalized feedback
   */
  generateFeedback(resultData) {
    // This can be expanded with custom feedback logic later
    return resultData.feedback;
  }

  /**
   * Determine grade based on percentage
   * @param {number} percentage - Score percentage
   * @returns {string} Grade
   */
  getGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 85) return 'A';
    if (percentage >= 80) return 'B+';
    if (percentage >= 75) return 'B';
    if (percentage >= 70) return 'C+';
    if (percentage >= 60) return 'C';
    return 'F';
  }
}

export default new ResultService();
