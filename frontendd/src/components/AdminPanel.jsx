import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FaPlus, FaEdit, FaTrash, FaEye, FaChair, FaUser } from 'react-icons/fa';

function AdminPanel() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('cinemas');

  // State for fetched data
  const [cinemas, setCinemas] = useState([]);
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [screens, setScreens] = useState([]); // To help with adding shows
  const [shows, setShows] = useState([]); // State for shows

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Add Movie Modal
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    genre: '',
    rating: 'PG-13',
    duration: '',
    release_date: '',
    poster_url: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=New+Movie',
    is_active: true,
    cinema_id: '' // To select which cinema the movie belongs to
  });

  // State for Edit Movie Modal
  const [showEditMovieModal, setShowEditMovieModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // State for Add Cinema Modal
  const [showAddCinemaModal, setShowAddCinemaModal] = useState(false);
  const [newCinema, setNewCinema] = useState({
    name: '',
    location: '',
    contact_info: ''
  });

  // State for Edit Cinema Modal
  const [showEditCinemaModal, setShowEditCinemaModal] = useState(false);
  const [editingCinema, setEditingCinema] = useState(null);

  // State for Add Show Modal
  const [showAddShowModal, setShowAddShowModal] = useState(false);
  const [newShow, setNewShow] = useState({
    date: '',
    time: '',
    ticket_price: 15.0,
    is_active: true,
    movie_id: '',
    screen_id: ''
  });

  // State for Edit Show Modal
  const [showEditShowModal, setShowEditShowModal] = useState(false);
  const [editingShow, setEditingShow] = useState(null);

  // Fetch all necessary data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cinemasRes, moviesRes, bookingsRes, usersRes, screensRes, showsRes] = await Promise.all([
          fetch('http://localhost:8080/api/cinemas'),
          fetch('http://localhost:8080/api/movies'),
          fetch('http://localhost:8080/api/bookings'),
          fetch('http://localhost:8080/api/users'),
          fetch('http://localhost:8080/api/screens'),
          fetch('http://localhost:8080/api/shows') // Fetch all shows
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

  // Handlers for adding entities
  const handleAddMovie = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie)
      });
      if (!response.ok) throw new Error(`Failed to add movie: ${response.status}`);
      const addedMovie = await response.json();
      setMovies(prev => [...prev, addedMovie]);
      setShowAddMovieModal(false);
      setNewMovie({ title: '', description: '', genre: '', rating: 'PG-13', duration: '', release_date: '', poster_url: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=New+Movie', is_active: true, cinema_id: '' });
    } catch (e) {
      setError(e.message);
    }
  };

  const handleAddCinema = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/cinemas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCinema)
      });
      if (!response.ok) throw new Error(`Failed to add cinema: ${response.status}`);
      const addedCinema = await response.json();
      setCinemas(prev => [...prev, addedCinema]);
      setShowAddCinemaModal(false);
      setNewCinema({ name: '', location: '', contact_info: '' });
    } catch (e) {
      setError(e.message);
    }
  };

  const handleAddShow = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/shows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShow)
      });
      if (!response.ok) throw new Error(`Failed to add show: ${response.status}`);
      const addedShow = await response.json();
      setShows(prev => [...prev, addedShow]); // Update shows state
      setShowAddShowModal(false);
      setNewShow({ date: '', time: '', ticket_price: 15.0, is_active: true, movie_id: '', screen_id: '' });
    } catch (e) {
      setError(e.message);
    }
  };

  // Handlers for editing and deleting movies
  const handleEditMovie = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/movies/${editingMovie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMovie)
      });
      if (!response.ok) throw new Error(`Failed to update movie: ${response.status}`);
      const updatedMovie = await response.json();
      setMovies(prev => prev.map(m => (m.id === updatedMovie.id ? updatedMovie : m)));
      setShowEditMovieModal(false);
      setEditingMovie(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      const response = await fetch(`http://localhost:8080/api/movies/${movieId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Failed to delete movie: ${response.status}`);
      setMovies(prev => prev.filter(m => m.id !== movieId));
    } catch (e) {
      setError(e.message);
    }
  };

  // Handlers for editing and deleting cinemas
  const handleEditCinema = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cinemas/${editingCinema.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCinema)
      });
      if (!response.ok) throw new Error(`Failed to update cinema: ${response.status}`);
      const updatedCinema = await response.json();
      setCinemas(prev => prev.map(c => (c.id === updatedCinema.id ? updatedCinema : c)));
      setShowEditCinemaModal(false);
      setEditingCinema(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeleteCinema = async (cinemaId) => {
    if (!window.confirm('Are you sure you want to delete this cinema?')) return;
    try {
      const response = await fetch(`http://localhost:8080/api/cinemas/${cinemaId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Failed to delete cinema: ${response.status}`);
      setCinemas(prev => prev.filter(c => c.id !== cinemaId));
    } catch (e) {
      setError(e.message);
    }
  };

  // Handlers for editing and deleting shows
  const handleEditShow = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/shows/${editingShow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingShow)
      });
      if (!response.ok) throw new Error(`Failed to update show: ${response.status}`);
      const updatedShow = await response.json();
      setShows(prev => prev.map(s => (s.id === updatedShow.id ? updatedShow : s)));
      setShowEditShowModal(false);
      setEditingShow(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeleteShow = async (showId) => {
    if (!window.confirm('Are you sure you want to delete this show?')) return;
    try {
      const response = await fetch(`http://localhost:8080/api/shows/${showId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Failed to delete show: ${response.status}`);
      setShows(prev => prev.filter(s => s.id !== showId));
    } catch (e) {
      setError(e.message);
    }
  };

  const getBookingUser = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-xl">Loading admin data...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-xl text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage cinemas, movies, and view booking analytics</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'cinemas', label: 'Cinemas & Movies' },
              { id: 'shows', label: 'Shows' }, // New tab for shows
              { id: 'bookings', label: 'Booking Analytics' },
              { id: 'seats', label: 'Seat Management' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'cinemas' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Cinemas & Movies</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddCinemaModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Cinema
              </button>
              <button
                onClick={() => setShowAddMovieModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Movie
              </button>
            </div>
          </div>

          {cinemas.map(cinema => (
            <div key={cinema.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{cinema.name}</h3>
                  <p className="text-gray-600">{cinema.location}</p>
                  <p className="text-sm text-gray-500">Contact: {cinema.contact_info}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => { setEditingCinema(cinema); setShowEditCinemaModal(true); }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteCinema(cinema.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {movies.filter(movie => movie.cinema_id === cinema.id).map(movie => (
                  <div key={movie.id} className="border border-gray-200 rounded-lg p-4">
                    <img src={movie.poster_url} alt={movie.title} className="w-full h-48 object-cover rounded mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">{movie.title}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Duration: {movie.duration} min</p>
                      <p>Genre: {movie.genre}</p>
                      <p>Rating: {movie.rating}</p>
                      <p>Release: {movie.release_date}</p>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button 
                        onClick={() => { setEditingMovie(movie); setShowEditMovieModal(true); }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <FaEdit className="inline mr-1" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteMovie(movie.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        <FaTrash className="inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Add Movie Modal */}
          {showAddMovieModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Movie</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newMovie.title}
                      onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Movie title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={newMovie.description}
                      onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Movie description"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                    <input
                      type="text"
                      name="genre"
                      value={newMovie.genre}
                      onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="e.g., Action, Drama"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select
                      name="rating"
                      value={newMovie.rating}
                      onChange={(e) => setNewMovie({...newMovie, rating: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="G">G</option>
                      <option value="PG">PG</option>
                      <option value="PG-13">PG-13</option>
                      <option value="R">R</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                    <input
                      type="number"
                      name="duration"
                      value={newMovie.duration}
                      onChange={(e) => setNewMovie({...newMovie, duration: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="e.g., 120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                    <input
                      type="date"
                      name="release_date"
                      value={newMovie.release_date}
                      onChange={(e) => setNewMovie({...newMovie, release_date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
                    <input
                      type="text"
                      name="poster_url"
                      value={newMovie.poster_url}
                      onChange={(e) => setNewMovie({...newMovie, poster_url: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cinema</label>
                    <select
                      name="cinema_id"
                      value={newMovie.cinema_id}
                      onChange={(e) => setNewMovie({...newMovie, cinema_id: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Select Cinema</option>
                      {cinemas.map(cinema => (
                        <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddMovieModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMovie}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Movie
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Movie Modal */}
          {showEditMovieModal && editingMovie && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Movie</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editingMovie.title}
                      onChange={(e) => setEditingMovie({...editingMovie, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Movie title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={editingMovie.description}
                      onChange={(e) => setEditingMovie({...editingMovie, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Movie description"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                    <input
                      type="text"
                      name="genre"
                      value={editingMovie.genre}
                      onChange={(e) => setEditingMovie({...editingMovie, genre: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="e.g., Action, Drama"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select
                      name="rating"
                      value={editingMovie.rating}
                      onChange={(e) => setEditingMovie({...editingMovie, rating: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="G">G</option>
                      <option value="PG">PG</option>
                      <option value="PG-13">PG-13</option>
                      <option value="R">R</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                    <input
                      type="number"
                      name="duration"
                      value={editingMovie.duration}
                      onChange={(e) => setEditingMovie({...editingMovie, duration: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="e.g., 120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                    <input
                      type="date"
                      name="release_date"
                      value={editingMovie.release_date}
                      onChange={(e) => setEditingMovie({...editingMovie, release_date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
                    <input
                      type="text"
                      name="poster_url"
                      value={editingMovie.poster_url}
                      onChange={(e) => setEditingMovie({...editingMovie, poster_url: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>
                  {/* Cinema ID is not editable for simplicity */}
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => { setShowEditMovieModal(false); setEditingMovie(null); }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditMovie}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Cinema Modal */}
          {showAddCinemaModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Cinema</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newCinema.name}
                      onChange={(e) => setNewCinema({...newCinema, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Cinema Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={newCinema.location}
                      onChange={(e) => setNewCinema({...newCinema, location: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="e.g., 123 Main St"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                    <input
                      type="text"
                      name="contact_info"
                      value={newCinema.contact_info}
                      onChange={(e) => setNewCinema({...newCinema, contact_info: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="e.g., +1-555-1234"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddCinemaModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCinema}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Cinema
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Cinema Modal */}
          {showEditCinemaModal && editingCinema && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Cinema</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editingCinema.name}
                      onChange={(e) => setEditingCinema({...editingCinema, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Cinema Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editingCinema.location}
                      onChange={(e) => setEditingCinema({...editingCinema, location: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="e.g., 123 Main St"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                    <input
                      type="text"
                      name="contact_info"
                      value={editingCinema.contact_info}
                      onChange={(e) => setEditingCinema({...editingCinema, contact_info: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="e.g., +1-555-1234"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => { setShowEditCinemaModal(false); setEditingCinema(null); }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditCinema}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Show Modal */}
          {showAddShowModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Show</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Movie</label>
                    <select
                      name="movie_id"
                      value={newShow.movie_id}
                      onChange={(e) => setNewShow({...newShow, movie_id: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Select Movie</option>
                      {movies.map(movie => (
                        <option key={movie.id} value={movie.id}>{movie.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Screen</label>
                    <select
                      name="screen_id"
                      value={newShow.screen_id}
                      onChange={(e) => setNewShow({...newShow, screen_id: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Select Screen</option>
                      {screens.map(screen => (
                        <option key={screen.id} value={screen.id}>{screen.name} ({cinemas.find(c => c.id === screen.cinema_id)?.name})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={newShow.date}
                      onChange={(e) => setNewShow({...newShow, date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={newShow.time}
                      onChange={(e) => setNewShow({...newShow, time: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price</label>
                    <input
                      type="number"
                      name="ticket_price"
                      value={newShow.ticket_price}
                      onChange={(e) => setNewShow({...newShow, ticket_price: parseFloat(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddShow}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Show
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Booking Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Bookings</h3>
              <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirmed Bookings</h3>
              <p className="text-3xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'CONFIRMED').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">
                ${bookings.reduce((sum, b) => sum + b.total_amount + 2, 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Booking ID</th>
                    <th className="text-left py-2">Movie</th>
                    <th className="text-left py-2">Cinema</th>
                    <th className="text-left py-2">Seats</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 10).map(booking => {
                    return (
                      <tr key={booking.id} className="border-b border-gray-100">
                        <td className="py-2 text-sm">#{booking.id}</td>
                        <td className="py-2 text-sm">{booking.movie_title}</td>
                        <td className="py-2 text-sm">{booking.cinema_name}</td>
                        <td className="py-2 text-sm">{booking.seats ? booking.seats.length : 0}</td>
                        <td className="py-2 text-sm">${(booking.total_amount + 2).toFixed(2)}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="py-2 text-sm">
                          {new Date(booking.booking_date).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'seats' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Seat Management</h2>
          
          {cinemas.map(cinema => (
            <div key={cinema.id} className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{cinema.name}</h3>
              
              {screens.filter(screen => screen.cinema_id === cinema.id).map(screen => (
                <div key={screen.id} className="mb-6 border-b pb-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">{screen.name} (Capacity: {screen.capacity})</h4>
                  
                  {/* Fetch seats for this screen */}
                  <ScreenSeatMap screenId={screen.id} users={users} bookings={bookings} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// New component to fetch and display seats for a single screen
function ScreenSeatMap({ screenId, users, bookings }) {
  const [seats, setSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [errorSeats, setErrorSeats] = useState(null);

  useEffect(() => {
    const fetchSeats = async () => {
      setLoadingSeats(true);
      try {
        const response = await fetch(`http://localhost:8080/api/seats/screen/${screenId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSeats(data);
      } catch (e) {
        setErrorSeats(e.message);
      } finally {
        setLoadingSeats(false);
      }
    };
    fetchSeats();
  }, [screenId]);

  const getSeatStatus = (seat) => {
    if (seat.status === 'BOOKED') return 'booked';
    if (seat.status === 'BLOCKED') return 'blocked';
    return 'available';
  };

  const getSeatColor = (status) => {
    switch (status) {
      case 'booked': return 'bg-red-500 text-white';
      case 'blocked': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getBookingUser = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      const user = users.find(u => u.id === booking.user_id);
      return user ? user.name : 'Unknown';
    }
    return 'Unknown';
  };

  if (loadingSeats) return <div className="text-center text-sm">Loading seats...</div>;
  if (errorSeats) return <div className="text-center text-sm text-red-500">Error loading seats: {errorSeats}</div>;

  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.seat_row]) acc[seat.seat_row] = [];
    acc[seat.seat_row].push(seat);
    return acc;
  }, {});

  return (
    <>
      <div className="bg-gray-800 text-white text-center py-2 mb-4 rounded">
        SCREEN
      </div>
      
      <div className="space-y-1">
        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
          <div key={row} className="flex justify-center space-x-1">
            <div className="w-8 text-center text-sm font-medium text-gray-600 flex items-center">
              Row {row}
            </div>
            {rowSeats.map(seat => (
              <div
                key={seat.id}
                className={`w-8 h-8 rounded text-xs font-medium flex items-center justify-center ${getSeatColor(getSeatStatus(seat))}`}
                title={seat.status === 'BOOKED' ? `Booked by: ${getBookingUser(seat.booking_id)}` : ''}
              >
                {seat.seat_number}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
          <span>Blocked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span>Booked</span>
        </div>
      </div>
    </>
  );
}

export default AdminPanel;
