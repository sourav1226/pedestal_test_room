import React from 'react';

/**
 * Card Component - Reusable card container for content
 */
const Card = ({
  children = null,
  title = '',
  subtitle = '',
  footer = null,
  clickable = false,
  variant = 'default',
  shadow = 'md',
  className = '',
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-white border border-gray-200',
    primary: 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200',
    success: 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200',
    warning: 'bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200',
  };

  // Shadow styles
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl',
  };

  const interactiveClass = clickable ? 'cursor-pointer transition-all hover:scale-105' : '';

  return (
    <div
      className={`${variantStyles[variant]} ${shadowStyles[shadow]} ${interactiveClass} rounded-xl p-6 ${className}`}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="mb-4">{children}</div>

      {footer && (
        <div className="pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
