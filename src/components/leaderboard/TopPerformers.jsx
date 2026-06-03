import React from 'react';
import { RankBadge, Card } from '../student-common';

/**
 * TopPerformers Component - Highlights top 3 performers
 */
const TopPerformers = ({ performers = [] }) => {
  if (performers.length === 0) {
    return (
      <Card title="Top Performers" subtitle="Best scores in this quiz">
        <p className="text-gray-500 text-center py-6">No data available</p>
      </Card>
    );
  }

  const topThree = performers.slice(0, 3);

  return (
    <Card title="Top Performers" subtitle="Best scores in this quiz">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topThree.map((performer, index) => (
          <div key={index} className={`text-center p-6 rounded-lg border-2 ${
            index === 0 ? 'border-yellow-300 bg-yellow-50' :
            index === 1 ? 'border-gray-300 bg-gray-50' :
            'border-amber-300 bg-amber-50'
          }`}>
            <div className="mb-4 flex justify-center">
              <RankBadge rank={performer.rank} showText={true} size="md" />
            </div>
            
            <p className="font-bold text-gray-800 mb-1">{performer.studentName}</p>
            <p className="text-xs text-gray-600 mb-4">{performer.email}</p>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Score</p>
              <p className="text-3xl font-bold text-blue-600">{performer.score}</p>
              <p className="text-xs text-indigo-600 font-semibold mt-1">{performer.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopPerformers;
