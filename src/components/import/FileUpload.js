import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Button } from '@components/common';
export const FileUpload = ({ accept, onFileSelect, loading = false, error, hint, }) => {
    const fileInputRef = React.useRef(null);
    const [dragActive, setDragActive] = React.useState(false);
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        }
        else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };
    const handleChange = (e) => {
        if (e.target.files?.[0]) {
            onFileSelect(e.target.files[0]);
        }
    };
    return (_jsxs("div", { className: "w-full", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: accept, onChange: handleChange, className: "hidden", disabled: loading }), _jsxs("div", { onDragEnter: handleDrag, onDragLeave: handleDrag, onDragOver: handleDrag, onDrop: handleDrop, className: `border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-primary-600 bg-primary-50' : 'border-gray-300'} ${error ? 'border-red-400 bg-red-50' : ''}`, children: [_jsx("div", { className: "text-3xl mb-2", children: "\uD83D\uDCC1" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-1", children: "Drop your file here" }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: "or click to browse" }), _jsx(Button, { type: "button", variant: "primary", size: "sm", onClick: () => fileInputRef.current?.click(), loading: loading, disabled: loading, children: "Choose File" }), hint && _jsx("p", { className: "text-xs text-gray-500 mt-3", children: hint }), error && _jsx("p", { className: "text-xs text-red-600 mt-3", children: error })] })] }));
};
