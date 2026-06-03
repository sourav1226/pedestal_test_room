import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import clsx from 'clsx';
export const Card = React.forwardRef(({ title, subtitle, action, noPadding = false, children, className, ...props }, ref) => {
    return (_jsxs("div", { ref: ref, className: clsx('bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden', className), ...props, children: [(title || subtitle || action) && (_jsxs("div", { className: "px-6 py-4 border-b border-gray-200 flex items-center justify-between", children: [_jsxs("div", { children: [title && _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: title }), subtitle && _jsx("p", { className: "text-sm text-gray-600 mt-1", children: subtitle })] }), action && _jsx("div", { children: action })] })), _jsx("div", { className: !noPadding ? 'px-6 py-4' : '', children: children })] }));
});
Card.displayName = 'Card';
export const Badge = React.forwardRef(({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
    };
    const sizes = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
    };
    return (_jsx("span", { ref: ref, className: clsx('inline-flex items-center rounded-full font-medium', variants[variant], sizes[size], className), ...props, children: children }));
});
Badge.displayName = 'Badge';
export const Alert = React.forwardRef(({ type = 'info', title, onClose, children, className, ...props }, ref) => {
    const types = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800',
    };
    const icons = {
        info: 'ℹ️',
        success: '✓',
        warning: '⚠️',
        error: '✕',
    };
    return (_jsxs("div", { ref: ref, className: clsx('rounded-lg border p-4 flex gap-3', types[type], className), ...props, children: [_jsx("div", { className: "flex-shrink-0 text-lg", children: icons[type] }), _jsxs("div", { className: "flex-1", children: [title && _jsx("h4", { className: "font-semibold mb-1", children: title }), _jsx("div", { className: "text-sm", children: children })] }), onClose && (_jsx("button", { onClick: onClose, className: "flex-shrink-0 opacity-70 hover:opacity-100", children: "\u2715" }))] }));
});
Alert.displayName = 'Alert';
export const Spinner = ({ size = 'md', className }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };
    return (_jsx("div", { className: clsx('animate-spin', sizes[size], className), children: _jsxs("svg", { className: "w-full h-full text-primary-600", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }) }));
};
export const EmptyState = ({ icon = '📭', title, description, action }) => {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: icon }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: title }), description && _jsx("p", { className: "text-gray-600 mb-6", children: description }), action && _jsx("div", { children: action })] }));
};
