import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import clsx from 'clsx';
export const Input = React.forwardRef(({ label, error, helperText, variant = 'default', className, ...props }, ref) => {
    return (_jsxs("div", { className: "w-full", children: [label && _jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: label }), _jsx("input", { ref: ref, className: clsx('w-full px-4 py-2 rounded-lg border transition-colors duration-200', variant === 'default' && 'border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500', variant === 'outline' && 'border-gray-200 bg-white', error && 'border-red-500 focus:border-red-500 focus:ring-red-500', 'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500', className), ...props }), error && _jsx("p", { className: "mt-1 text-sm text-red-600", children: error }), helperText && !error && _jsx("p", { className: "mt-1 text-sm text-gray-500", children: helperText })] }));
});
Input.displayName = 'Input';
export const Textarea = React.forwardRef(({ label, error, helperText, className, ...props }, ref) => {
    return (_jsxs("div", { className: "w-full", children: [label && _jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: label }), _jsx("textarea", { ref: ref, className: clsx('w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors duration-200', error && 'border-red-500', 'disabled:bg-gray-100 disabled:cursor-not-allowed', className), ...props }), error && _jsx("p", { className: "mt-1 text-sm text-red-600", children: error }), helperText && !error && _jsx("p", { className: "mt-1 text-sm text-gray-500", children: helperText })] }));
});
Textarea.displayName = 'Textarea';
export const Select = React.forwardRef(({ label, error, helperText, options = [], className, ...props }, ref) => {
    return (_jsxs("div", { className: "w-full", children: [label && _jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: label }), _jsx("select", { ref: ref, className: clsx('w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors duration-200', error && 'border-red-500', 'disabled:bg-gray-100 disabled:cursor-not-allowed', className), ...props, children: options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) }), error && _jsx("p", { className: "mt-1 text-sm text-red-600", children: error }), helperText && !error && _jsx("p", { className: "mt-1 text-sm text-gray-500", children: helperText })] }));
});
Select.displayName = 'Select';
export const Checkbox = React.forwardRef(({ label, className, ...props }, ref) => {
    return (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { ref: ref, type: "checkbox", className: clsx('w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer', className), ...props }), label && _jsx("span", { className: "text-sm text-gray-700", children: label })] }));
});
Checkbox.displayName = 'Checkbox';
