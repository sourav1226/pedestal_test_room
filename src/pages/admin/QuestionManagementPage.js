import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuestions, useCreateQuestion, useUpdateQuestion, useDeleteQuestion, useQuizzes } from '@hooks/index';
import { QuestionForm } from '@components/question-form/QuestionForm';
import { Card, Button, Modal, Alert, EmptyState, Pagination, Select } from '@components/common';
export const QuestionManagementPage = () => {
    const [page, setPage] = useState(1);
    const { data: questions, total, refetch } = useQuestions({ page, limit: 10 });
    const { create: createQuestion, loading: createLoading } = useCreateQuestion();
    const { update: updateQuestion, loading: updateLoading } = useUpdateQuestion();
    const { delete: deleteQuestion, loading: deleteLoading } = useDeleteQuestion();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [error, setError] = useState(null);
    const { data: quizzes } = useQuizzes({ limit: 1000 });
    const [selectedQuizId, setSelectedQuizId] = useState('');
    const handleCreate = async (questionData) => {
        try {
            setError(null);
            await createQuestion({ ...questionData, quiz_id: selectedQuizId });
            setShowCreateModal(false);
            refetch();
        }
        catch (err) {
            setError(err.message || 'Failed to create question');
        }
    };
    const handleUpdate = async (questionData) => {
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
                setError(null);
                await deleteQuestion(questionId);
                refetch();
            }
            catch (err) {
                setError(err.message || 'Failed to delete question');
            }
        }
    };
    const totalPages = Math.ceil(total / 10);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Question Management" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Create and manage your question bank" })] }), _jsx("div", { className: "w-64", children: _jsx(Select, { label: "Quiz", value: selectedQuizId, onChange: (e) => setSelectedQuizId(e.target.value), options: [{ value: '', label: 'Select a quiz' }, ...(quizzes || []).map(q => ({ value: q.id, label: q.title }))] }) }), _jsx(Button, { variant: "primary", size: "lg", onClick: () => setShowCreateModal(true), children: "+ New Question" })] }), error && _jsx(Alert, { type: "error", title: "Error", onClose: () => setError(null), children: error }), questions.length === 0 ? (_jsx(EmptyState, { title: "No Questions Yet", description: "Create your first question to get started", action: _jsx(Button, { onClick: () => setShowCreateModal(true), children: "Create Question" }) })) : (_jsxs(Card, { children: [_jsx("div", { className: "space-y-4", children: questions.map((question) => (_jsx("div", { className: "p-4 border border-gray-200 rounded-lg hover:bg-gray-50", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: question.text }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsx("span", { className: "text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded", children: question.type }), _jsx("span", { className: "text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded", children: question.difficulty })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", onClick: () => setEditingQuestion(question), disabled: createLoading || updateLoading || deleteLoading, children: "Edit" }), _jsx(Button, { size: "sm", variant: "danger", onClick: () => handleDelete(question.id), disabled: createLoading || updateLoading || deleteLoading, children: "Delete" })] })] }) }, question.id))) }), totalPages > 1 && (_jsx(Pagination, { page: page, totalPages: totalPages, onPageChange: setPage }))] })), _jsx(Modal, { isOpen: showCreateModal, title: "Create New Question", onClose: () => setShowCreateModal(false), size: "lg", children: _jsx(QuestionForm, { onSubmit: handleCreate, loading: createLoading }) }), _jsx(Modal, { isOpen: !!editingQuestion, title: "Edit Question", onClose: () => setEditingQuestion(null), size: "lg", children: editingQuestion && (_jsx(QuestionForm, { initialData: editingQuestion, onSubmit: handleUpdate, loading: updateLoading })) })] }));
};
