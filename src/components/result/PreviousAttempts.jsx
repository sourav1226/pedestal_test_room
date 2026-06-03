import React from 'react';
import { Card } from '../student-common';
import { formatDate } from '../../utils/formatDate';

/**
 * PreviousAttempts Component - Shows history of attempts
 */
const PreviousAttempts = ({ attempts }) => {
  if (!attempts || attempts.length === 0) {
    return (
      <Card title="Attempt History" subtitle="Your previous quiz attempts">
        <p className="text-gray-500 text-center py-6">This is your first attempt!</p>
      </Card>
    );
  }

  return (
    <Card title="Attempt History" subtitle="Your previous quiz attempts">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Attempt</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attempts.map((attempt, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">#{attempt.attemptNumber}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(attempt.date)}</td>
                <td className="px-4 py-3 text-sm font-semibold text-blue-600">{attempt.score}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {attempt.percentage}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PreviousAttempts;
