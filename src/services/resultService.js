import { apiClient } from './ApiService';

function getGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 80) return 'B+';
  if (percentage >= 75) return 'B';
  if (percentage >= 70) return 'C+';
  if (percentage >= 60) return 'C';
  return 'F';
}

function mapResultFromApi(result, answers = []) {
  const correctAnswers = answers.filter((a) => a.marks_awarded > 0).length;
  const wrongAnswers = answers.filter((a) => a.marks_awarded < 0).length;
  const unanswered = answers.filter((a) => a.marks_awarded === 0).length;
  const totalQuestions = answers.length;

  const difficultyData = {};
  answers.forEach((a) => {
    const diff = a.difficulty || 'medium';
    if (!difficultyData[diff]) difficultyData[diff] = { correct: 0, total: 0 };
    difficultyData[diff].total++;
    if (a.marks_awarded > 0) difficultyData[diff].correct++;
  });

  const timeSpent = result.submitted_at && result.started_at
    ? Math.round((new Date(result.submitted_at) - new Date(result.started_at)) / 60000)
    : 0;

  return {
    quizId: String(result.quiz_id),
    quizTitle: result.quiz_title || 'Quiz',
    studentId: String(result.student_id),
    studentName: result.student_name || 'Student',
    studentEmail: result.student_email || '',
    totalScore: result.final_score || 0,
    maxScore: result.total_marks || 0,
    percentage: result.percentage || 0,
    grade: getGrade(result.percentage || 0),
    duration: result.duration_minutes || 0,
    timeSpent,
    submittedAt: result.submitted_at,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    unanswered,
    rank: result.rank_position || 0,
    totalParticipants: 0,
    percentile: 0,
    difficultyBreakdown: Object.entries(difficultyData).map(([difficulty, d]) => ({
      difficulty,
      total: d.total,
      correct: d.correct,
      percentage: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
    })),
    categoryPerformance: [],
    feedback: {
      strengths: ['Good understanding of core concepts'],
      areasToImprove: ['Review topics where answers were incorrect'],
      recommendations: ['Practice more questions in weak areas'],
    },
    comparisons: {
      yourScore: result.final_score || 0,
      classAverage: 0,
      topScore: 0,
    },
    previousAttempts: [],
    averageTimePerQuestion: totalQuestions > 0 ? Math.round(timeSpent / totalQuestions) : 0,
    fastestAnswer: 0,
    slowestAnswer: 0,
  };
}

class ResultService {
  async getResultData(quizId, studentId) {
    try {
      const params = {};
      if (quizId) params.quiz_id = quizId;
      if (studentId) params.student_id = studentId;
      const response = await apiClient.get('/results', { params });
      const results = response.data.results || [];
      if (results.length === 0) {
        throw new Error('No results found');
      }
      const resultId = results[0].id;
      const detailResponse = await apiClient.get(`/results/${resultId}`);
      const { result, answers } = detailResponse.data;
      const mapped = mapResultFromApi(result, answers || []);
      mapped.duration = result.duration_minutes || result.total_marks || 0;

      const attemptsResponse = await apiClient.get('/attempts');
      const attempts = (attemptsResponse.data.attempts || []).map((a, i) => ({
        attemptNumber: i + 1,
        date: a.submitted_at || a.created_at,
        score: a.total_score || 0,
        percentage: a.percentage || 0,
      }));
      mapped.previousAttempts = attempts;

      const lbResponse = await apiClient.get(`/leaderboards/quiz/${quizId}`).catch(() => null);
      if (lbResponse) {
        const lb = lbResponse.data;
        const entries = lb.leaderboard || [];
        mapped.totalParticipants = lb.total_participants || entries.length;
        mapped.comparisons.classAverage = entries.length > 0
          ? Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length)
          : 0;
        mapped.comparisons.topScore = entries.length > 0 ? entries[0].score : 0;
        mapped.percentile = mapped.totalParticipants > 0
          ? Math.round(((mapped.totalParticipants - (mapped.rank || entries.length)) / mapped.totalParticipants) * 100)
          : 0;
      }

      return mapped;
    } catch (error) {
      console.error('Result fetch error:', error);
      throw error;
    }
  }

  async getPerformanceTrend(quizId) {
    try {
      const response = await apiClient.get('/results', { params: { quiz_id: quizId, limit: 1 } });
      const results = response.data.results || [];
      if (results.length === 0) return [];
      const detailResponse = await apiClient.get(`/results/${results[0].id}`);
      const answers = detailResponse.data.answers || [];
      return answers.map((a, i) => ({
        question: i + 1,
        time: 0,
        correct: a.marks_awarded > 0,
      }));
    } catch {
      return [];
    }
  }

  async getScoreDistribution(quizId) {
    try {
      const response = await apiClient.get(`/results/quiz/${quizId}`).catch(() => null);
      if (!response) return [];
      const results = response.data.results || [];
      const ranges = ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'];
      const counts = [0, 0, 0, 0, 0];
      const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4'];
      results.forEach((r) => {
        const pct = r.percentage || 0;
        if (pct <= 20) counts[0]++;
        else if (pct <= 40) counts[1]++;
        else if (pct <= 60) counts[2]++;
        else if (pct <= 80) counts[3]++;
        else counts[4]++;
      });
      return ranges.map((range, i) => ({ range, count: counts[i], fill: colors[i] }));
    } catch {
      return [];
    }
  }

  calculatePercentile(score, allScores = []) {
    if (allScores.length === 0) return 0;
    const betterScores = allScores.filter((s) => s > score).length;
    return Math.round(((allScores.length - betterScores) / allScores.length) * 100);
  }

  generateFeedback(resultData) {
    return resultData.feedback;
  }

  getGrade(percentage) {
    return getGrade(percentage);
  }
}

export default new ResultService();
