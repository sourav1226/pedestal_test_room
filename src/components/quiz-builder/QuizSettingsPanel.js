import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Input, Select, Checkbox } from '@components/common';
import { DIFFICULTY_LEVELS, CATEGORIES } from '@constants/index';
export const QuizSettingsPanel = ({ quiz, onChange, loading = false }) => {
    const handleChange = (field, value) => {
        onChange({
            ...quiz,
            [field]: value,
        });
    };
    const handleSettingsChange = (field, value) => {
        onChange({
            ...quiz,
            settings: {
                ...quiz.settings,
                [field]: value,
            },
        });
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { title: "Basic Information", children: _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "Quiz Title", value: quiz.title || '', onChange: (e) => handleChange('title', e.target.value), placeholder: "Enter quiz title...", disabled: loading }), _jsx("textarea", { className: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500", placeholder: "Enter quiz description...", value: quiz.description || '', onChange: (e) => handleChange('description', e.target.value), rows: 3, disabled: loading }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Select, { label: "Category", value: quiz.category || '', onChange: (e) => handleChange('category', e.target.value), disabled: loading, options: [
                                        { value: '', label: 'Select category' },
                                        ...CATEGORIES.map((cat) => ({
                                            value: cat,
                                            label: cat,
                                        })),
                                    ] }), _jsx(Select, { label: "Difficulty", value: quiz.difficulty || '', onChange: (e) => handleChange('difficulty', e.target.value), disabled: loading, options: Object.entries(DIFFICULTY_LEVELS).map(([, value]) => ({
                                        value,
                                        label: value.charAt(0).toUpperCase() + value.slice(1),
                                    })) })] })] }) }), _jsx(Card, { title: "Quiz Configuration", children: _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsx(Input, { label: "Duration (minutes)", type: "number", value: quiz.duration || '', onChange: (e) => handleChange('duration', parseInt(e.target.value) || 0), min: "1", max: "480", disabled: loading }), _jsx(Input, { label: "Total Marks", type: "number", value: quiz.totalMarks || '', onChange: (e) => handleChange('totalMarks', parseInt(e.target.value) || 0), min: "1", disabled: loading }), _jsx(Input, { label: "Passing Score", type: "number", value: quiz.passingScore || '', onChange: (e) => handleChange('passingScore', parseInt(e.target.value) || 0), min: "1", disabled: loading })] }) }) }), _jsx(Card, { title: "Quiz Settings", children: _jsxs("div", { className: "space-y-4", children: [_jsx(Checkbox, { label: "Shuffle Questions", checked: quiz.settings?.shuffleQuestions || false, onChange: (e) => handleSettingsChange('shuffleQuestions', e.target.checked), disabled: loading }), _jsx(Checkbox, { label: "Shuffle Options", checked: quiz.settings?.shuffleOptions || false, onChange: (e) => handleSettingsChange('shuffleOptions', e.target.checked), disabled: loading }), _jsx(Checkbox, { label: "Show Results Immediately", checked: quiz.settings?.showResultsImmediately || false, onChange: (e) => handleSettingsChange('showResultsImmediately', e.target.checked), disabled: loading }), _jsx(Checkbox, { label: "Allow Review", checked: quiz.settings?.allowReview || false, onChange: (e) => handleSettingsChange('allowReview', e.target.checked), disabled: loading }), _jsx(Checkbox, { label: "Allow Skip", checked: quiz.settings?.allowSkip || false, onChange: (e) => handleSettingsChange('allowSkip', e.target.checked), disabled: loading }), _jsx(Checkbox, { label: "Single Attempt Only", checked: quiz.settings?.singleAttempt || false, onChange: (e) => handleSettingsChange('singleAttempt', e.target.checked), disabled: loading }), _jsxs("div", { className: "pt-2", children: [_jsx("label", { className: "text-sm font-medium text-gray-700 block mb-2", children: "Negative Marking (per wrong answer)" }), _jsx(Input, { type: "number", value: quiz.settings?.negativeMarking || 0, onChange: (e) => handleSettingsChange('negativeMarking', parseFloat(e.target.value) || 0), step: "0.1", min: "0", max: "1", disabled: loading })] })] }) })] }));
};
