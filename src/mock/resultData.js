// Mock Result Data
export const mockResultData = {
  quizId: "quiz_001",
  quizTitle: "Advanced JavaScript Concepts",
  studentId: "student_123",
  studentName: "Divya Sharma",
  studentEmail: "divya.sharma@example.com",
  
  // Score Information
  totalScore: 850,
  maxScore: 1000,
  percentage: 85,
  grade: "A+",
  
  // Time Information
  duration: 3600, // seconds
  timeSpent: 2847, // seconds
  submittedAt: "2026-05-06T14:30:00Z",
  
  // Answer Analytics
  totalQuestions: 50,
  correctAnswers: 42,
  wrongAnswers: 5,
  unanswered: 3,
  
  // Difficulty-wise Performance
  difficultyBreakdown: [
    { difficulty: "Easy", total: 15, correct: 15, percentage: 100 },
    { difficulty: "Medium", total: 25, correct: 22, percentage: 88 },
    { difficulty: "Hard", total: 10, correct: 5, percentage: 50 },
  ],
  
  // Category-wise Performance
  categoryPerformance: [
    { category: "ES6+ Basics", score: 95, maxScore: 100, percentage: 95 },
    { category: "Async/Await", score: 88, maxScore: 100, percentage: 88 },
    { category: "Closures", score: 82, maxScore: 100, percentage: 82 },
    { category: "Promises", score: 85, maxScore: 100, percentage: 85 },
    { category: "Event Loop", score: 75, maxScore: 100, percentage: 75 },
  ],
  
  // Ranking Information
  rank: 3,
  totalParticipants: 156,
  percentile: 98,
  
  // Speed Metrics
  averageTimePerQuestion: 57, // seconds
  fastestAnswer: 5, // seconds
  slowestAnswer: 245, // seconds
  
  // Feedback
  feedback: {
    strengths: ["Excellent grasp of ES6+ concepts", "Strong async handling"],
    areasToImprove: ["Event Loop understanding", "Advanced closure patterns"],
    recommendations: [
      "Review event loop visualization tutorials",
      "Practice closure exercises",
      "Study advanced patterns in real projects",
    ],
  },
  
  // Comparison with Average
  comparisons: {
    yourScore: 85,
    classAverage: 72,
    topScore: 95,
  },
  
  // Attempt History (for retakes)
  previousAttempts: [
    { attemptNumber: 1, score: 78, date: "2026-05-01", percentage: 78 },
    { attemptNumber: 2, score: 82, date: "2026-05-04", percentage: 82 },
  ],
};

// Performance trend data (for charts)
export const performanceTrendData = [
  { question: "Q1", time: 30, correct: true },
  { question: "Q2", time: 45, correct: true },
  { question: "Q3", time: 120, correct: true },
  { question: "Q4", time: 25, correct: true },
  { question: "Q5", time: 60, correct: false },
  { question: "Q6", time: 35, correct: true },
  { question: "Q7", time: 85, correct: true },
  { question: "Q8", time: 15, correct: true },
  { question: "Q9", time: 95, correct: false },
  { question: "Q10", time: 40, correct: true },
];

// Score distribution chart data
export const scoreDistributionData = [
  { range: "0-20", count: 2, fill: "#ef4444" },
  { range: "20-40", count: 5, fill: "#f97316" },
  { range: "40-60", count: 15, fill: "#eab308" },
  { range: "60-80", count: 62, fill: "#3b82f6" },
  { range: "80-100", count: 72, fill: "#10b981" },
];

export default mockResultData;
