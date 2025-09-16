import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaTicketAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaChair, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import API_BASE_URL from '../config/api';

function BookingConfirmation() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBooking(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <div className="text-center py-12 text-xl">Loading booking details...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-xl text-red-500">Error: {error}</div>;
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Booking not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  // Assuming booking object from backend contains all necessary details
  // like movie_title, cinema_name, screen_name, show_time, show_date, seats, total_amount
  const serviceFee = 2.00; // Hardcoded for now
  const totalPaid = booking.total_amount + serviceFee;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 text-lg">Your tickets have been successfully booked</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <FaTicketAlt className="text-2xl text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <FaUser className="mr-2" />
                  <span className="font-medium">{booking.user?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-2" />
                  <span>{booking.user?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaPhone className="mr-2" />
                  <span>{booking.user?.phone_number || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Movie Information</h3>
              <div className="space-y-2">
                <p className="text-lg font-medium">{booking.show?.movie?.title || 'N/A'}</p>
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-2" />
                  <span>{booking.show?.movie?.duration || 'N/A'} min</span>
                </div>
                <p className="text-sm text-gray-600">{booking.show?.movie?.genre || 'N/A'}</p>
                <p className="text-sm text-gray-600">Rating: {booking.show?.movie?.rating || 'N/A'}</p>
                <p className="text-sm text-gray-600">Release Date: {booking.show?.movie?.release_date || 'N/A'}</p>
                {booking.show?.movie?.description && (
                  <p className="text-sm text-gray-600 mt-2">{booking.show.movie.description}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Show Details</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2" />
                  <span>{booking.show?.date || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-2" />
                  <span>{booking.show?.time || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{booking.show?.cinema_name || 'N/A'} - {booking.show?.screen_name || 'N/A'}</span>
                </div>
                <p className="text-sm text-gray-600">Screen Capacity: {booking.show?.screen?.capacity || 'N/A'} seats</p>
                <p className="text-sm text-gray-600">Ticket Price: ₹ {booking.show?.ticket_price || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Cinema Information</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  <span className="font-medium">{booking.show?.cinema_name || 'N/A'}</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">{booking.show?.cinema_location || 'N/A'}</p>
                {booking.show?.cinemaContactInfo && (
                  <p className="text-sm text-gray-600 ml-6">Contact: {booking.show.cinema_contact_info}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Seat Information</h3>
              <div className="space-y-2">
                {booking.seats && booking.seats.map(seat => (
                  <div key={seat.id} className="flex items-center">
                    <FaChair className="mr-2 text-blue-600" />
                    <span>Row {seat.seat_row}, Seat {seat.seat_number}</span>
                  </div>
                ))}
                <p className="text-sm text-gray-600 mt-2">
                  Total seats: {booking.seats ? booking.seats.length : 0}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Seats ({booking.seats ? booking.seats.length : 0})</span>
                  <span>₹ {booking.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>₹   {serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Paid</span>
                    <span>₹ {totalPaid.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Booking Reference</h3>
              <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                #{booking.id}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Booked on {new Date(booking.booking_date).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/history"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
            >
              View All Bookings
            </Link>
            <Link
              to="/"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-center"
            >
              Book More Movies
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Important Information</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Please arrive at least 15 minutes before showtime</li>
          <li>• Bring a valid ID for verification</li>
          <li>• Seats are non-refundable but can be cancelled up to 2 hours before showtime</li>
          <li>• Contact the cinema directly for any special assistance needs</li>
        </ul>
      </div>
    </div>
  );
}

export default BookingConfirmation;