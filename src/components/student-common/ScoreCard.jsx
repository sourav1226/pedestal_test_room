import React from 'react';

/**
 * ScoreCard Component - Displays a score with label and styling
 * Reusable across result page, leaderboard, etc.
 */
const ScoreCard = ({
  label = 'Score',
  value = 0,
  maxValue = 100,
  unit = '%',
  icon = null,
  variant = 'default',
  size = 'md',
}) => {
  const percentage = (value / maxValue) * 100;

  // Variant styles
  const variantStyles = {
    default: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
    success: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
    warning: 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200',
    danger: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200',
  };

  // Size styles
  const sizeStyles = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  // Text size styles
  const textSizeStyles = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
  };

  const labelTextSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const getTextColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-xl">{icon}</span>}
        <p className={`${labelTextSizes[size]} text-gray-600 font-medium`}>{label}</p>
      </div>
      <p className={`${textSizeStyles[size]} ${getTextColor()} font-bold`}>
        {value}
        <span className="text-gray-500 text-lg ml-1">{unit}</span>
      </p>
    </div>
  );
};

export default ScoreCard;
