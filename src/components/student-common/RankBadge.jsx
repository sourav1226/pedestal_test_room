import React from 'react';
import { getRankBadge } from '../../utils/calculateGrade';

/**
 * RankBadge Component - Displays rank with styling
 */
const RankBadge = ({
  rank = 1,
  showText = true,
  size = 'md',
  className = '',
}) => {
  const badge = getRankBadge(rank);

  // Size styles
  const sizeStyles = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const textSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Color based on rank
  const getBackgroundColor = () => {
    if (rank === 1) return 'bg-yellow-100 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 border-gray-300';
    if (rank === 3) return 'bg-amber-100 border-amber-300';
    return 'bg-blue-100 border-blue-300';
  };

  if (rank > 3 && !showText) {
    return (
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getBackgroundColor()} border-2 ${sizeStyles[size]} ${className}`}
      >
        {rank}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getBackgroundColor()} border-2 ${sizeStyles[size]}`}>
        {badge}
      </div>
      {showText && rank <= 3 && (
        <div>
          <p className={`${textSizeStyles[size]} font-semibold text-gray-700`}>
            {rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : 'Bronze'}
          </p>
          <p className={`${textSizeStyles[size]} text-gray-500`}>Rank #{rank}</p>
        </div>
      )}
      {showText && rank > 3 && (
        <div>
          <p className={`${textSizeStyles[size]} font-semibold text-gray-700`}>Rank</p>
          <p className={`${textSizeStyles[size]} text-gray-500`}>#{rank}</p>
        </div>
      )}
    </div>
  );
};

export default RankBadge;
