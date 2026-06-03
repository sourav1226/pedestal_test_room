import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Input, Textarea, Select, Button, Card } from '@components/common';
import { validateQuestionText, validateMarks } from '@utils/index';
import { QUESTION_TYPES, DIFFICULTY_LEVELS, CATEGORIES } from '@constants/index';
export const QuestionForm = ({ initialData, onSubmit, loading = false, error: externalError, }) => {
    const [formData, setFormData] = useState(initialData || {
        text: '',
        type: 'multiple-choice',
        difficulty: 'medium',
        marks: 1,
        category: '',
        tags: [],
        options: [
            { id: '1', text: '', isCorrect: false },
            { id: '2', text: '', isCorrect: false },
        ],
        correctAnswer: '',
        explanation: '',
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(externalError || null);
    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error for this field
        setErrors((prev) => ({
            ...prev,
            [field]: '',
        }));
    };
    const handleOptionChange = (index, field, value) => {
        const newOptions = [...(formData.options || [])];
        newOptions[index] = {
            ...newOptions[index],
            [field]: value,
        };
        handleChange('options', newOptions);
    };
    const addOption = () => {
        const newOptions = [...(formData.options || [])];
        newOptions.push({
            id: `opt-${Date.now()}`,
            text: '',
            isCorrect: false,
        });
        handleChange('options', newOptions);
    };
    const removeOption = (index) => {
        const newOptions = (formData.options || []).filter((_, i) => i !== index);
        handleChange('options', newOptions);
    };
    const validateForm = () => {
        const newErrors = {};
        const textValidation = validateQuestionText(formData.text || '');
        if (!textValidation.valid) {
            newErrors.text = textValidation.error || '';
        }
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }
        if (formData.type === 'multiple-choice') {
            if (!formData.options || formData.options.length < 2) {
                newErrors.options = 'At least 2 options are required';
            }
            const hasEmptyOptions = formData.options?.some((opt) => !opt.text.trim());
            if (hasEmptyOptions) {
                newErrors.options = 'All options must have text';
            }
        }
        const marksValidation = validateMarks(formData.marks || 0);
        if (!marksValidation.valid) {
            newErrors.marks = marksValidation.error || '';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [error && _jsx("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg text-red-700", children: error }), _jsx(Card, { title: "Question Details", children: _jsxs("div", { className: "space-y-4", children: [_jsx(Textarea, { label: "Question Text", value: formData.text || '', onChange: (e) => handleChange('text', e.target.value), error: errors.text, placeholder: "Enter your question here...", rows: 4 }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Select, { label: "Question Type", value: formData.type || '', onChange: (e) => handleChange('type', e.target.value), options: Object.entries(QUESTION_TYPES).map(([key, value]) => ({
                                        value,
                                        label: key.replace(/_/g, ' '),
                                    })) }), _jsx(Select, { label: "Difficulty", value: formData.difficulty || '', onChange: (e) => handleChange('difficulty', e.target.value), options: Object.entries(DIFFICULTY_LEVELS).map(([, value]) => ({
                                        value,
                                        label: value.charAt(0).toUpperCase() + value.slice(1),
                                    })) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Select, { label: "Category", value: formData.category || '', onChange: (e) => handleChange('category', e.target.value), error: errors.category, options: [
                                        { value: '', label: 'Select category' },
                                        ...CATEGORIES.map((cat) => ({
                                            value: cat,
                                            label: cat,
                                        })),
                                    ] }), _jsx(Input, { label: "Marks", type: "number", value: formData.marks || '', onChange: (e) => handleChange('marks', parseInt(e.target.value) || 0), error: errors.marks, min: "1", max: "1000" })] }), _jsx(Textarea, { label: "Explanation (Optional)", value: formData.explanation || '', onChange: (e) => handleChange('explanation', e.target.value), placeholder: "Explain why this is the correct answer...", rows: 3 })] }) }), formData.type === 'multiple-choice' && (_jsx(Card, { title: "Options", action: _jsx(Button, { size: "sm", onClick: addOption, type: "button", children: "+ Add Option" }), children: _jsxs("div", { className: "space-y-4", children: [errors.options && _jsx("div", { className: "text-red-600 text-sm", children: errors.options }), formData.options?.map((option, index) => (_jsxs("div", { className: "flex gap-2 items-end", children: [_jsx(Input, { value: option.text, onChange: (e) => handleOptionChange(index, 'text', e.target.value), placeholder: `Option ${index + 1}`, className: "flex-1" }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "radio", name: "correctAnswer", checked: formData.correctAnswer === option.id, onChange: () => handleChange('correctAnswer', option.id), className: "w-4 h-4" }), _jsx("span", { className: "text-sm text-gray-600", children: "Correct" })] }), _jsx(Button, { variant: "danger", size: "sm", onClick: () => removeOption(index), type: "button", disabled: formData.options.length <= 2, children: "Remove" })] }, option.id)))] }) })), _jsxs("div", { className: "flex gap-2 justify-end pt-4", children: [_jsx(Button, { variant: "secondary", type: "button", onClick: () => window.history.back(), children: "Cancel" }), _jsx(Button, { variant: "primary", type: "submit", loading: loading, children: initialData?.id ? 'Update Question' : 'Create Question' })] })] }));
};
