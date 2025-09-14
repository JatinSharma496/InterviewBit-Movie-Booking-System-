import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaHome, FaHistory, FaCog, FaUser } from 'react-icons/fa';

function Navbar() {
  const { state, toggleAdmin } = useApp();
  const location = useLocation();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FaHome className="text-2xl" />
            <span className="text-xl font-bold">CinemaBook</span>
          </Link>
          
          <div className="flex items-center space-x-6">
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
            
            <button
              onClick={toggleAdmin}
              className={`flex items-center space-x-1 px-3 py-2 rounded transition-colors ${
                state.isAdmin ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-blue-700'
              }`}
            >
              <FaCog />
              <span>{state.isAdmin ? 'Exit Admin' : 'Admin'}</span>
            </button>
            
            {state.isAdmin && (
              <Link 
                to="/admin" 
                className={`flex items-center space-x-1 px-3 py-2 rounded transition-colors ${
                  location.pathname === '/admin' ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                <FaUser />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
