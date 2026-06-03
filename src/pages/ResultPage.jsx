import React, { useEffect, useState } from 'react';
import { Button, Card } from '../components/student-common';
import {
  ResultSummary,
  CategoryPerformance,
  DifficultyBreakdown,
  PerformanceFeedback,
  PreviousAttempts,
} from '../components/result';
import resultService from '../services/resultService';

/**
 * ResultPage - Main page for displaying quiz results
 */
const ResultPage = () => {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        setLoading(true);
        // In real app, get these from route params or context
        const quizId = 'quiz_001';
        const studentId = 'student_123';
        
        const data = await resultService.getResultData(quizId, studentId);
        setResultData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load result data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card variant="danger">
            <p className="text-red-700 font-semibold mb-4">Error</p>
            <p className="text-red-600 mb-4">{error}</p>
            <Button label="Retry" variant="primary" onClick={() => window.location.reload()} />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['summary', 'categories', 'difficulty', 'feedback', 'attempts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <ResultSummary resultData={resultData} />
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <CategoryPerformance categoryData={resultData.categoryPerformance} />
          )}

          {/* Difficulty Tab */}
          {activeTab === 'difficulty' && (
            <DifficultyBreakdown difficultyData={resultData.difficultyBreakdown} />
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <PerformanceFeedback feedback={resultData.feedback} />
          )}

          {/* Attempts Tab */}
          {activeTab === 'attempts' && (
            <PreviousAttempts attempts={resultData.previousAttempts} />
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Button
            label="Download Certificate"
            variant="success"
            size="lg"
            onClick={() => window.location.href = '/certificate'}
          />
          <Button
            label="View Leaderboard"
            variant="primary"
            size="lg"
            onClick={() => window.location.href = '/student/leaderboard'}
          />
          <Button
            label="View Result Summary"
            variant="outline"
            size="lg"
            onClick={() => window.location.href = '/student/result'}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
