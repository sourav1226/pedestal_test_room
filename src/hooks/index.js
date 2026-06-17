/**
 * Custom Hooks
 *
 * These hooks provide a clean interface for components to interact with services.
 * They handle loading states, error states, and caching where appropriate.
 * This abstraction makes it easy to switch between mock and real APIs.
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { quizService, questionService, batchService, userService, courseService } from '@services/index';
// ============ Quiz Hooks ============
export const useQuizzes = (params) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const paramsRef = useRef(params);
    paramsRef.current = params;
    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const p = paramsRef.current || {};
            const response = await quizService.getAllQuizzes({
                page: p.page || 1,
                limit: p.limit || 10,
                ...p,
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
    }, []);
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
            throw new Error(response.error || 'Failed to create quiz');
        }
        catch (err) {
            const msg = err.message || 'An error occurred';
            setError(msg);
            throw new Error(msg);
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
            throw new Error(response.error || 'Failed to update quiz');
        }
        catch (err) {
            const msg = err.message || 'An error occurred';
            setError(msg);
            throw new Error(msg);
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
            throw new Error(response.error || 'Failed to delete quiz');
        }
        catch (err) {
            const msg = err.message || 'An error occurred';
            setError(msg);
            throw new Error(msg);
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
            throw new Error(response.error || 'Failed to publish quiz');
        }
        catch (err) {
            const msg = err.message || 'An error occurred';
            setError(msg);
            throw new Error(msg);
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
    const paramsRef = useRef(params);
    paramsRef.current = params;
    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const p = paramsRef.current || {};
            const response = await questionService.getAllQuestions({
                page: p.page || 1,
                limit: p.limit || 10,
                ...p,
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
    }, []);
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
            throw new Error(response.error || 'Failed to create question');
        }
        catch (err) {
            const msg = err.message || 'An error occurred';
            setError(msg);
            throw new Error(msg);
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
            throw new Error(response.error || 'Failed to update question');
        }
        catch (err) {
            const msg = err.message || 'An error occurred';
            setError(msg);
            throw new Error(msg);
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
            throw new Error(response.error || 'Failed to delete question');
        }
        catch (err) {
            const msg = err.message || 'An error occurred';
            setError(msg);
            throw new Error(msg);
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
            throw new Error(response.error || 'Failed to delete questions');
        }
        catch (err) {
            const msg = err.message || 'An error occurred';
            setError(msg);
            throw new Error(msg);
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

// ============ Batch Hooks ============
export const useBatches = (params) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const paramsRef = useRef(params);
    paramsRef.current = params;
    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const p = paramsRef.current || {};
            const response = await batchService.getAllBatches({
                page: p.page || 1,
                limit: p.limit || 10,
                ...p,
            });
            if (response.success && response.data) {
                setData(response.data.data);
                setTotal(response.data.total);
            }
            else {
                setError(response.error || 'Failed to fetch batches');
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetch();
    }, [fetch]);
    return { data, total, loading, error, refetch: fetch };
};
export const useBatch = (batchId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!!batchId);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!batchId) {
            setLoading(false);
            setData(null);
            setError(null);
            return;
        }
        const fetchBatch = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await batchService.getBatchById(batchId);
                if (response.success && response.data) {
                    setData(response.data);
                }
                else {
                    setError(response.error || 'Failed to fetch batch');
                }
            }
            catch (err) {
                setError(err.message || 'An error occurred');
            }
            finally {
                setLoading(false);
            }
        };
        fetchBatch();
    }, [batchId]);
    return { data, loading, error };
};
export const useCreateBatch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const create = useCallback(async (batchData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await batchService.createBatch(batchData);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.error || 'Failed to create batch');
        }
        catch (err) {
            const msg = err.message || 'An error occurred';
            setError(msg);
            throw new Error(msg);
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { create, loading, error };
};
export const useUpdateBatch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const update = useCallback(async (batchId, batchData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await batchService.updateBatch(batchId, batchData);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.error || 'Failed to update batch');
        }
        catch (err) {
            const msg = err.message || 'An error occurred';
            setError(msg);
            throw new Error(msg);
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { update, loading, error };
};
export const useDeleteBatch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const delete_ = useCallback(async (batchId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await batchService.deleteBatch(batchId);
            if (response.success) {
                return true;
            }
            throw new Error(response.error || 'Failed to delete batch');
        }
        catch (err) {
            const msg = err.message || 'An error occurred';
            setError(msg);
            throw new Error(msg);
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { delete: delete_, loading, error };
};

// ============ User Hooks ============
export const useUsers = (params) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const paramsRef = useRef(params);
    paramsRef.current = params;
    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const p = paramsRef.current || {};
            const response = await userService.getAllUsers({
                page: p.page || 1,
                limit: p.limit || 10,
                ...p,
            });
            if (response.success && response.data) {
                setData(response.data.data);
                setTotal(response.data.total);
            }
            else {
                setError(response.error || 'Failed to fetch users');
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetch();
    }, [fetch]);
    return { data, total, loading, error, refetch: fetch };
};
export const useUser = (userId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!!userId);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            setData(null);
            setError(null);
            return;
        }
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await userService.getUserById(userId);
                if (response.success && response.data) {
                    setData(response.data);
                }
                else {
                    setError(response.error || 'Failed to fetch user');
                }
            }
            catch (err) {
                setError(err.message || 'An error occurred');
            }
            finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);
    return { data, loading, error };
};
export const useUpdateUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const update = useCallback(async (userId, userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.updateUser(userId, userData);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.error || 'Failed to update user');
        }
        catch (err) {
            const msg = err.message || 'An error occurred';
            setError(msg);
            throw new Error(msg);
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { update, loading, error };
};
export const useDeleteUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const delete_ = useCallback(async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.deleteUser(userId);
            if (response.success) {
                return true;
            }
            throw new Error(response.error || 'Failed to delete user');
        }
        catch (err) {
            const msg = err.message || 'An error occurred';
            setError(msg);
            throw new Error(msg);
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { delete: delete_, loading, error };
};

// ============ Course Hooks ============
export const useCourses = (params) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const paramsRef = useRef(params);
    paramsRef.current = params;
    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const p = paramsRef.current || {};
            const response = await courseService.getAllCourses({
                page: p.page || 1,
                limit: p.limit || 1000,
                ...p,
            });
            if (response.success && response.data) {
                setData(response.data.data);
                setTotal(response.data.total);
            }
            else {
                setError(response.error || 'Failed to fetch courses');
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetch();
    }, [fetch]);
    return { data, total, loading, error, refetch: fetch };
};
