import React from 'react';
import { ScoreCard, ProgressBar } from '../student-common';
import { calculateAccuracy, formatTime } from '../../utils/calculateGrade';

/**
 * ResultSummary Component - Displays overall score and key metrics
 */
const ResultSummary = ({ resultData }) => {
  const {
    studentName,
    totalScore,
    maxScore,
    percentage,
    grade,
    duration,
    timeSpent,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    unanswered,
  } = resultData;

  const accuracy = calculateAccuracy(correctAnswers, totalQuestions);
  const timeRemaining = duration - timeSpent;

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-8 mb-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Quiz Completed</h1>
        <p className="text-blue-100 text-lg">Great job, {studentName}!</p>
      </div>

      {/* Main Score Display */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <ScoreCard
          label="Total Score"
          value={totalScore}
          maxValue={maxScore}
          unit={`/${maxScore}`}
          variant="success"
          size="lg"
        />
        <ScoreCard
          label="Percentage"
          value={percentage}
          maxValue={100}
          unit="%"
          variant="primary"
          size="lg"
        />
        <ScoreCard
          label="Grade"
          value={grade}
          unit=""
          variant="success"
          size="lg"
        />
        <ScoreCard
          label="Accuracy"
          value={accuracy}
          maxValue={100}
          unit="%"
          variant="warning"
          size="lg"
        />
      </div>

      {/* Answer Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <p className="text-green-600 text-sm font-semibold mb-2">Correct Answers</p>
          <p className="text-3xl font-bold text-green-700">{correctAnswers}/{totalQuestions}</p>
          <p className="text-green-600 text-xs mt-2">{accuracy}% accuracy</p>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <p className="text-red-600 text-sm font-semibold mb-2">Wrong Answers</p>
          <p className="text-3xl font-bold text-red-700">{wrongAnswers}</p>
          <p className="text-red-600 text-xs mt-2">{((wrongAnswers / totalQuestions) * 100).toFixed(1)}% incorrect</p>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-600 text-sm font-semibold mb-2">Unanswered</p>
          <p className="text-3xl font-bold text-yellow-700">{unanswered}</p>
          <p className="text-yellow-600 text-xs mt-2">{((unanswered / totalQuestions) * 100).toFixed(1)}% skipped</p>
        </div>
      </div>

      {/* Time Metrics */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Time Spent</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Total Time Available</p>
            <p className="text-2xl font-bold text-blue-600">{formatTime(duration)}</p>
          </div>
          <div className="text-center border-l border-r border-gray-300 px-4">
            <p className="text-gray-600 text-sm mb-2">Time Used</p>
            <p className="text-2xl font-bold text-green-600">{formatTime(timeSpent)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Time Remaining</p>
            <p className="text-2xl font-bold text-indigo-600">{formatTime(timeRemaining)}</p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar
            percentage={(timeSpent / duration) * 100}
            label="Time Usage"
            color="blue"
            size="lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;
