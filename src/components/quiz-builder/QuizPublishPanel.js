import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Badge, Button } from '@components/common';
import { formatDate, formatDuration } from '@utils/index';
export const QuizPublishPanel = ({ quiz, onPublish, onArchive, loading = false, }) => {
    const isPublished = quiz.status === 'published';
    const isArchived = quiz.status === 'archived';
    const validationErrors = [];
    if (!quiz.title?.trim())
        validationErrors.push('Quiz title is required');
    if (!quiz.category)
        validationErrors.push('Category is required');
    if (quiz.questions.length === 0)
        validationErrors.push('At least one question is required');
    if (quiz.duration <= 0)
        validationErrors.push('Duration must be greater than 0');
    if (quiz.totalMarks <= 0)
        validationErrors.push('Total marks must be greater than 0');
    if (quiz.passingScore > quiz.totalMarks)
        validationErrors.push('Passing score cannot exceed total marks');
    if (!quiz.startTime)
        validationErrors.push('Start date & time is required');
    if (!quiz.endTime)
        validationErrors.push('End date & time is required');
    if (quiz.startTime && quiz.endTime && new Date(quiz.startTime) >= new Date(quiz.endTime))
        validationErrors.push('End time must be after start time');
    const canPublish = validationErrors.length === 0 && !isPublished;
    return (_jsx(Card, { title: "Publish Status", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Current Status:" }), _jsx(Badge, { variant: isPublished ? 'success' : isArchived ? 'danger' : 'warning', children: quiz.status.toUpperCase() })] }), validationErrors.length > 0 && (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold text-yellow-900 mb-2", children: "\u26A0\uFE0F Cannot Publish" }), _jsx("ul", { className: "space-y-1 text-sm text-yellow-800", children: validationErrors.map((error, idx) => (_jsxs("li", { children: ["\u2022 ", error] }, idx))) })] })), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-3", children: "Quiz Summary" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Questions:" }), _jsx("span", { className: "font-medium", children: quiz.questions.length })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Duration:" }), _jsx("span", { className: "font-medium", children: formatDuration(quiz.duration) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Total Marks:" }), _jsx("span", { className: "font-medium", children: quiz.totalMarks })] }),                 _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Passing Score:" }), _jsx("span", { className: "font-medium", children: quiz.passingScore })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Start Time:" }), _jsx("span", { className: "font-medium", children: quiz.startTime ? new Date(quiz.startTime).toLocaleString() : '-' })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "End Time:" }), _jsx("span", { className: "font-medium", children: quiz.endTime ? new Date(quiz.endTime).toLocaleString() : '-' })] })] })] }), isPublished && (_jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4", children: _jsxs("p", { className: "text-sm text-green-800", children: ["\u2713 This quiz was published on", ' ', quiz.publishedAt ? formatDate(quiz.publishedAt) : 'N/A'] }) })), _jsxs("div", { className: "flex gap-2 pt-4", children: [!isPublished && !isArchived && (_jsx(Button, { variant: "success", onClick: onPublish, loading: loading, disabled: !canPublish || loading, children: "Publish Quiz" })), (isPublished || !isArchived) && onArchive && (_jsx(Button, { variant: "danger", onClick: onArchive, loading: loading, disabled: loading, children: "Archive" }))] })] }) }));
};
