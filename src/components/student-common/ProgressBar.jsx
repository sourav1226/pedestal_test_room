import React from 'react';

/**
 * ProgressBar Component - Displays progress with percentage and customizable styling
 */
const ProgressBar = ({
  percentage = 0,
  label = '',
  showPercentage = true,
  color = 'blue',
  size = 'md',
  animated = true,
}) => {
  // Clamp percentage between 0 and 100
  const validPercentage = Math.min(Math.max(percentage, 0), 100);

  // Color variants
  const colorStyles = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
  };

  // Size variants
  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  // Get dynamic color based on percentage
  const getDynamicColor = () => {
    if (validPercentage >= 80) return 'bg-green-500';
    if (validPercentage >= 60) return 'bg-blue-500';
    if (validPercentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {showPercentage && <span className="text-sm font-semibold text-gray-600">{validPercentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full ${sizeStyles[size]} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${getDynamicColor()} ${sizeStyles[size]} rounded-full transition-all ${animated ? 'duration-1000' : ''}`}
          style={{ width: `${validPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
