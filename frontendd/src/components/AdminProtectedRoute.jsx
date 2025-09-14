import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useEffect } from 'react';

function AdminProtectedRoute({ children }) {
  const { state, dispatch } = useApp();
  
  // Check if user is logged in
  if (!state.currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  // Check if user is an admin
  if (!state.currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Automatically set admin mode for admin users
  useEffect(() => {
    if (state.currentUser?.isAdmin && !state.isAdmin) {
      dispatch({ type: 'TOGGLE_ADMIN' });
    }
  }, [state.currentUser, state.isAdmin, dispatch]);
  
  return children;
}

export default AdminProtectedRoute;
