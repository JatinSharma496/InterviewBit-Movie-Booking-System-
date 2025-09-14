import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function ProtectedRoute({ children }) {
  const { state } = useApp();
  
  if (!state.currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
