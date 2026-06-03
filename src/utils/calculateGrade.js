/**
 * Calculate grade based on percentage
 * @param {number} percentage - Score percentage (0-100)
 * @returns {string} Grade (A+, A, B+, B, C+, C, F)
 */
export const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 80) return 'B+';
  if (percentage >= 75) return 'B';
  if (percentage >= 70) return 'C+';
  if (percentage >= 60) return 'C';
  return 'F';
};

/**
 * Get grade color based on grade value
 * @param {string} grade - Grade letter
 * @returns {string} Tailwind color class
 */
export const getGradeColor = (grade) => {
  const gradeColors = {
    'A+': 'text-green-600 bg-green-50',
    'A': 'text-green-600 bg-green-50',
    'B+': 'text-blue-600 bg-blue-50',
    'B': 'text-blue-600 bg-blue-50',
    'C+': 'text-yellow-600 bg-yellow-50',
    'C': 'text-yellow-600 bg-yellow-50',
    'F': 'text-red-600 bg-red-50',
  };
  return gradeColors[grade] || 'text-gray-600 bg-gray-50';
};

/**
 * Calculate performance level based on percentage
 * @param {number} percentage - Score percentage
 * @returns {string} Performance level
 */
export const getPerformanceLevel = (percentage) => {
  if (percentage >= 90) return 'Outstanding';
  if (percentage >= 80) return 'Excellent';
  if (percentage >= 70) return 'Good';
  if (percentage >= 60) return 'Satisfactory';
  return 'Needs Improvement';
};

/**
 * Get performance color based on percentage
 * @param {number} percentage - Score percentage
 * @returns {string} Tailwind color class
 */
export const getPerformanceColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 80) return 'text-green-500';
  if (percentage >= 70) return 'text-blue-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Calculate accuracy percentage
 * @param {number} correct - Number of correct answers
 * @param {number} total - Total questions
 * @returns {number} Accuracy percentage
 */
export const calculateAccuracy = (correct, total) => {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
};

/**
 * Calculate average time per question
 * @param {number} totalTime - Total time spent (in seconds)
 * @param {number} totalQuestions - Total questions
 * @returns {number} Average time per question (in seconds)
 */
export const calculateAverageTime = (totalTime, totalQuestions) => {
  return totalQuestions === 0 ? 0 : Math.round(totalTime / totalQuestions);
};

/**
 * Format seconds to readable time format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time (e.g., "1h 30m 45s")
 */
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

/**
 * Calculate percentile rank
 * @param {number} score - Student score
 * @param {array} allScores - Array of all scores
 * @returns {number} Percentile (0-100)
 */
export const calculatePercentile = (score, allScores) => {
  if (allScores.length === 0) return 0;
  const betterScores = allScores.filter(s => s > score).length;
  return Math.round(((allScores.length - betterScores) / allScores.length) * 100);
};

/**
 * Get rank badge/emoji based on rank
 * @param {number} rank - Rank position
 * @returns {string} Badge emoji
 */
export const getRankBadge = (rank) => {
  if (rank === 1) return '1st';
  if (rank === 2) return '2nd';
  if (rank === 3) return '3rd';
  return `#${rank}`;
};

export default {
  calculateGrade,
  getGradeColor,
  getPerformanceLevel,
  getPerformanceColor,
  calculateAccuracy,
  calculateAverageTime,
  formatTime,
  calculatePercentile,
  getRankBadge,
};
