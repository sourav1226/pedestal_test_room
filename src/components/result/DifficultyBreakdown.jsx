import React from 'react';
import { Card } from '../student-common';

/**
 * DifficultyBreakdown Component - Shows performance by difficulty level
 */
const DifficultyBreakdown = ({ difficultyData }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'hard':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card title="Performance by Difficulty" subtitle="How you performed on different difficulty levels">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficultyData.map((item, index) => (
          <div key={index} className={`p-4 rounded-lg border-2 ${getDifficultyColor(item.difficulty)}`}>
            <p className="font-semibold text-sm mb-3">{item.difficulty}</p>
            <div className="space-y-2">
              <div>
                <p className="text-xs opacity-75">Questions</p>
                <p className="text-2xl font-bold">{item.correct}/{item.total}</p>
              </div>
              <div>
                <p className="text-xs opacity-75">Accuracy</p>
                <p className="text-xl font-bold">{item.percentage}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DifficultyBreakdown;
