import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { useState } from 'react'

import Login from './pages/Login'
import StudentFlow from './pages/StudentFlow'
import ResultPage from './pages/ResultPage'
import LeaderboardPage from './pages/LeaderboardPage'
import CertificatePage from './pages/CertificatePage'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import {
  DashboardPage,
  QuizManagementPage,
  QuizEditorPage,
  QuestionManagementPage,
  QuestionBankPage,
  BatchManagementPage,
  UserManagementPage,
} from './pages/admin'

function HomePage() {
  const [selectedOption, setSelectedOption] = useState(null)

  if (selectedOption === 'student') {
    return <StudentFlow />
  }

  if (selectedOption === 'student-enhanced') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Student Dashboard</h1>
          <p className="text-gray-600 mb-8">View your results, leaderboard, and certificates</p>
          <div className="space-y-4">
            <Link
              to="/student/result"
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Results
            </Link>
            <Link
              to="/student/leaderboard"
              className="block w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View Leaderboard
            </Link>
            <Link
              to="/certificate"
              className="block w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              View Certificate
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-lg p-12 bg-white rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Quiz Portal</h1>
        <p className="text-gray-600 mb-8">Select your role to continue</p>
        <div className="space-y-4">
          <button
            onClick={() => setSelectedOption('student')}
            className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            🎓 Take a Test (Student Flow)
          </button>
          <button
            onClick={() => setSelectedOption('student-enhanced')}
            className="block w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
          >
            📊 View Results & Certificates
          </button>
          <Link
            to="/admin"
            className="block w-full px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold hover:from-gray-900 hover:to-black transition-all shadow-lg"
          >
            ⚙️ Admin Dashboard
          </Link>
          <Link
            to="/login"
            className="block w-full px-6 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            🔑 Login
          </Link>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/result" element={<ResultPage />} />
        <Route path="/student/leaderboard" element={<LeaderboardPage />} />
        <Route path="/certificate" element={<CertificatePage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <QuizManagementPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quizzes/create"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <QuizEditorPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quizzes/:quizId/edit"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <QuizEditorPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <QuestionManagementPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/question-bank"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <QuestionBankPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/batches"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <BatchManagementPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <UserManagementPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
