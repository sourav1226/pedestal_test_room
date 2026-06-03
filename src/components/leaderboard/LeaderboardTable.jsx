import React, { useState } from 'react';
import { RankBadge, Button, Card } from '../student-common';
import { formatDate } from '../../utils/formatDate';

/**
 * LeaderboardTable Component - Displays ranked leaderboard with sorting and search
 */
const LeaderboardTable = ({
  data = [],
  onSearch = () => {},
  onSort = () => {},
  currentUserId = '',
}) => {
  const [sortBy, setSortBy] = useState('rank');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleSort = (field) => {
    setSortBy(field);
    onSort(field);
  };

  const getSortIndicator = (field) => {
    return sortBy === field ? ' ↓' : '';
  };

  const getRowHighlight = (studentId) => {
    return studentId === currentUserId ? 'bg-blue-50 border-l-4 border-blue-600' : '';
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-300">
              <tr>
                <th
                  onClick={() => handleSort('rank')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
                >
                  Rank{getSortIndicator('rank')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
                <th
                  onClick={() => handleSort('score')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
                >
                  Score{getSortIndicator('score')}
                </th>
                <th
                  onClick={() => handleSort('percentage')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
                >
                  Percentage{getSortIndicator('percentage')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Correct</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Grade</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-semibold text-gray-700">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((entry) => (
                <tr key={entry.studentId} className={`hover:bg-gray-50 transition-colors ${getRowHighlight(entry.studentId)}`}>
                  <td className="px-4 py-4">
                    <RankBadge rank={entry.rank} showText={false} size="sm" />
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {entry.studentName}
                        {entry.isCurrentUser && (
                          <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{entry.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-lg font-bold text-blue-600">{entry.score}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {entry.percentage}%
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-green-600 font-semibold">{entry.correct}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`font-bold text-sm ${entry.percentage >= 80 ? 'text-green-600' : 'text-blue-600'}`}>
                      {entry.grade}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-4 py-4 text-xs text-gray-600">
                    {formatDate(entry.submittedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {data.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No leaderboard entries found.</p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
