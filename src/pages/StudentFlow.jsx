import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizService } from '../services/quizService'
import attemptService from '../services/attemptService'
import { useAuthStore } from '../store/authStore'
import TestInstruction from './TestInstruction'
import QuestionAttempt from './QuestionAttempt'
import TestResult from './TestResult'
import Leaderboard from './Leaderboard'

function QuizList({ onSelectQuiz }) {
  const [view, setView] = useState('quizzes')
  const [quizzes, setQuizzes] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        const [quizResult, attemptResult] = await Promise.all([
          quizService.getAllQuizzes({ status: 'active, published' }),
          attemptService.getMyAttempts()
        ])
        if (quizResult.success) {
          setQuizzes(quizResult.data.data)
        } else {
          setError('Failed to load quizzes')
        }
        if (attemptResult && attemptResult.attempts) {
          setAttempts(attemptResult.attempts)
        }
      } catch (err) {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = useCallback(async () => {
    await logout()
    navigate('/')
  }, [logout, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading...</p>
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1"
          >
            Log Out
          </button>
        </div>
        <p className="text-gray-600 mb-6">Welcome, {user?.full_name || 'Student'}!</p>

        <div className="flex gap-4 mb-8 border-b border-gray-300 pb-2">
          <button
            onClick={() => setView('quizzes')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              view === 'quizzes' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setView('attempts')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
              view === 'attempts' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Attempts
          </button>
        </div>

        {view === 'quizzes' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{quiz.title}</h3>
                    <div className="flex gap-1">
                      {quiz.isLive && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                          LIVE
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {quiz.category}
                      </span>
                    </div>
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
                    {quiz.startTime && !quiz.isLive && (
                      <div className="text-xs text-gray-500 mb-2 text-center">
                        Starts: {new Date(quiz.startTime).toLocaleDateString()} {new Date(quiz.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    )}
                    <button
                      onClick={() => onSelectQuiz(quiz)}
                      disabled={!quiz.isLive}
                      className={`w-full py-2 rounded-lg font-semibold transition-all ${
                        quiz.isLive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {quiz.isLive ? 'Start Quiz' : 'Coming Soon'}
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
          </>
        )}

        {view === 'attempts' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {attempts.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Quiz</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Score</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Percentage</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{a.quiz_title}</td>
                      <td className="px-4 py-3 text-center">{a.total_score}/{a.total_marks}</td>
                      <td className="px-4 py-3 text-center">{parseFloat(a.percentage).toFixed(1)}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          a.status === 'completed'
                            ? parseFloat(a.percentage) >= 40 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {a.status === 'completed' ? (parseFloat(a.percentage) >= 40 ? 'Pass' : 'Fail') : a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-16">
                <p className="text-4xl mb-4">📝</p>
                <p className="text-gray-600 text-lg">No attempts yet. Take a quiz to see your scores!</p>
              </div>
            )}
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
