import React from 'react';
import { ProgressBar, Card } from '../student-common';

/**
 * CategoryPerformance Component - Shows performance breakdown by category
 */
const CategoryPerformance = ({ categoryData }) => {
  // Sort by percentage in descending order
  const sortedData = [...categoryData].sort((a, b) => b.percentage - a.percentage);

  return (
    <Card title="Category-wise Performance" subtitle="Your performance across different topics">
      <div className="space-y-6">
        {sortedData.map((category, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold text-gray-800">{category.category}</p>
                <p className="text-xs text-gray-500">
                  {category.score}/{category.maxScore} points
                </p>
              </div>
              <span className="text-lg font-bold text-indigo-600">{category.percentage}%</span>
            </div>
            <ProgressBar
              percentage={category.percentage}
              color={category.percentage >= 80 ? 'green' : category.percentage >= 60 ? 'blue' : 'yellow'}
              size="md"
              animated={true}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CategoryPerformance;
