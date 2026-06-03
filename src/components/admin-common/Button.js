import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import clsx from 'clsx';
export const Button = React.forwardRef(({ variant = 'primary', size = 'md', loading = false, icon, fullWidth = false, className, disabled, children, ...props }, ref) => {
    const baseStyles = 'font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 justify-center';
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-400',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 disabled:bg-secondary-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
        success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400',
    };
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };
    const isDisabled = disabled || loading;
    return (_jsxs("button", { ref: ref, className: clsx(baseStyles, variants[variant], sizes[size], isDisabled && 'opacity-50 cursor-not-allowed', fullWidth && 'w-full', className), disabled: isDisabled, ...props, children: [loading && _jsx("span", { className: "animate-spin", children: "\u23F3" }), icon && !loading && icon, children] }));
});
Button.displayName = 'Button';
