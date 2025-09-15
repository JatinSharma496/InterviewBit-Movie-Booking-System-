import { FaTimes, FaImage, FaCalendar, FaCalendarAlt, FaClock, FaChair, FaBuilding, FaFilm } from 'react-icons/fa';

// Movie Modal Component
export function MovieModal({ show, onClose, onSubmit, data, setData, cinemas, isEdit }) {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaFilm className="mr-3 text-indigo-600" />
            {isEdit ? 'Edit Movie' : 'Add New Movie'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Movie Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => setData({...data, title: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter movie title"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={data.description || ''}
                onChange={(e) => setData({...data, description: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter movie description"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <input
                type="text"
                value={data.genre || ''}
                onChange={(e) => setData({...data, genre: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Action, Drama"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select
                value={data.rating || 'PG-13'}
                onChange={(e) => setData({...data, rating: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={data.duration || ''}
                onChange={(e) => setData({...data, duration: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 120"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Release Date</label>
              <input
                type="date"
                value={data.release_date || ''}
                onChange={(e) => setData({...data, release_date: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Poster URL</label>
              <div className="flex items-center space-x-3">
                <input
                  type="url"
                  value={data.poster_url || ''}
                  onChange={(e) => setData({...data, poster_url: e.target.value})}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://example.com/poster.jpg"
                  required
                />
                <FaImage className="text-gray-400" />
              </div>
            </div>

            {/* Cinema selection removed - movies are now independent */}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <FaFilm className="w-4 h-4" />
              <span>{isEdit ? 'Update Movie' : 'Add Movie'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Cinema Modal Component
export function CinemaModal({ show, onClose, onSubmit, data, setData, isEdit }) {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaBuilding className="mr-3 text-indigo-600" />
            {isEdit ? 'Edit Cinema' : 'Add New Cinema'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cinema Name</label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => setData({...data, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter cinema name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => setData({...data, location: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter cinema location"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
            <input
              type="text"
              value={data.contact_info || ''}
              onChange={(e) => setData({...data, contact_info: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., +1-555-1234"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <FaBuilding className="w-4 h-4" />
              <span>{isEdit ? 'Update Cinema' : 'Add Cinema'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Screen Modal Component
export function ScreenModal({ show, onClose, onSubmit, data, setData, cinemas, isEdit }) {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaChair className="mr-3 text-indigo-600" />
            {isEdit ? 'Edit Screen' : 'Add New Screen'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Screen Name</label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => setData({...data, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Screen 1, IMAX, VIP"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cinema</label>
            <select
              value={data.cinema_id || ''}
              onChange={(e) => setData({...data, cinema_id: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">Select Cinema</option>
              {cinemas.map(cinema => (
                <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Capacity</label>
            <input
              type="number"
              value={data.capacity || ''}
              onChange={(e) => setData({...data, capacity: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., 100"
              min="1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Rows</label>
              <input
                type="number"
                value={data.total_rows || ''}
                onChange={(e) => setData({...data, total_rows: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 10"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seats Per Row</label>
              <input
                type="number"
                value={data.seats_per_row || ''}
                onChange={(e) => setData({...data, seats_per_row: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 10"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <FaChair className="w-4 h-4" />
              <span>{isEdit ? 'Update Screen' : 'Add Screen'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Show Modal Component
export function ShowModal({ show, onClose, onSubmit, data, setData, movies, screens, cinemas, shows: allShows, isEdit }) {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Client-side validation for date
    const selectedDate = new Date(data?.date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    if (selectedDate < tomorrow) {
      alert('❌ Error: Shows cannot be scheduled for today or in the past. Please select tomorrow or a future date.');
      return;
    }
    
    onSubmit();
  };

  // Filter screens based on selected cinema
  const filteredScreens = data?.cinema_id ? 
    screens.filter(screen => screen.cinema_id === parseInt(data.cinema_id)) : 
    screens;
    
  // Movies are now independent - show all movies regardless of cinema
  const filteredMovies = movies;

  // Get selected movie for release date validation
  const selectedMovie = filteredMovies.find(movie => movie.id === parseInt(data?.movie_id));
  
  // Get today's date in YYYY-MM-DD format (local timezone)
  const now = new Date();
  const today = now.getFullYear() + '-' + 
                String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                String(now.getDate()).padStart(2, '0');
  
  // Get tomorrow's date
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.getFullYear() + '-' + 
                      String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(tomorrow.getDate()).padStart(2, '0');
  
  const movieReleaseDate = selectedMovie?.release_date;
  
  // Set minimum date to tomorrow or movie release date, whichever is later
  let minDate = tomorrowStr;
  if (movieReleaseDate) {
    const tomorrowDate = new Date(tomorrowStr);
    const releaseDate = new Date(movieReleaseDate);
    minDate = releaseDate > tomorrowDate ? movieReleaseDate : tomorrowStr;
  }
  
  // Check if selected date is today or in the past
  const isInvalidDate = data?.date ? new Date(data.date) < new Date(tomorrowStr) : false;
  
  // Debug logging (remove in production)
  // console.log('Date validation debug:', {
  //   today,
  //   movieReleaseDate,
  //   minDate,
  //   selectedMovie: selectedMovie?.title,
  //   currentTime: now.toISOString()
  // });

  // Time conflict checking
  const checkTimeConflict = (screenId, date, time, duration, excludeShowId = null) => {
    if (!allShows || !screenId || !date || !time) return false;
    
    const selectedTime = new Date(`${date}T${time}`);
    const selectedEndTime = new Date(selectedTime.getTime() + (duration * 60000));
    
    return allShows.some(show => {
      if (excludeShowId && show.id === excludeShowId) return false;
      if (show.screenId !== screenId || show.date !== date) return false;
      
      const existingTime = new Date(`${show.date}T${show.time}`);
      const existingEndTime = new Date(existingTime.getTime() + (show.movie?.duration * 60000 || 0));
      
      // Check for time overlap
      return (selectedTime < existingEndTime && selectedEndTime > existingTime);
    });
  };

  // Get selected movie for duration and conflict checking
  const movieDuration = selectedMovie?.duration || 0;

  // Check for time conflicts
  const hasTimeConflict = checkTimeConflict(
    data?.screen_id, 
    data?.date, 
    data?.time, 
    movieDuration,
    isEdit ? data?.id : null
  );

  // Get conflicting show details
  const conflictingShow = hasTimeConflict ? allShows?.find(show => {
    if (show.screenId !== data?.screen_id || show.date !== data?.date) return false;
    const existingTime = new Date(`${show.date}T${show.time}`);
    const existingEndTime = new Date(existingTime.getTime() + (show.movie?.duration * 60000 || 0));
    const selectedTime = new Date(`${data?.date}T${data?.time}`);
    const selectedEndTime = new Date(selectedTime.getTime() + (movieDuration * 60000));
    return (selectedTime < existingEndTime && selectedEndTime > existingTime);
  }) : null;


  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaCalendarAlt className="mr-3 text-indigo-600" />
            {isEdit ? 'Edit Show' : 'Add New Show'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Loading indicator if data is not ready */}
        {(!movies || !screens) ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cinema</label>
            <select
              value={data?.cinema_id || ''}
              onChange={(e) => setData({...data, cinema_id: parseInt(e.target.value), movie_id: '', screen_id: ''})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">Select Cinema</option>
              {cinemas && cinemas.length > 0 ? cinemas.map(cinema => (
                <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
              )) : (
                <option value="" disabled>No cinemas available</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Movie</label>
            <select
              value={data?.movie_id || ''}
              onChange={(e) => setData({...data, movie_id: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">Select Movie</option>
              {filteredMovies && filteredMovies.length > 0 ? filteredMovies.map(movie => (
                <option key={movie.id} value={movie.id}>{movie.title}</option>
              )) : (
                <option value="" disabled>No movies available</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Screen</label>
            <select
              value={data?.screen_id || ''}
              onChange={(e) => setData({...data, screen_id: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              disabled={!data?.cinema_id}
            >
              <option value="">
                {!data?.cinema_id ? 'Select Cinema first' : 'Select Screen'}
              </option>
              {filteredScreens && filteredScreens.length > 0 ? filteredScreens.map(screen => (
                <option key={screen.id} value={screen.id}>
                  {screen.name} (Capacity: {screen.capacity})
                </option>
              )) : (
                <option value="" disabled>
                  {!data?.cinema_id ? 'Select a cinema first' : 'No screens available for this cinema'}
                </option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={data?.date || ''}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  const tomorrowDate = new Date(tomorrowStr);
                  const selectedDateObj = new Date(selectedDate);
                  
                  if (selectedDateObj < tomorrowDate) {
                    alert('❌ Error: Shows cannot be scheduled for today or in the past. Please select tomorrow or a future date.');
                    return;
                  }
                  
                  setData({...data, date: selectedDate});
                }}
                min={minDate}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  isInvalidDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              <div className="text-xs text-gray-500 mt-1 space-y-1">
                {selectedMovie?.release_date && (
                  <p>Movie releases on: {selectedMovie.release_date}</p>
                )}
                <p className="text-blue-600">
                  📅 Shows can only be scheduled from tomorrow onwards
                </p>
                {isInvalidDate && (
                  <p className="text-red-600 font-semibold relative z-10">
                    ⚠️ Selected date is today or in the past! Please choose tomorrow or a future date.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={data?.time || ''}
                onChange={(e) => setData({...data, time: e.target.value})}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  hasTimeConflict ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {hasTimeConflict && (
                <div className="mt-2 p-4 bg-red-50 border-2 border-red-300 rounded-lg relative z-20 shadow-md">
                  <div className="flex items-start">
                    <span className="text-red-500 text-lg mr-3 flex-shrink-0">⚠️</span>
                    <div className="text-red-800 text-sm leading-relaxed">
                      <p className="font-semibold mb-1">Time Conflict Detected!</p>
                      <p>
                        Another show "{conflictingShow?.movieTitle}" is scheduled from {conflictingShow?.time} to {new Date(new Date(`${conflictingShow?.date}T${conflictingShow?.time}`).getTime() + (conflictingShow?.movie?.duration * 60000 || 0)).toTimeString().slice(0, 5)} on this screen.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">₹</span>
              <input
                type="number"
                step="0.01"
                value={data?.ticket_price || ''}
                onChange={(e) => setData({...data, ticket_price: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="15.00"
                min="0"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hasTimeConflict}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 ${
                hasTimeConflict 
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <FaCalendarAlt className="w-4 h-4" />
              <span>{isEdit ? 'Update Show' : 'Add Show'}</span>
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
