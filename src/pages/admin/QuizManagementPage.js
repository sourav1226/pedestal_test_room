import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizzes, useDeleteQuiz, usePublishQuiz } from '@hooks/index';
import { Card, Button, Table, Badge, Pagination, EmptyState, Alert } from '@components/common';
import { formatDateShort, truncateText } from '@utils/index';
export const QuizManagementPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const { data: quizzes, total, loading, error, refetch } = useQuizzes({ page, limit: 10 });
    const { delete: deleteQuiz } = useDeleteQuiz();
    const { publish: publishQuiz } = usePublishQuiz();
    const handleDelete = async (quizId) => {
        if (confirm('Are you sure you want to delete this quiz?')) {
            try {
                await deleteQuiz(quizId);
                refetch();
            } catch {
                // Error handled by hook; component could read useDeleteQuiz().error
            }
        }
    };
    const handlePublish = async (quizId) => {
        try {
            await publishQuiz(quizId);
            refetch();
        } catch {
            // Error handled by hook; component could read usePublishQuiz().error
        }
    };
    const columns = [
        {
            key: 'title',
            header: 'Title',
            render: (value) => _jsx("div", { className: "font-medium", children: truncateText(value, 40) }),
        },
        {
            key: 'category',
            header: 'Category',
        },
        {
            key: 'difficulty',
            header: 'Difficulty',
            render: (value) => (_jsx(Badge, { variant: value === 'easy' ? 'success' : value === 'medium' ? 'warning' : 'danger', size: "sm", children: value })),
        },
        {
            key: 'status',
            header: 'Status',
            render: (value) => (_jsx(Badge, { variant: value === 'published' ? 'success' : 'warning', size: "sm", children: value })),
        },
        {
            key: 'updatedAt',
            header: 'Updated',
            render: (value) => formatDateShort(value),
        },
        {
            key: 'id',
            header: 'Actions',
            render: (_, row) => (_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", onClick: () => navigate(`/admin/quizzes/${row.id}/edit`), children: "Edit" }), row.status === 'draft' && (_jsx(Button, { size: "sm", variant: "success", onClick: () => handlePublish(row.id), children: "Publish" })), _jsx(Button, { size: "sm", variant: "danger", onClick: () => handleDelete(row.id), children: "Delete" })] })),
        },
    ];
    const totalPages = Math.ceil(total / 10);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Quiz Management" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Create, edit, and manage your quizzes" })] }), _jsx(Button, { variant: "primary", size: "lg", onClick: () => navigate('/admin/quizzes/create'), children: "+ Create Quiz" })] }), error && _jsx(Alert, { type: "error", title: "Error", onClose: () => { }, children: error }), quizzes.length === 0 ? (_jsx(EmptyState, { title: "No Quizzes Yet", description: "Create your first quiz to get started", action: _jsx(Button, { onClick: () => navigate('/admin/quizzes/create'), children: "Create Quiz" }) })) : (_jsxs(Card, { children: [_jsx(Table, { columns: columns, data: quizzes, loading: loading }), totalPages > 1 && (_jsx(Pagination, { page: page, totalPages: totalPages, onPageChange: setPage }))] }))] }));
};
