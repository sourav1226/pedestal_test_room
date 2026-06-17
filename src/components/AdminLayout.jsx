import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/quizzes', label: 'Quizzes', icon: '📝' },
  { path: '/admin/questions', label: 'Questions', icon: '❓' },
  { path: '/admin/question-bank', label: 'Question Bank', icon: '📚' },
  { path: '/admin/batches', label: 'Batches', icon: '👥' },
  { path: '/admin/users', label: 'Users', icon: '👤' },
]

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 overflow-hidden flex-shrink-0`}
      >
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">📊 Quiz Admin</h2>
        </div>
        <nav className="p-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-gray-700 text-white'
                  : 'hover:bg-gray-800'
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-100"
          >
            ☰
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              👤 {user?.full_name || 'Admin User'}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout
