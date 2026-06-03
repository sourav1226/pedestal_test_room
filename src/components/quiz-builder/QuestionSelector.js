import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Table, Button, Card, Badge, Modal } from '@components/common';
export const QuestionSelector = ({ availableQuestions, selectedQuestions, onSelectionChange, loading = false, }) => {
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const filteredQuestions = availableQuestions.filter((q) => q.text.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleToggle = (question) => {
        const isSelected = selectedQuestions.some((q) => q.id === question.id);
        if (isSelected) {
            onSelectionChange(selectedQuestions.filter((q) => q.id !== question.id));
        }
        else {
            onSelectionChange([...selectedQuestions, question]);
        }
    };
    const columns = [
        {
            key: 'text',
            header: 'Question',
            render: (value) => _jsx("div", { className: "max-w-md truncate", children: value }),
        },
        {
            key: 'type',
            header: 'Type',
            render: (value) => _jsx(Badge, { size: "sm", children: value.replace('-', ' ') }),
        },
        {
            key: 'difficulty',
            header: 'Difficulty',
            render: (value) => (_jsx(Badge, { size: "sm", variant: value === 'easy' ? 'success' : value === 'medium' ? 'warning' : 'danger', children: value })),
        },
        {
            key: 'marks',
            header: 'Marks',
        },
    ];
    return (_jsx(Card, { title: `Selected Questions (${selectedQuestions.length})`, children: _jsxs("div", { className: "space-y-4", children: [selectedQuestions.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No questions selected yet" })) : (_jsx(Table, { columns: columns, data: selectedQuestions, loading: loading, rowClassName: () => 'cursor-pointer hover:bg-primary-50' })), _jsx(Button, { variant: "primary", onClick: () => setShowModal(true), disabled: loading, children: "Add Questions" }), _jsx(Modal, { isOpen: showModal, title: "Select Questions", onClose: () => setShowModal(false), size: "lg", children: _jsxs("div", { className: "space-y-4", children: [_jsx("input", { type: "text", placeholder: "Search questions...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg" }), _jsx(Table, { columns: [
                                    {
                                        key: 'id',
                                        header: '',
                                        width: '40px',
                                        render: (_, row) => (_jsx("input", { type: "checkbox", checked: selectedQuestions.some((q) => q.id === row.id), onChange: () => handleToggle(row), className: "w-4 h-4 rounded" })),
                                    },
                                    ...columns,
                                ], data: filteredQuestions, loading: loading })] }) })] }) }));
};
