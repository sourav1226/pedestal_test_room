import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function ProtectedRoute({ children }) {
  const { user, accessToken } = useAuthStore();

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role_id !== 1) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
