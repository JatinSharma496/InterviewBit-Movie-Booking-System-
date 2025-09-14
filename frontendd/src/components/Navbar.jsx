import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaHome, FaHistory, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

function Navbar() {
  const { state, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FaHome className="text-2xl" />
            <span className="text-xl font-bold">InterviewBit-Movie-Booking-System</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {state.currentUser ? (
              <>
                {!state.isAdmin && (
                  <>
                    <Link 
                      to="/" 
                      className={`flex items-center space-x-1 px-3 py-2 rounded transition-colors ${
                        location.pathname === '/' ? 'bg-blue-700' : 'hover:bg-blue-700'
                      }`}
                    >
                      <FaHome />
                      <span>Cinemas</span>
                    </Link>
                    
                    <Link 
                      to="/history" 
                      className={`flex items-center space-x-1 px-3 py-2 rounded transition-colors ${
                        location.pathname === '/history' ? 'bg-blue-700' : 'hover:bg-blue-700'
                      }`}
                    >
                      <FaHistory />
                      <span>My Bookings</span>
                    </Link>
                  </>
                )}
                
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Welcome, {state.currentUser.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded transition-colors bg-red-600 hover:bg-red-700"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/auth" 
                className={`flex items-center space-x-1 px-3 py-2 rounded transition-colors ${
                  location.pathname === '/auth' ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                <FaSignInAlt />
                <span>Login / Sign Up</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
