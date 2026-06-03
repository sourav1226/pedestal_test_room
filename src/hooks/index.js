/**
 * Custom Hooks
 *
 * These hooks provide a clean interface for components to interact with services.
 * They handle loading states, error states, and caching where appropriate.
 * This abstraction makes it easy to switch between mock and real APIs.
 */
import { useState, useCallback, useEffect } from 'react';
import { quizService, questionService } from '@services/index';
// ============ Quiz Hooks ============
export const useQuizzes = (params) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await quizService.getAllQuizzes({
                page: params?.page || 1,
                limit: params?.limit || 10,
                ...params,
            });
            if (response.success && response.data) {
                setData(response.data.data);
                setTotal(response.data.total);
            }
            else {
                setError(response.error || 'Failed to fetch quizzes');
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    }, [params]);
    useEffect(() => {
        fetch();
    }, [fetch]);
    return { data, total, loading, error, refetch: fetch };
};
export const useQuiz = (quizId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!!quizId);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!quizId) {
            setLoading(false);
            setData(null);
            setError(null);
            return;
        }
        const fetchQuiz = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await quizService.getQuizById(quizId);
                if (response.success && response.data) {
                    setData(response.data);
                }
                else {
                    setError(response.error || 'Failed to fetch quiz');
                }
            }
            catch (err) {
                setError(err.message || 'An error occurred');
            }
            finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);
    return { data, loading, error };
};
export const useCreateQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const create = useCallback(async (quizData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await quizService.createQuiz(quizData);
            if (response.success && response.data) {
                return response.data;
            }
            else {
                setError(response.error || 'Failed to create quiz');
                return null;
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
            return null;
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { create, loading, error };
};
export const useUpdateQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const update = useCallback(async (quizId, quizData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await quizService.updateQuiz(quizId, quizData);
            if (response.success && response.data) {
                return response.data;
            }
            else {
                setError(response.error || 'Failed to update quiz');
                return null;
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
            return null;
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { update, loading, error };
};
export const useDeleteQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const delete_ = useCallback(async (quizId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await quizService.deleteQuiz(quizId);
            if (response.success) {
                return true;
            }
            else {
                setError(response.error || 'Failed to delete quiz');
                return false;
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
            return false;
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { delete: delete_, loading, error };
};
export const usePublishQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const publish = useCallback(async (quizId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await quizService.publishQuiz(quizId);
            if (response.success && response.data) {
                return response.data;
            }
            else {
                setError(response.error || 'Failed to publish quiz');
                return null;
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
            return null;
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { publish, loading, error };
};
// ============ Question Hooks ============
export const useQuestions = (params) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await questionService.getAllQuestions({
                page: params?.page || 1,
                limit: params?.limit || 10,
                ...params,
            });
            if (response.success && response.data) {
                setData(response.data.data);
                setTotal(response.data.total);
            }
            else {
                setError(response.error || 'Failed to fetch questions');
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    }, [params]);
    useEffect(() => {
        fetch();
    }, [fetch]);
    return { data, total, loading, error, refetch: fetch };
};
export const useQuestion = (questionId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchQuestion = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await questionService.getQuestionById(questionId);
                if (response.success && response.data) {
                    setData(response.data);
                }
                else {
                    setError(response.error || 'Failed to fetch question');
                }
            }
            catch (err) {
                setError(err.message || 'An error occurred');
            }
            finally {
                setLoading(false);
            }
        };
        if (questionId) {
            fetchQuestion();
        }
    }, [questionId]);
    return { data, loading, error };
};
export const useCreateQuestion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const create = useCallback(async (questionData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await questionService.createQuestion(questionData);
            if (response.success && response.data) {
                return response.data;
            }
            else {
                setError(response.error || 'Failed to create question');
                return null;
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
            return null;
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { create, loading, error };
};
export const useUpdateQuestion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const update = useCallback(async (questionId, questionData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await questionService.updateQuestion(questionId, questionData);
            if (response.success && response.data) {
                return response.data;
            }
            else {
                setError(response.error || 'Failed to update question');
                return null;
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
            return null;
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { update, loading, error };
};
export const useDeleteQuestion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const delete_ = useCallback(async (questionId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await questionService.deleteQuestion(questionId);
            if (response.success) {
                return true;
            }
            else {
                setError(response.error || 'Failed to delete question');
                return false;
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
            return false;
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { delete: delete_, loading, error };
};
export const useDeleteQuestions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const delete_ = useCallback(async (questionIds) => {
        setLoading(true);
        setError(null);
        try {
            const response = await questionService.deleteQuestions(questionIds);
            if (response.success && response.data) {
                return response.data.deleted;
            }
            else {
                setError(response.error || 'Failed to delete questions');
                return 0;
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
            return 0;
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { delete: delete_, loading, error };
};
export const useSearchQuestions = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const search = useCallback(async (searchTerm, filters) => {
        setLoading(true);
        setError(null);
        try {
            const response = await questionService.searchQuestions(searchTerm, filters);
            if (response.success && response.data) {
                setResults(response.data);
            }
            else {
                setError(response.error || 'Search failed');
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { results, loading, error, search };
};
