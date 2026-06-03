import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import clsx from 'clsx';
import { ChevronUp, ChevronDown } from 'lucide-react';
export const Table = React.forwardRef(({ columns, data, loading = false, sortBy, sortOrder = 'asc', onSort, rowClassName, }, ref) => {
    return (_jsx("div", { ref: ref, className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b border-gray-200 bg-gray-50", children: columns.map((col) => (_jsx("th", { className: clsx('px-4 py-3 text-left text-sm font-semibold text-gray-700', col.width), children: _jsxs("div", { className: "flex items-center gap-2", children: [col.header, col.sortable && onSort && (_jsx("button", { onClick: () => onSort(String(col.key)), className: "text-gray-500 hover:text-gray-700", children: sortBy === String(col.key) ? (sortOrder === 'asc' ? (_jsx(ChevronUp, { size: 16 })) : (_jsx(ChevronDown, { size: 16 }))) : (_jsx(ChevronUp, { size: 16, className: "opacity-30" })) }))] }) }, String(col.key)))) }) }), _jsx("tbody", { children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, className: "px-4 py-8 text-center", children: _jsx("span", { children: "Loading..." }) }) })) : data.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, className: "px-4 py-8 text-center text-gray-500", children: "No data available" }) })) : (data.map((row, idx) => (_jsx("tr", { className: clsx('border-b border-gray-200 hover:bg-gray-50 transition-colors', rowClassName?.(row)), children: columns.map((col) => (_jsx("td", { className: "px-4 py-3 text-sm text-gray-900", children: col.render ? col.render(row[col.key], row) : String(row[col.key]) }, String(col.key)))) }, idx)))) })] }) }));
});
Table.displayName = 'Table';
export const Pagination = ({ page, totalPages, onPageChange, disabled = false, maxButtons = 5, }) => {
    const getPageNumbers = () => {
        const pages = [];
        const half = Math.floor(maxButtons / 2);
        let start = Math.max(1, page - half);
        let end = Math.min(totalPages, start + maxButtons - 1);
        if (end - start + 1 < maxButtons) {
            start = Math.max(1, end - maxButtons + 1);
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };
    return (_jsxs("div", { className: "flex items-center justify-center gap-2 mt-4", children: [_jsx("button", { onClick: () => onPageChange(page - 1), disabled: disabled || page === 1, className: "px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "\u2190 Prev" }), getPageNumbers().map((p) => (_jsx("button", { onClick: () => onPageChange(p), disabled: disabled, className: clsx('px-3 py-1 rounded border', p === page
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-gray-300 hover:bg-gray-50', 'disabled:opacity-50 disabled:cursor-not-allowed'), children: p }, p))), _jsx("button", { onClick: () => onPageChange(page + 1), disabled: disabled || page === totalPages, className: "px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Next \u2192" })] }));
};
