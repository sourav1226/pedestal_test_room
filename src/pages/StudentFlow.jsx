import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizService } from '../services/quizService'
import { useAuthStore } from '../store/authStore'
import TestInstruction from './TestInstruction'
import QuestionAttempt from './QuestionAttempt'
import TestResult from './TestResult'
import Leaderboard from './Leaderboard'

function QuizList({ onSelectQuiz }) {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const result = await quizService.getAllQuizzes({ status: 'active, published' })
        if (result.success) {
          setQuizzes(result.data.data)
        } else {
          setError('Failed to load quizzes')
        }
      } catch (err) {
        setError('Failed to load quizzes')
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Available Quizzes</h1>
            <p className="text-gray-600 mt-1">Welcome, {user?.full_name || 'Student'}! Select a quiz to start.</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Switch Account
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-800">{quiz.title}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {quiz.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 flex-1">
                {quiz.description || 'No description available'}
              </p>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <span>📝</span> {quiz.questions} Questions
                  </span>
                  <span className="flex items-center gap-1">
                    <span>⏱️</span> {quiz.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <span>🏆</span> {quiz.totalMarks} marks
                  </span>
                </div>
                <button
                  onClick={() => onSelectQuiz(quiz)}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-600 text-lg">No quizzes available right now.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StudentFlow() {
  const [currentScreen, setCurrentScreen] = useState('list')
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [attemptData, setAttemptData] = useState(null)
  const [resultData, setResultData] = useState(null)

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz)
    setCurrentScreen('instruction')
  }

  const handleStartTest = (attempt) => {
    setAttemptData(attempt)
    setCurrentScreen('question')
  }

  const handleSubmitTest = (result) => {
    setResultData(result)
    setCurrentScreen('result')
  }

  const handleViewLeaderboard = () => {
    setCurrentScreen('leaderboard')
  }

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null)
    setAttemptData(null)
    setResultData(null)
    setCurrentScreen('list')
  }

  switch (currentScreen) {
    case 'list':
      return <QuizList onSelectQuiz={handleSelectQuiz} />
    case 'instruction':
      return (
        <TestInstruction
          quiz={selectedQuiz}
          onStartTest={handleStartTest}
          onBack={handleBackToQuizzes}
        />
      )
    case 'question':
      return (
        <QuestionAttempt
          quiz={selectedQuiz}
          attempt={attemptData}
          onSubmit={handleSubmitTest}
        />
      )
    case 'result':
      return (
        <TestResult
          quiz={selectedQuiz}
          result={resultData}
          onViewLeaderboard={handleViewLeaderboard}
          onBackToQuizzes={handleBackToQuizzes}
        />
      )
    case 'leaderboard':
      return (
        <Leaderboard
          quiz={selectedQuiz}
          onBack={handleBackToQuizzes}
        />
      )
    default:
      return <QuizList onSelectQuiz={handleSelectQuiz} />
  }
}

export default StudentFlow
