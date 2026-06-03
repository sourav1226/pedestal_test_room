import React from 'react';

/**
 * Button Component - Reusable button with multiple variants
 */
const Button = ({
  label = 'Click',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon = null,
  onClick = () => {},
  className = '',
  children = null,
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-blue-600 hover:bg-blue-50',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const fullWidthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transition-colors';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${fullWidthStyle} ${disabledStyle} rounded-lg font-medium flex items-center justify-center gap-2 ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children || label}
    </button>
  );
};

export default Button;
