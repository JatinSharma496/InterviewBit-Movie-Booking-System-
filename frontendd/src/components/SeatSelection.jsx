import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaArrowLeft, FaChair, FaCheck, FaTimes } from 'react-icons/fa';
// Hardcoded API URL
const API_BASE_URL = 'http://localhost:8080';

function SeatSelection() {
  const { cinemaId, movieId, showtimeId } = useParams();
  const { state, confirmBooking } = useApp(); // Get confirmBooking from context
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loadingShow, setLoadingShow] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [selectedLocalSeats, setSelectedLocalSeats] = useState([]); // Local state for selected seats
  const serviceFee = 30.00; // Service fee variable

  // Fetch Show details
  useEffect(() => {
    const fetchShow = async () => {
      setLoadingShow(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/shows/${showtimeId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setShow(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingShow(false);
      }
    };
    fetchShow();
  }, [showtimeId]);

  // Fetch Seats for the Screen once Show is loaded
  useEffect(() => {
    if (show && show.screen_id) {
      const fetchSeats = async () => {
        setLoadingSeats(true);
        try {
          const response = await fetch(`${API_BASE_URL}/api/seats/screen/${show.screen_id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSeats(data);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoadingSeats(false);
        }
      };
      fetchSeats();
    }
  }, [show]);

  // Handle seat selection/deselection
  const handleSeatClick = useCallback(async (seat) => {
    const currentUserId = state.currentUser.id; // Get current user ID from context

    // If seat is already booked, do nothing
    if (seat.status === 'BOOKED') return;

    // Check if the seat is currently selected by the user in the UI
    const isSelectedLocally = selectedLocalSeats.some(s => s.id === seat.id);

    // If the seat is BLOCKED by someone else, or BLOCKED by current user but not selected locally, do nothing
    if (seat.status === 'BLOCKED' && (!isSelectedLocally || seat.blocked_by_user_id !== currentUserId)) {
      return; // Seat is blocked by another user or not selected by current user
    }

    if (isSelectedLocally) {
      // Deselect seat and unblock on backend
      try {
        const response = await fetch(`${API_BASE_URL}/api/seats/unblock`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([seat.id]), // Unblock expects a list of seat IDs
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to unblock seat ${seat.seat_code}`);
        }

        setSelectedLocalSeats(prev => prev.filter(s => s.id !== seat.id));
        setSeats(prevSeats => 
          prevSeats.map(s => (s.id === seat.id ? { ...s, status: 'AVAILABLE', blocked_by_user_id: null, blocked_until: null } : s))
        );
      } catch (e) {
        setError(e.message);
      }
    } else {
      // Select seat and block on backend
      if (selectedLocalSeats.length >= 6) {
        alert('You can select a maximum of 6 seats');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/seats/block`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: currentUserId,
            seat_ids: [seat.id],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to block seat ${seat.seat_code}`);
        }

        const blockedSeatsData = await response.json(); // Backend returns updated seats
        setSelectedLocalSeats(prev => [...prev, seat]);
        setSeats(prevSeats => 
          prevSeats.map(s => (s.id === seat.id ? blockedSeatsData.find(bs => bs.id === s.id) || { ...s, status: 'BLOCKED', blocked_by_user_id: currentUserId } : s))
        );
      } catch (e) {
        setError(e.message);
      }
    }
  }, [selectedLocalSeats, state.currentUser.id]);

  const getSeatStatus = useCallback((seat) => {
    if (seat.status === 'BOOKED') return 'booked';
    if (selectedLocalSeats.some(s => s.id === seat.id)) return 'selected';
    if (seat.status === 'BLOCKED') return 'blocked'; // Check backend blocked status
    return 'available';
  }, [selectedLocalSeats]);

  const getSeatColor = useCallback((seat) => {
    const status = getSeatStatus(seat);
    switch (status) {
      case 'booked': return 'bg-red-500 text-white';
      case 'selected': return 'bg-green-500 text-white';
      case 'blocked': return 'bg-yellow-500 text-white'; // Color for blocked seats
      default: return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    }
  }, [getSeatStatus]);

  const handleConfirmBooking = async () => {
    if (selectedLocalSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    setIsProcessingBooking(true);
    setError(null);

    try {
      const seatIds = selectedLocalSeats.map(seat => seat.id);
      const bookingId = await confirmBooking(show.id, seatIds); // Call context function
      navigate(`/confirmation/${bookingId}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsProcessingBooking(false);
    }
  };

  if (loadingShow || loadingSeats || state.loading) {
    return <div className="text-center text-xl">Loading show and seats...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">Error: {error}</div>;
  }

  if (!show) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Showtime not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">Back to Cinemas</Link>
      </div>
    );
  }

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.seat_row]) acc[seat.seat_row] = [];
    acc[seat.seat_row].push(seat);
    return acc;
  }, {});

  const totalPrice = selectedLocalSeats.length * (show.ticket_price || 15);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link 
          to={`/cinema/${cinemaId}`} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Movies
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Select Your Seats</h1>
        <div className="text-gray-600 mt-2">
          <p><strong>Movie:</strong> {show.movie_title}</p>
          <p><strong>Cinema:</strong> {show.screen_name} (Screen {show.screen_name})</p>
          <p><strong>Showtime:</strong> {show.time} on {show.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Screen</h2>
            
            {/* Screen representation */}
            <div className="bg-gray-800 text-white text-center py-2 mb-8 rounded">
              SCREEN
            </div>

            {/* Seat Legend */}
            <div className="flex justify-center space-x-6 mb-6 text-sm">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-200 rounded mr-2"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-yellow-500 rounded mr-2"></div>
                <span>Blocked</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
                <span>Booked</span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="space-y-2">
              {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                <div key={row} className="flex justify-center space-x-1">
                  <div className="w-8 text-center text-sm font-medium text-gray-600 flex items-center">
                    Row {row}
                  </div>
                  {rowSeats.map(seat => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status === 'BOOKED' || (seat.status === 'BLOCKED' && seat.blocked_by_user_id !== state.currentUser.id)}
                      className={`w-8 h-8 rounded text-xs font-medium transition-colors ${getSeatColor(seat)} ${
                        seat.status === 'BOOKED' || (seat.status === 'BLOCKED' && seat.blocked_by_user_id !== state.currentUser.id) ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      {seat.seat_number}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Maximum 6 seats per booking</p>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Selected Seats:</h3>
                {selectedLocalSeats.length > 0 ? (
                  <div className="mt-2">
                    {selectedLocalSeats.map(seat => (
                      <div key={seat.id} className="flex justify-between items-center py-1">
                        <span className="text-sm">Row {seat.seat_row}, Seat {seat.seat_number}</span>
                        <button
                          onClick={() => handleSeatClick(seat)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No seats selected</p>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Seats ({selectedLocalSeats.length})</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>₹ Service Fee</span>
                  <span>₹ {serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹ {(totalPrice + serviceFee).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={selectedLocalSeats.length === 0 || isProcessingBooking}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  selectedLocalSeats.length === 0 || isProcessingBooking
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isProcessingBooking ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FaCheck className="mr-2" />
                    Pay & Confirm Booking
                  </div>
                )}
              </button>

              <div className="text-xs text-gray-500 text-center">
                <p>Maximum 6 seats per booking</p>
                <p>Click to select/deselect seats</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;