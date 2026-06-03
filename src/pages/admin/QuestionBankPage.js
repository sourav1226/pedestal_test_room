import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuestions, useDeleteQuestion, useDeleteQuestions, useUpdateQuestion } from '@hooks/index';
import { FilterBar } from '@components/question-bank/FilterBar';
import { QuestionPreview } from '@components/question-bank/QuestionPreview';
import { QuestionForm } from '@components/question-form/QuestionForm';
import { Card, Button, Pagination, EmptyState, Alert, Modal } from '@components/common';
export const QuestionBankPage = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [error, setError] = useState(null);
    const { data: questions, total, loading, error: queryError, refetch } = useQuestions({
        page,
        limit: 10,
        search: searchTerm,
        ...filters,
    });
    const { delete: deleteQuestion, loading: deleteLoading } = useDeleteQuestion();
    const { delete: deleteQuestions, loading: deleteQuestionsLoading } = useDeleteQuestions();
    const { update: updateQuestion, loading: updateLoading } = useUpdateQuestion();
    const handleEdit = (question) => {
        setEditingQuestion(question);
    };
    const handleSaveEdit = async (questionData) => {
        if (!editingQuestion?.id)
            return;
        try {
            setError(null);
            await updateQuestion(editingQuestion.id, questionData);
            setEditingQuestion(null);
            refetch();
        }
        catch (err) {
            setError(err.message || 'Failed to update question');
        }
    };
    const handleDelete = async (questionId) => {
        if (confirm('Are you sure you want to delete this question?')) {
            try {
                await deleteQuestion(questionId);
                refetch();
            }
            catch (err) {
                setError(err.message || 'Failed to delete question');
            }
        }
    };
    const handleBulkDelete = async () => {
        if (confirm(`Delete ${selectedQuestions.length} questions?`)) {
            try {
                await deleteQuestions(selectedQuestions);
                setSelectedQuestions([]);
                refetch();
            }
            catch (err) {
                setError(err.message || 'Failed to delete questions');
            }
        }
    };
    const totalPages = Math.ceil(total / 10);
    const allSelected = selectedQuestions.length === questions.length && questions.length > 0;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Question Bank" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Browse, filter, and manage all questions" })] }), selectedQuestions.length > 0 && (_jsxs(Button, { variant: "danger", onClick: handleBulkDelete, loading: deleteQuestionsLoading, children: ["Delete ", selectedQuestions.length, " Selected"] }))] }), error && _jsx(Alert, { type: "error", title: "Error", onClose: () => setError(null), children: error }), queryError && _jsx(Alert, { type: "error", title: "Error", onClose: () => { }, children: queryError }), _jsx(FilterBar, { onSearch: setSearchTerm, onFilterChange: setFilters, loading: loading }), questions.length === 0 ? (_jsx(EmptyState, { title: "No Questions Found", description: "Try adjusting your filters or search terms" })) : (_jsxs(_Fragment, { children: [_jsxs(Card, { children: [_jsxs("div", { className: "mb-4 flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: allSelected, onChange: (e) => {
                                            if (e.target.checked) {
                                                setSelectedQuestions(questions.map((q) => q.id));
                                            }
                                            else {
                                                setSelectedQuestions([]);
                                            }
                                        }, className: "w-4 h-4 rounded" }), _jsx("span", { className: "text-sm text-gray-600", children: selectedQuestions.length > 0
                                            ? `${selectedQuestions.length} selected`
                                            : `Showing ${questions.length} of ${total} questions` })] }), _jsx("div", { className: "space-y-3", children: questions.map((question) => (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("input", { type: "checkbox", checked: selectedQuestions.includes(question.id), onChange: (e) => {
                                                if (e.target.checked) {
                                                    setSelectedQuestions([...selectedQuestions, question.id]);
                                                }
                                                else {
                                                    setSelectedQuestions(selectedQuestions.filter((id) => id !== question.id));
                                                }
                                            }, className: "w-4 h-4 rounded mt-1" }), _jsx("div", { className: "flex-1", children: _jsx(QuestionPreview, { question: question, onEdit: handleEdit, onDelete: handleDelete, selectable: false }) })] }, question.id))) })] }), totalPages > 1 && (_jsx(Pagination, { page: page, totalPages: totalPages, onPageChange: setPage }))] })), _jsx(Modal, { isOpen: !!editingQuestion, onClose: () => setEditingQuestion(null), title: "Edit Question", size: "lg", children: editingQuestion && (_jsx(QuestionForm, { initialQuestion: editingQuestion, onSubmit: handleSaveEdit, loading: updateLoading, onCancel: () => setEditingQuestion(null) })) })] }));
};
