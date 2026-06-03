import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz, useCreateQuiz, useUpdateQuiz, usePublishQuiz, useQuestions } from '@hooks/index';
import { QuizSettingsPanel } from '@components/quiz-builder/QuizSettingsPanel';
import { QuestionSelector } from '@components/quiz-builder/QuestionSelector';
import { QuizPublishPanel } from '@components/quiz-builder/QuizPublishPanel';
import { Button, Alert, Spinner, Tabs } from '@components/common';
export const QuizEditorPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const isEditing = !!quizId && quizId !== 'create';
    const { data: existingQuiz, loading: quizLoading } = useQuiz(isEditing ? quizId : null);
    const { data: allQuestions } = useQuestions({ limit: 1000 });
    const { create: createQuiz, loading: createLoading } = useCreateQuiz();
    const { update: updateQuiz, loading: updateLoading } = useUpdateQuiz();
    const { publish: publishQuiz, loading: publishLoading } = usePublishQuiz();
    const [activeTab, setActiveTab] = useState('settings');
    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: 'medium',
        duration: 30,
        totalMarks: 100,
        passingScore: 60,
        questions: [],
        settings: {
            shuffleQuestions: true,
            shuffleOptions: true,
            showResultsImmediately: false,
            negativeMarking: 0.25,
            allowReview: true,
            allowSkip: false,
            singleAttempt: false,
        },
    });
    const [error, setError] = useState(null);
    useEffect(() => {
        if (isEditing && existingQuiz) {
            setQuiz(existingQuiz);
        }
    }, [existingQuiz, isEditing]);
    const handleSave = async () => {
        try {
            setError(null);
            if (isEditing && quizId) {
                await updateQuiz(quizId, quiz);
            }
            else {
                await createQuiz(quiz);
            }
            navigate('/quizzes');
        }
        catch (err) {
            setError(err.message || 'Failed to save quiz');
        }
    };
    const handlePublish = async () => {
        if (!isEditing || !quizId)
            return;
        try {
            await publishQuiz(quizId);
            navigate('/quizzes');
        }
        catch (err) {
            setError(err.message || 'Failed to publish quiz');
        }
    };
    if (quizLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx(Spinner, { size: "lg" }) }));
    }
    const loading = createLoading || updateLoading || publishLoading;
    const tabs = [
        {
            label: 'Settings',
            value: 'settings',
            content: _jsx(QuizSettingsPanel, { quiz: quiz, onChange: setQuiz, loading: loading }),
        },
        {
            label: 'Questions',
            value: 'questions',
            content: (_jsx(QuestionSelector, { availableQuestions: allQuestions, selectedQuestions: quiz.questions || [], onSelectionChange: (questions) => setQuiz({ ...quiz, questions }), loading: loading })),
        },
        {
            label: 'Publish',
            value: 'publish',
            content: isEditing && quiz.id ? (_jsx(QuizPublishPanel, { quiz: quiz, onPublish: handlePublish, loading: loading })) : (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Save the quiz first to publish" })),
        },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: isEditing ? 'Edit Quiz' : 'Create New Quiz' }), _jsx("p", { className: "text-gray-600 mt-2", children: isEditing ? 'Update quiz details and questions' : 'Add details, questions, and settings for your new quiz' })] }), _jsx(Button, { variant: "secondary", onClick: () => navigate('/quizzes'), children: "Back to Quizzes" })] }), error && _jsx(Alert, { type: "error", title: "Error", onClose: () => setError(null), children: error }), _jsx(Tabs, { tabs: tabs, activeTab: activeTab, onChange: setActiveTab }), _jsxs("div", { className: "flex gap-2 justify-end pt-4", children: [_jsx(Button, { variant: "secondary", onClick: () => navigate('/quizzes'), disabled: loading, children: "Cancel" }), _jsx(Button, { variant: "primary", onClick: handleSave, loading: loading, children: isEditing ? 'Update Quiz' : 'Create Quiz' })] })] }));
};
