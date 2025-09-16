import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaArrowLeft, FaClock, FaStar, FaCalendarAlt } from 'react-icons/fa';
import API_BASE_URL from '../config/api';

function MovieList() {
  const { cinemaId } = useParams();
  const { state } = useApp();
  
  const cinema = state.cinemas.find(c => c.id === parseInt(cinemaId));

  const [moviesWithShowtimes, setMoviesWithShowtimes] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cinema) return;

    const fetchMoviesAndShowtimes = async () => {
      setLoadingMovies(true);
      try {
        // Fetch movies for the cinema
        const moviesResponse = await fetch(`${API_BASE_URL}/api/cinemas/${cinemaId}/movies`);
        if (!moviesResponse.ok) {
          throw new Error(`HTTP error! status: ${moviesResponse.status}`);
        }
        const moviesData = await moviesResponse.json();

        // For each movie, fetch its showtimes
        const moviesWithShowsPromises = moviesData.map(async (movie) => {
          const showsResponse = await fetch(`${API_BASE_URL}/api/movies/${movie.id}/shows`);
          if (!showsResponse.ok) {
            // Log error but don't block other movies
            console.error(`Failed to fetch shows for movie ${movie.id}: ${showsResponse.status}`);
            return { ...movie, shows: [] }; // Return movie with empty shows array
          }
          const showsData = await showsResponse.json();
          return { ...movie, shows: showsData };
        });

        const resolvedMoviesWithShows = await Promise.all(moviesWithShowsPromises);
        setMoviesWithShowtimes(resolvedMoviesWithShows);

      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchMoviesAndShowtimes();
  }, [cinemaId, cinema]);

  if (!cinema && !state.loading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Cinema not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">Back to Cinemas</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Cinemas
        </Link>
        {cinema && (
          <>
            <h1 className="text-3xl font-bold text-gray-800">{cinema.name}</h1>
            <p className="text-gray-600">{cinema.location}</p>
          </>
        )}
      </div>

      {loadingMovies && <div className="text-center text-xl">Loading movies and showtimes...</div>}
      {error && <div className="text-center text-xl text-red-500">Error: {error}</div>}

      {!loadingMovies && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moviesWithShowtimes.map(movie => (
              <div key={movie.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={movie.poster_url || 'https://via.placeholder.com/300x450/CCCCCC/FFFFFF?text=No+Image'}
                  alt={movie.title}
                  className="w-full h-80 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{movie.title}</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaClock className="mr-2" />
                      <span>{movie.duration} min</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Genre:</span> {movie.genre}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaStar className="mr-2 text-yellow-500" />
                      <span>Rating: {movie.rating}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Showtimes:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {movie.shows && movie.shows.length > 0 ? movie.shows.map(show => (
                        <Link
                          key={show.id}
                          to={`/booking/${cinemaId}/${movie.id}/${show.id}`}
                          className="bg-blue-100 text-blue-800 text-center py-2 px-3 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          <div className="flex items-center justify-center">
                            <FaCalendarAlt className="mr-1" />
                            {show.time} on {show.date} 
                          </div>
                        </Link>
                      )) : (
                        <p className="text-sm text-gray-500 col-span-2">No showtimes available. Check back soon!</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {moviesWithShowtimes.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No movies available</h2>
              <p className="text-gray-600">Check back later for new releases!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MovieList;
