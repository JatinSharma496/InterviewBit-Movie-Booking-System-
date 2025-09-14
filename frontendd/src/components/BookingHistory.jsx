import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaTicketAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaChair, FaTimes, FaEye } from 'react-icons/fa';

function BookingHistory() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = state.currentUser.id; // Get current user ID from context

  // Fetch bookings for the current user
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/bookings/user/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Sort bookings by bookingDate (newest first)
        const sortedData = data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
        setBookings(sortedData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const handleBookingClick = (bookingId) => {
    navigate(`/confirmation/${bookingId}`);
  };

  const handleCancelBooking = async (bookingId, event) => {
    event.stopPropagation(); // Prevent triggering the booking click
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to cancel booking ${bookingId}`);
        }

        // Update the status of the cancelled booking in the local state
        setBookings(prevBookings => 
          prevBookings.map(b => 
            b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
          )
        );
        alert('Booking cancelled successfully!');
      } catch (e) {
        setError(e.message);
        alert(`Error cancelling booking: ${e.message}`);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-xl">Loading booking history...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-xl text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
        <p className="text-gray-600">View and manage your movie bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Bookings Yet</h2>
          <p className="text-gray-600 mb-6">You haven't made any bookings yet. Start by selecting a cinema!</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Browse Cinemas
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div 
              key={booking.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-200"
              onClick={() => handleBookingClick(booking.id)}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex items-center mb-4 lg:mb-0">
                    <FaTicketAlt className="text-2xl text-blue-600 mr-3" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{booking.show?.movie?.title || booking.show?.movieTitle || 'N/A'}</h2>
                      <p className="text-gray-600">Booking #{booking.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()}
                    </span>
                    <FaEye className="text-gray-400 hover:text-blue-600 transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Show Details</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        <span>{booking.show?.date || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2" />
                        <span>{booking.show?.time || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Location</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{booking.show?.cinema_name || 'N/A'}</span>
                      </div>
                      <p className="text-xs">{booking.show?.cinema_location || 'N/A'}</p>
                      <p className="text-xs">{booking.show?.screen_name || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Seats</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      {booking.seats && booking.seats.map(seat => (
                        <div key={seat.id} className="flex items-center">
                          <FaChair className="mr-1 text-blue-600" />
                          <span>Row {seat.seat_row}, Seat {seat.seat_number}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Payment</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Total: ₹ {booking.total_amount?.toFixed(2) || '0.00'}</p>
                      <p className="text-xs">
                        Booked: {new Date(booking.booking_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {booking.status === 'CONFIRMED' && (
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => handleCancelBooking(booking.id, e)}
                      className="flex items-center text-red-600 hover:text-red-800 font-medium"
                    >
                      <FaTimes className="mr-1" />
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Book More Movies
        </Link>
      </div>
    </div>
  );
}

export default BookingHistory;