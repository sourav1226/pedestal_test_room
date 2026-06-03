import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import clsx from 'clsx';
export const Modal = ({ isOpen, title, children, onClose, size = 'md', footer, }) => {
    if (!isOpen)
        return null;
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "fixed inset-0 bg-black/50", onClick: onClose }), _jsxs("div", { className: clsx('relative bg-white rounded-lg shadow-xl', sizes[size], 'w-full mx-4'), children: [title && (_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: title }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 text-2xl leading-none", children: "\u00D7" })] })), _jsx("div", { className: "px-6 py-4 max-h-96 overflow-y-auto", children: children }), footer && _jsx("div", { className: "px-6 py-4 border-t border-gray-200 flex gap-2 justify-end", children: footer })] })] }));
};
export const Drawer = ({ isOpen, title, children, onClose, position = 'right', size = 'md', }) => {
    if (!isOpen)
        return null;
    const sizes = {
        sm: 'w-64',
        md: 'w-96',
        lg: 'w-full max-w-2xl',
    };
    const positionClasses = position === 'left' ? 'left-0' : 'right-0';
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex", children: [_jsx("div", { className: "fixed inset-0 bg-black/50", onClick: onClose }), _jsxs("div", { className: clsx('relative bg-white shadow-lg overflow-hidden flex flex-col', sizes[size], positionClasses), children: [title && (_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: title }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 text-2xl leading-none", children: "\u00D7" })] })), _jsx("div", { className: "flex-1 overflow-y-auto px-6 py-4", children: children })] })] }));
};
export const Tabs = ({ tabs, activeTab, onChange }) => {
    return (_jsxs("div", { className: "border-b border-gray-200", children: [_jsx("div", { className: "flex gap-0", children: tabs.map((tab) => (_jsx("button", { onClick: () => onChange(tab.value), className: clsx('px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200', activeTab === tab.value
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'), children: tab.label }, tab.value))) }), _jsx("div", { children: tabs.map((tab) => (_jsx("div", { hidden: activeTab !== tab.value, className: "py-4", children: tab.content }, tab.value))) })] }));
};
export const Accordion = ({ items, defaultOpen }) => {
    const [openId, setOpenId] = React.useState(defaultOpen);
    return (_jsx("div", { className: "space-y-2", children: items.map((item) => (_jsxs("div", { className: "border border-gray-200 rounded-lg overflow-hidden", children: [_jsxs("button", { onClick: () => setOpenId(openId === item.id ? undefined : item.id), className: "w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 font-medium text-gray-900", children: [item.title, _jsx("span", { className: clsx('transition-transform', openId === item.id && 'rotate-180'), children: "\u25BC" })] }), openId === item.id && _jsx("div", { className: "px-4 py-3 border-t border-gray-200 bg-gray-50", children: item.content })] }, item.id))) }));
};
