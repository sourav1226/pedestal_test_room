import React from 'react';
import { Card } from '../student-common';

/**
 * PerformanceFeedback Component - Shows feedback and recommendations
 */
const PerformanceFeedback = ({ feedback }) => {
  const { strengths = [], areasToImprove = [], recommendations = [] } = feedback;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths */}
      <Card
        title="Strengths"
        subtitle="What you did well"
        variant="success"
      >
        <ul className="space-y-3">
          {strengths.length > 0 ? (
            strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-1">+</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No specific strengths identified.</p>
          )}
        </ul>
      </Card>

      {/* Areas to Improve */}
      <Card
        title="Areas to Improve"
        subtitle="Opportunities for growth"
        variant="warning"
      >
        <ul className="space-y-3">
          {areasToImprove.length > 0 ? (
            areasToImprove.map((area, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-yellow-600 font-bold mt-1">→</span>
                <span className="text-gray-700">{area}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No areas identified.</p>
          )}
        </ul>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card
          title="Recommendations"
          subtitle="What to focus on next"
          className="md:col-span-2"
        >
          <ol className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex gap-4">
                <span className="text-blue-600 font-bold flex-shrink-0">{index + 1}.</span>
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
};

export default PerformanceFeedback;
