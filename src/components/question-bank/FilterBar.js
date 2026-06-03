import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Input, Select } from '@components/common';
import { DIFFICULTY_LEVELS, QUESTION_TYPES, CATEGORIES } from '@constants/index';
export const FilterBar = ({ onSearch, onFilterChange, loading = false }) => {
    const [search, setSearch] = React.useState('');
    const [filters, setFilters] = React.useState({});
    const handleSearchChange = (term) => {
        setSearch(term);
        onSearch(term);
    };
    const handleFilterChange = (field, value) => {
        const newFilters = {
            ...filters,
            [field]: value || undefined,
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };
    const handleReset = () => {
        setSearch('');
        setFilters({});
        onSearch('');
        onFilterChange({});
    };
    return (_jsxs("div", { className: "bg-white p-4 rounded-lg border border-gray-200 space-y-4", children: [_jsx(Input, { placeholder: "Search by question text...", value: search, onChange: (e) => handleSearchChange(e.target.value) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Select, { label: "Category", value: filters.category || '', onChange: (e) => handleFilterChange('category', e.target.value), options: [
                            { value: '', label: 'All Categories' },
                            ...CATEGORIES.map((cat) => ({
                                value: cat,
                                label: cat,
                            })),
                        ] }), _jsx(Select, { label: "Difficulty", value: filters.difficulty || '', onChange: (e) => handleFilterChange('difficulty', e.target.value), options: [
                            { value: '', label: 'All Difficulties' },
                            ...Object.entries(DIFFICULTY_LEVELS).map(([, value]) => ({
                                value,
                                label: value.charAt(0).toUpperCase() + value.slice(1),
                            })),
                        ] }), _jsx(Select, { label: "Question Type", value: filters.type || '', onChange: (e) => handleFilterChange('type', e.target.value), options: [
                            { value: '', label: 'All Types' },
                            ...Object.entries(QUESTION_TYPES).map(([key, value]) => ({
                                value,
                                label: key.replace(/_/g, ' '),
                            })),
                        ] })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: handleReset, className: "text-sm text-primary-600 hover:text-primary-700 font-medium", children: "Reset Filters" }) })] }));
};
