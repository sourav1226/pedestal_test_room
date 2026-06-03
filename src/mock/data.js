// Mock Quiz Settings
const defaultQuizSettings = {
    shuffleQuestions: true,
    shuffleOptions: true,
    showResultsImmediately: false,
    negativeMarking: 0.25,
    allowReview: true,
    allowSkip: false,
    singleAttempt: false,
};
// Mock Questions
export const mockQuestions = [
    {
        id: 'q1',
        text: 'What is the capital of France?',
        type: 'multiple-choice',
        difficulty: 'easy',
        marks: 1,
        category: 'Geography',
        tags: ['capitals', 'europe'],
        options: [
            { id: 'o1', text: 'London', isCorrect: false },
            { id: 'o2', text: 'Paris', isCorrect: true },
            { id: 'o3', text: 'Berlin', isCorrect: false },
            { id: 'o4', text: 'Madrid', isCorrect: false },
        ],
        correctAnswer: 'o2',
        explanation: 'Paris is the capital and largest city of France.',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'q2',
        text: 'Is JavaScript a programming language?',
        type: 'true-false',
        difficulty: 'easy',
        marks: 1,
        category: 'Programming',
        tags: ['javascript', 'programming'],
        options: [
            { id: 'o1', text: 'True', isCorrect: true },
            { id: 'o2', text: 'False', isCorrect: false },
        ],
        correctAnswer: 'o1',
        explanation: 'Yes, JavaScript is a high-level, interpreted programming language.',
        createdAt: '2024-01-16T10:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z',
    },
    {
        id: 'q3',
        text: 'Explain the concept of closures in JavaScript.',
        type: 'paragraph',
        difficulty: 'hard',
        marks: 5,
        category: 'Programming',
        tags: ['javascript', 'advanced', 'conceptual'],
        options: [],
        correctAnswer: '',
        explanation: 'Closures are functions that have access to the outer function scope even after it has returned.',
        createdAt: '2024-01-17T10:00:00Z',
        updatedAt: '2024-01-17T10:00:00Z',
    },
    {
        id: 'q4',
        text: 'What is the result of 2 + 2 * 3?',
        type: 'multiple-choice',
        difficulty: 'easy',
        marks: 2,
        category: 'Mathematics',
        tags: ['arithmetic', 'basic'],
        options: [
            { id: 'o1', text: '8', isCorrect: false },
            { id: 'o2', text: '12', isCorrect: false },
            { id: 'o3', text: '6', isCorrect: false },
            { id: 'o4', text: '8', isCorrect: true },
        ],
        correctAnswer: 'o4',
        explanation: 'Using order of operations (PEMDAS), 2 * 3 = 6, then 2 + 6 = 8.',
        createdAt: '2024-01-18T10:00:00Z',
        updatedAt: '2024-01-18T10:00:00Z',
    },
    {
        id: 'q5',
        text: 'What does React stand for?',
        type: 'short-answer',
        difficulty: 'easy',
        marks: 1,
        category: 'Web Development',
        tags: ['react', 'frontend'],
        options: [],
        correctAnswer: 'A JavaScript library for building user interfaces',
        explanation: 'React is a declarative JavaScript library for building user interfaces with reusable components.',
        createdAt: '2024-01-19T10:00:00Z',
        updatedAt: '2024-01-19T10:00:00Z',
    },
    {
        id: 'q6',
        text: 'What is the time complexity of binary search?',
        type: 'multiple-choice',
        difficulty: 'medium',
        marks: 2,
        category: 'Computer Science',
        tags: ['algorithms', 'data-structures'],
        options: [
            { id: 'o1', text: 'O(n)', isCorrect: false },
            { id: 'o2', text: 'O(log n)', isCorrect: true },
            { id: 'o3', text: 'O(n²)', isCorrect: false },
            { id: 'o4', text: 'O(1)', isCorrect: false },
        ],
        correctAnswer: 'o2',
        explanation: 'Binary search has a logarithmic time complexity of O(log n).',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
    },
];
// Mock Quizzes
export const mockQuizzes = [
    {
        id: 'quiz1',
        title: 'Introduction to Web Development',
        description: 'Learn the basics of HTML, CSS, and JavaScript.',
        category: 'Web Development',
        difficulty: 'easy',
        duration: 30,
        totalMarks: 100,
        passingScore: 60,
        status: 'published',
        questions: mockQuestions.slice(0, 3),
        settings: defaultQuizSettings,
        createdBy: 'admin@example.com',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
        publishedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'quiz2',
        title: 'Advanced JavaScript Concepts',
        description: 'Deep dive into closures, prototypes, and async programming.',
        category: 'Programming',
        difficulty: 'hard',
        duration: 60,
        totalMarks: 150,
        passingScore: 90,
        status: 'published',
        questions: mockQuestions.slice(3, 6),
        settings: defaultQuizSettings,
        createdBy: 'instructor@example.com',
        createdAt: '2024-01-05T10:00:00Z',
        updatedAt: '2024-01-22T14:20:00Z',
        publishedAt: '2024-01-12T10:00:00Z',
    },
    {
        id: 'quiz3',
        title: 'General Knowledge Quiz',
        description: 'Test your knowledge on various topics.',
        category: 'General Knowledge',
        difficulty: 'medium',
        duration: 45,
        totalMarks: 80,
        passingScore: 50,
        status: 'draft',
        questions: mockQuestions.slice(0, 2),
        settings: defaultQuizSettings,
        createdBy: 'admin@example.com',
        createdAt: '2024-01-22T10:00:00Z',
        updatedAt: '2024-01-23T09:30:00Z',
    },
];
// Helper to generate ID
export const generateId = (prefix = 'id') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
// Helper to get a quiz by ID
export const getQuizById = (quizId) => {
    return mockQuizzes.find((q) => q.id === quizId);
};
// Helper to get a question by ID
export const getQuestionById = (questionId) => {
    return mockQuestions.find((q) => q.id === questionId);
};
// Helper to filter questions
export const filterQuestions = (questions, filters) => {
    return questions.filter((q) => {
        if (filters.category && q.category !== filters.category)
            return false;
        if (filters.difficulty && q.difficulty !== filters.difficulty)
            return false;
        if (filters.type && q.type !== filters.type)
            return false;
        if (filters.search &&
            !q.text.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }
        return true;
    });
};
export { defaultQuizSettings };
// ============ LocalStorage Helpers ============
export const initializeMockData = () => {
    const storedQuizzes = localStorage.getItem('mockQuizzes');
    const storedQuestions = localStorage.getItem('mockQuestions');
    if (!storedQuizzes) {
        localStorage.setItem('mockQuizzes', JSON.stringify(mockQuizzes));
    }
    if (!storedQuestions) {
        localStorage.setItem('mockQuestions', JSON.stringify(mockQuestions));
    }
};
export const getMockQuizzesFromStorage = () => {
    try {
        const stored = localStorage.getItem('mockQuizzes');
        return stored ? JSON.parse(stored) : mockQuizzes;
    }
    catch {
        return mockQuizzes;
    }
};
export const getMockQuestionsFromStorage = () => {
    try {
        const stored = localStorage.getItem('mockQuestions');
        return stored ? JSON.parse(stored) : mockQuestions;
    }
    catch {
        return mockQuestions;
    }
};
export const saveMockQuizzesToStorage = (quizzes) => {
    localStorage.setItem('mockQuizzes', JSON.stringify(quizzes));
};
export const saveMockQuestionsToStorage = (questions) => {
    localStorage.setItem('mockQuestions', JSON.stringify(questions));
};
