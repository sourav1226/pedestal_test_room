import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'

import Login from './pages/Login'
import StudentFlow from './pages/StudentFlow'
import ResultPage from './pages/ResultPage'
import LeaderboardPage from './pages/LeaderboardPage'
import CertificatePage from './pages/CertificatePage'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/authStore'
import {
  DashboardPage,
  QuizManagementPage,
  QuizEditorPage,
  QuestionManagementPage,
  QuestionBankPage,
  BatchManagementPage,
  UserManagementPage,
  ResultsPage as AdminResultsPage,
  LeaderboardPage as AdminLeaderboardPage,
} from './pages/admin'

function HomePage() {
  const { user, accessToken } = useAuthStore()

  if (accessToken && user) {
    if (user.role_id === 1) {
      return <Navigate to="/admin" replace />
    }
    return <StudentFlow />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-lg p-12 bg-white rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Quiz Portal</h1>
        <p className="text-gray-600 mb-8">Select your role to continue</p>
        <div className="space-y-4">
          <Link
            to="/login"
            className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            🔑 Student Login
          </Link>
          <Link
            to="/login"
            className="block w-full px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold hover:from-gray-900 hover:to-black transition-all shadow-lg"
          >
            ⚙️ Admin Login
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
        <Route
          path="/admin/results"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminResultsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leaderboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminLeaderboardPage />
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
