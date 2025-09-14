import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaClock, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaStar, FaArrowLeft } from 'react-icons/fa';

function MovieDetail() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      
      // Hardcoded API URL
      const API_BASE_URL = 'http://localhost:8080';
      
      // Fetch movie details
      const movieResponse = await fetch(`${API_BASE_URL}/api/movies/${movieId}`);
      if (!movieResponse.ok) throw new Error('Movie not found');
      const movieData = await movieResponse.json();
      setMovie(movieData);

      // Movies no longer have direct cinema relationship
      // Cinema info will be available through shows

      // Fetch shows for this movie
      const showsResponse = await fetch(`${API_BASE_URL}/api/shows/movie/${movieId}`);
      if (!showsResponse.ok) throw new Error('Failed to fetch shows');
      const showsData = await showsResponse.json();
      setShows(showsData);

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

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // No longer needed since we only have one cinema

  const groupShowsByCinema = (shows) => {
    const grouped = {};
    shows.forEach(show => {
      const cinemaName = show.cinema_name || 'Unknown Cinema';
      if (!grouped[cinemaName]) {
        grouped[cinemaName] = [];
      }
      grouped[cinemaName].push(show);
    });
    return grouped;
  };

  const groupShowsByDate = (shows) => {
    const grouped = {};
    shows.forEach(show => {
      const date = show.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(show);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">Error: {error || 'Movie not found'}</div>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Movies
          </Link>
        </div>
      </div>

      {/* Movie Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={movie.poster_url || 'https://via.placeholder.com/300x450/cccccc/666666?text=No+Image'}
                alt={movie.title}
                className="w-full h-96 md:h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{movie.title}</h1>
                <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-lg font-semibold flex items-center">
                  <FaStar className="mr-1" />
                  {movie.rating}
                </div>
              </div>
              
              <p className="text-gray-600 text-lg mb-6">{movie.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <FaClock className="mr-3 text-blue-600" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-2">{formatDuration(movie.duration)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaCalendarAlt className="mr-3 text-blue-600" />
                  <span className="font-medium">Release Date:</span>
                  <span className="ml-2">{formatDate(movie.release_date)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium">Genre:</span>
                  <span className="ml-2">{movie.genre}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    movie.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {movie.is_active ? 'Now Showing' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Showtimes Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Theater & Showtime</h2>
          
          {shows.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No shows available for this movie
            </div>
          ) : (
            <div className="space-y-6">
              {/* Group shows by cinema */}
              {Object.entries(groupShowsByCinema(shows)).map(([cinemaName, cinemaShows]) => (
                <div key={cinemaName} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{cinemaName}</h3>
                        <div className="flex items-center text-gray-600 mt-2">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{cinemaShows[0].cinema_location || 'Location not available'}</span>
      
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <FaPhone className="mr-2" />
                          <span>{cinemaShows[0].cinema_contact_info || 'Contact not available'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                
                  <div className="p-6">
                    <div className="space-y-4">
                      {Object.entries(groupShowsByDate(cinemaShows)).map(([date, dateShows]) => (
                        <div key={date}>
                          <h4 className="text-lg font-medium text-gray-900 mb-3">
                            {formatDate(date)}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {dateShows.map((show) => (
                              <Link
                                key={show.id}
                                to={`/booking/${show.cinema_id}/${movieId}/${show.id}`}
                                className="bg-blue-600 text-white py-3 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors duration-200 font-medium"
                              >
                                <div className="text-sm">{formatTime(show.time)}</div>
                                <div className="text-xs opacity-90">₹{show.ticket_price}</div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
