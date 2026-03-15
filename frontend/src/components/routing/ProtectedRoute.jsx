import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, userRole } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role && userRole !== role) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

