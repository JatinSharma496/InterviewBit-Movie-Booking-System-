import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FaPlus, FaEdit, FaTrash, FaEye, FaChair, FaUser, FaFilm, FaBuilding, FaCalendarAlt, FaTicketAlt, FaCog } from 'react-icons/fa';
import { MovieModal, CinemaModal, ScreenModal, ShowModal } from './AdminModals';
// Hardcoded API URL
const API_BASE_URL = 'http://localhost:8080';

function AdminPanel() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  // State for fetched data
  const [cinemas, setCinemas] = useState([]);
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [screens, setScreens] = useState([]);
  const [shows, setShows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [popupError, setPopupError] = useState(null);


  // Modal states
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [showEditMovieModal, setShowEditMovieModal] = useState(false);
  const [showAddCinemaModal, setShowAddCinemaModal] = useState(false);
  const [showEditCinemaModal, setShowEditCinemaModal] = useState(false);
  const [showAddScreenModal, setShowAddScreenModal] = useState(false);
  const [showEditScreenModal, setShowEditScreenModal] = useState(false);
  const [showAddShowModal, setShowAddShowModal] = useState(false);
  const [showEditShowModal, setShowEditShowModal] = useState(false);

  // Form states
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    genre: '',
    rating: 'PG-13',
    duration: '',
    release_date: '',
    poster_url: 'https://via.placeholder.com/300x450/6366f1/FFFFFF?text=New+Movie',
    is_active: true
  });

  const [newCinema, setNewCinema] = useState({
    name: '',
    location: '',
    contact_info: ''
  });

  const [newScreen, setNewScreen] = useState({
    name: '',
    capacity: 100,
    total_rows: 10,
    seats_per_row: 10,
    cinema_id: ''
  });

  const [newShow, setNewShow] = useState({
    date: '',
    time: '',
    ticketPrice: 15.0,
    isActive: true,
    movieId: '',
    screenId: '',
    cinemaId: ''
  });

  const [editingItem, setEditingItem] = useState(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cinemasRes, moviesRes, bookingsRes, usersRes, screensRes, showsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/cinemas`),
          fetch(`${API_BASE_URL}/api/movies`),
          fetch(`${API_BASE_URL}/api/bookings`),
          fetch(`${API_BASE_URL}/api/users`),
          fetch(`${API_BASE_URL}/api/screens`),
          fetch(`${API_BASE_URL}/api/shows`)
        ]);

        if (!cinemasRes.ok) throw new Error(`Failed to fetch cinemas: ${cinemasRes.status}`);
        if (!moviesRes.ok) throw new Error(`Failed to fetch movies: ${moviesRes.status}`);
        if (!bookingsRes.ok) throw new Error(`Failed to fetch bookings: ${bookingsRes.status}`);
        if (!usersRes.ok) throw new Error(`Failed to fetch users: ${usersRes.status}`);
        if (!screensRes.ok) throw new Error(`Failed to fetch screens: ${screensRes.status}`);
        if (!showsRes.ok) throw new Error(`Failed to fetch shows: ${showsRes.status}`);

        setCinemas(await cinemasRes.json());
        setMovies(await moviesRes.json());
        setBookings(await bookingsRes.json());
        setUsers(await usersRes.json());
        setScreens(await screensRes.json());
        setShows(await showsRes.json());

      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Generic handlers
  const handleAdd = async (endpoint, data, setter, resetData, successMsg) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to add ${endpoint}: ${response.status}`);
      }
      
      const addedItem = await response.json();
      setter(prev => [...prev, addedItem]);
      resetData();
      setSuccessMessage(successMsg || `${endpoint} added successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEdit = async (endpoint, id, data, setter, onSuccess) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        // For show conflicts, use popup error instead of global error
        if (endpoint === 'shows' && errorData.error && errorData.error.includes('Time conflict')) {
          setPopupError(errorData.error);
          setTimeout(() => setPopupError(null), 5000);
          return;
        }
        throw new Error(errorData.error || `Failed to update ${endpoint}: ${response.status}`);
      }
      
      const updatedItem = await response.json();
      setter(prev => prev.map(item => (item.id === updatedItem.id ? updatedItem : item)));
      if (onSuccess) onSuccess();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (endpoint, id, setter) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Failed to delete ${endpoint}: ${response.status}`);
      
      // Handle cascade deletion for different entities
      if (endpoint === 'screens') {
        // Remove related shows from state
        setShows(prev => prev.filter(show => show.screenId !== id));
        setSuccessMessage('Screen and all related shows deleted successfully!');
      } else if (endpoint === 'movies') {
        // Remove related shows from state
        setShows(prev => prev.filter(show => show.movieId !== id));
        setSuccessMessage('Movie and all related shows deleted successfully!');
      } else if (endpoint === 'cinemas') {
        // Remove related shows and screens from state (screens are linked to cinema)
        setShows(prev => prev.filter(show => show.cinemaId !== id));
        setScreens(prev => prev.filter(screen => screen.cinemaId !== id));
        setSuccessMessage('Cinema and all related shows and screens deleted successfully!');
      } else {
        setSuccessMessage(`${endpoint} deleted successfully!`);
      }
      
      // Refresh data to ensure consistency
      if (['screens', 'movies', 'cinemas'].includes(endpoint)) {
        try {
          const [showsResponse, screensResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/api/shows`),
            fetch(`${API_BASE_URL}/api/screens`)
          ]);
          
          if (showsResponse.ok) {
            const freshShows = await showsResponse.json();
            setShows(freshShows);
          }
          
          if (screensResponse.ok) {
            const freshScreens = await screensResponse.json();
            setScreens(freshScreens);
          }
        } catch (refreshError) {
          console.warn('Failed to refresh data:', refreshError);
        }
      }
      
      // Remove the main item
      setter(prev => prev.filter(item => item.id !== id));
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (e) {
      setError(e.message);
    }
  };

  // Specific handlers
  const handleAddMovie = async () => {
    await handleAdd('movies', newMovie, setMovies, () => {
      setNewMovie({
        title: '', description: '', genre: '', rating: 'PG-13', duration: '', release_date: '',
        poster_url: 'https://via.placeholder.com/300x450/6366f1/FFFFFF?text=New+Movie', is_active: true
      });
      setShowAddMovieModal(false);
    }, 'Movie added successfully!');
  };

  const handleAddCinema = async () => {
    await handleAdd('cinemas', newCinema, setCinemas, () => {
      setNewCinema({ name: '', location: '', contact_info: '' });
      setShowAddCinemaModal(false);
    }, 'Cinema added successfully!');
  };

  const handleAddScreen = async () => {
    await handleAdd('screens', newScreen, setScreens, () => {
      setNewScreen({ name: '', capacity: 100, total_rows: 10, seats_per_row: 10, cinema_id: '' });
      setShowAddScreenModal(false);
    }, 'Screen added successfully!');
  };

  const handleAddShow = async () => {
    // Check if we have movies, cinemas, and screens available
    if (!movies || movies.length === 0) {
      setError('No movies available. Please add movies first.');
      return;
    }
    if (!cinemas || cinemas.length === 0) {
      setError('No cinemas available. Please add cinemas first.');
      return;
    }
    if (!screens || screens.length === 0) {
      setError('No screens available. Please add screens first.');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/shows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShow)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        // For show conflicts, use popup error instead of global error
        if (errorData.error && errorData.error.includes('Time conflict')) {
          setPopupError(errorData.error);
          setTimeout(() => setPopupError(null), 5000);
          return;
        }
        throw new Error(errorData.error || `Failed to add show: ${response.status}`);
      }
      
      const addedItem = await response.json();
      setShows(prev => [...prev, addedItem]);
      setNewShow({ date: '', time: '', ticketPrice: 15.0, isActive: true, movieId: '', screenId: '', cinemaId: '' });
      setShowAddShowModal(false);
      setSuccessMessage('Show added successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (e) {
      setError(e.message);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-xl text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Success message component
  const SuccessMessage = () => {
    if (!successMessage) return null;
    return (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <span className="text-green-500 text-sm">✓</span>
        </div>
        <span>{successMessage}</span>
      </div>
    );
  };

  // Popup error component for non-critical errors
  const PopupError = () => {
    if (!popupError) return null;
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <span className="text-red-500 text-sm">⚠</span>
        </div>
        <span>{popupError}</span>
        <button 
          onClick={() => setPopupError(null)}
          className="ml-2 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SuccessMessage />
      <PopupError />
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your cinema system</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: FaCog },
                { id: 'cinemas', label: 'Cinemas', icon: FaBuilding },
                { id: 'movies', label: 'Movies', icon: FaFilm },
                { id: 'screens', label: 'Screens', icon: FaChair },
                { id: 'shows', label: 'Shows', icon: FaCalendarAlt },
                { id: 'bookings', label: 'Bookings', icon: FaTicketAlt },
                { id: 'users', label: 'Users', icon: FaUser }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'dashboard' && <DashboardTab cinemas={cinemas} movies={movies} bookings={bookings} shows={shows} />}
          {activeTab === 'cinemas' && <CinemasTab cinemas={cinemas} setCinemas={setCinemas} setShowAddCinemaModal={setShowAddCinemaModal} setShowEditCinemaModal={setShowEditCinemaModal} setEditingItem={setEditingItem} handleDelete={handleDelete} />}
          {activeTab === 'movies' && <MoviesTab movies={movies} setMovies={setMovies} cinemas={cinemas} setShowAddMovieModal={setShowAddMovieModal} setShowEditMovieModal={setShowEditMovieModal} setEditingItem={setEditingItem} handleDelete={handleDelete} />}
          {activeTab === 'screens' && <ScreensTab screens={screens} setScreens={setScreens} cinemas={cinemas} setShowAddScreenModal={setShowAddScreenModal} setShowEditScreenModal={setShowEditScreenModal} setEditingItem={setEditingItem} handleDelete={handleDelete} />}
          {activeTab === 'shows' && <ShowsTab shows={shows} setShows={setShows} movies={movies} screens={screens} cinemas={cinemas} setShowAddShowModal={setShowAddShowModal} setShowEditShowModal={setShowEditShowModal} setEditingItem={setEditingItem} handleDelete={handleDelete} setError={setError} />}
          {activeTab === 'bookings' && <BookingsTab bookings={bookings} users={users} />}
          {activeTab === 'users' && <UsersTab users={users} />}
        </div>
      </div>

      {/* Modals */}
      <MovieModal 
        show={showAddMovieModal || showEditMovieModal} 
        onClose={() => { setShowAddMovieModal(false); setShowEditMovieModal(false); setEditingItem(null); }}
        onSubmit={showAddMovieModal ? handleAddMovie : () => handleEdit('movies', editingItem.id, editingItem, setMovies, () => { setShowEditMovieModal(false); setEditingItem(null); })}
        data={showAddMovieModal ? newMovie : editingItem}
        setData={showAddMovieModal ? setNewMovie : setEditingItem}
        cinemas={cinemas}
        isEdit={showEditMovieModal}
      />

      <CinemaModal 
        show={showAddCinemaModal || showEditCinemaModal} 
        onClose={() => { setShowAddCinemaModal(false); setShowEditCinemaModal(false); setEditingItem(null); }}
        onSubmit={showAddCinemaModal ? handleAddCinema : () => handleEdit('cinemas', editingItem.id, editingItem, setCinemas, () => { setShowEditCinemaModal(false); setEditingItem(null); })}
        data={showAddCinemaModal ? newCinema : editingItem}
        setData={showAddCinemaModal ? setNewCinema : setEditingItem}
        isEdit={showEditCinemaModal}
      />

      <ScreenModal 
        show={showAddScreenModal || showEditScreenModal} 
        onClose={() => { setShowAddScreenModal(false); setShowEditScreenModal(false); setEditingItem(null); }}
        onSubmit={showAddScreenModal ? handleAddScreen : () => handleEdit('screens', editingItem.id, editingItem, setScreens, () => { setShowEditScreenModal(false); setEditingItem(null); })}
        data={showAddScreenModal ? newScreen : editingItem}
        setData={showAddScreenModal ? setNewScreen : setEditingItem}
        cinemas={cinemas}
        isEdit={showEditScreenModal}
      />

      <ShowModal 
        show={showAddShowModal || showEditShowModal} 
        onClose={() => { setShowAddShowModal(false); setShowEditShowModal(false); setEditingItem(null); }}
        onSubmit={showAddShowModal ? handleAddShow : () => handleEdit('shows', editingItem.id, editingItem, setShows, () => { setShowEditShowModal(false); setEditingItem(null); })}
        data={showAddShowModal ? newShow : editingItem}
        setData={showAddShowModal ? setNewShow : setEditingItem}
        movies={movies}
        screens={screens}
        cinemas={cinemas}
        shows={shows}
        isEdit={showEditShowModal}
      />
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ cinemas, movies, bookings, shows }) {
  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <FaBuilding className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Cinemas</p>
            <p className="text-2xl font-bold text-gray-900">{cinemas.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <FaFilm className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Movies</p>
            <p className="text-2xl font-bold text-gray-900">{movies.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100">
            <FaTicketAlt className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Confirmed Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{confirmedBookings}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <FaCalendarAlt className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Shows</p>
            <p className="text-2xl font-bold text-gray-900">{shows.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 col-span-1 md:col-span-2 lg:col-span-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-indigo-100">
            <FaCog className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">₹{totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cinemas Tab Component
function CinemasTab({ cinemas, setCinemas, setShowAddCinemaModal, setShowEditCinemaModal, setEditingItem, handleDelete }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Cinemas</h2>
        <button
          onClick={() => setShowAddCinemaModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Cinema</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cinemas.map(cinema => (
          <div key={cinema.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{cinema.name}</h3>
                <p className="text-gray-600">{cinema.location}</p>
                <p className="text-sm text-gray-500 mt-1">Contact: {cinema.contact_info}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => { setEditingItem(cinema); setShowEditCinemaModal(true); }}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDelete('cinemas', cinema.id, setCinemas)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Movies Tab Component
function MoviesTab({ movies, setMovies, cinemas, setShowAddMovieModal, setShowEditMovieModal, setEditingItem, handleDelete }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Movies</h2>
        <button
          onClick={() => setShowAddMovieModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Movie</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map(movie => (
          <div key={movie.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img 
              src={movie.poster_url} 
              alt={movie.title} 
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2">{movie.title}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Duration: {movie.duration} min</p>
                <p>Genre: {movie.genre}</p>
                <p>Rating: {movie.rating}</p>
                <p>Release: {movie.release_date}</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button 
                  onClick={() => { setEditingItem(movie); setShowEditMovieModal(true); }}
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center space-x-1"
                >
                  <FaEdit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDelete('movies', movie.id, setMovies)}
                  className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1"
                >
                  <FaTrash className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Screens Tab Component
function ScreensTab({ screens, setScreens, cinemas, setShowAddScreenModal, setShowEditScreenModal, setEditingItem, handleDelete }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Screens</h2>
        <button
          onClick={() => setShowAddScreenModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Screen</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screens.map(screen => (
          <div key={screen.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{screen.name}</h3>
                <p className="text-gray-600">{cinemas.find(c => c.id === screen.cinema_id)?.name}</p>
                <p className="text-sm text-gray-500 mt-1">Capacity: {screen.capacity} seats</p>
                <p className="text-sm text-gray-500">Layout: {screen.total_rows} rows × {screen.seats_per_row} seats</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => { setEditingItem(screen); setShowEditScreenModal(true); }}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDelete('screens', screen.id, setScreens)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Shows Tab Component
function ShowsTab({ shows, setShows, movies, screens, cinemas, setShowAddShowModal, setShowEditShowModal, setEditingItem, handleDelete, setError }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Shows</h2>
        <button
          onClick={() => {
            if (!movies || movies.length === 0) {
              setError('No movies available. Please add movies first.');
              return;
            }
            if (!cinemas || cinemas.length === 0) {
              setError('No cinemas available. Please add cinemas first.');
              return;
            }
            if (!screens || screens.length === 0) {
              setError('No screens available. Please add screens first.');
              return;
            }
            setShowAddShowModal(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Show</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cinema</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shows.map(show => (
                <tr key={show.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {movies.find(m => m.id === show.movie_id)?.title || 'Unknown Movie'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {cinemas.find(c => c.id === screens.find(s => s.id === show.screen_id)?.cinema_id)?.name || 'Unknown Cinema'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {screens.find(s => s.id === show.screen_id)?.name || 'Unknown Screen'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{show.date} at {show.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{show.ticket_price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      show.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {show.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => { setEditingItem(show); setShowEditShowModal(true); }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete('shows', show.id, setShows)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Bookings Tab Component
function BookingsTab({ bookings, users }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cinema</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.movie_title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.cinema_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.seats ? booking.seats.length : 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{(booking.total_amount + 2).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Users Tab Component
function UsersTab({ users }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Users</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <FaUser className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default AdminPanel;