import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaPlay, FaClock, FaStar, FaCalendarAlt } from 'react-icons/fa';
// Hardcoded API URL
const API_BASE_URL = 'http://localhost:8080';

function MovieHome() {
  const { state } = useApp();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/movies`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">Error loading movies: {error}</div>
        <button 
          onClick={fetchMovies}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Cinema Booking
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Book your favorite movies and enjoy the best cinema experience
          </p>
          {state.currentUser && (
            <div className="text-lg">
              Welcome back, <span className="font-semibold">{state.currentUser.name}</span>!
            </div>
          )}
        </div>
      </div>

      {/* Movies Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Now Showing</h2>
          <p className="text-lg text-gray-600">Choose from our amazing collection of movies</p>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No movies available at the moment</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <div key={movie.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={movie.poster_url || 'https://via.placeholder.com/300x450/cccccc/666666?text=No+Image'}
                    alt={movie.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-semibold flex items-center">
                    <FaStar className="mr-1" />
                    {movie.rating}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {movie.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {movie.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaClock className="mr-2" />
                      {formatDuration(movie.duration)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-2" />
                      {formatDate(movie.release_date)}
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Genre:</span> {movie.genre}
                    </div>
                  </div>
                  
                  <Link
                    to={`/movie/${movie.id}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-medium"
                  >
                    <FaPlay className="mr-2" />
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-lg text-gray-600">Experience the best in cinema entertainment</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlay className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Latest Movies</h3>
              <p className="text-gray-600">Watch the newest releases and blockbuster hits</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Timing</h3>
              <p className="text-gray-600">Choose from multiple showtimes that fit your schedule</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Experience</h3>
              <p className="text-gray-600">Enjoy comfortable seating and state-of-the-art facilities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieHome;
