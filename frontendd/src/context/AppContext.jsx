import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Initial state
const initialState = {
  cinemas: [],
  bookings: [],
  currentUser: null, // Will be set after login
  isAdmin: false,
  loading: true, // To show a loading indicator
  error: null, // To show an error message
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CINEMAS':
      return { ...state, cinemas: action.payload, loading: false };
    case 'SET_BOOKING':
      return { ...state, bookings: [...state.bookings, action.payload] };
    
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload,
        isAdmin: action.payload?.isAdmin || false
      };
    
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        isAdmin: false
      };
    
    // Old mock data logic removed
    case 'CANCEL_BOOKING':
      const updatedBookings = state.bookings.map(booking => 
        booking.id === action.bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      );
      return { ...state, bookings: updatedBookings };
    
    case 'TOGGLE_ADMIN':
      return {
        ...state,
        isAdmin: !state.isAdmin
      };
    
    case 'ADD_MOVIE': // This will need to be updated to use backend API
      const cinemaToUpdate = state.cinemas.find(c => c.id === action.cinemaId);
      if (cinemaToUpdate) {
        return {
          ...state,
          cinemas: state.cinemas.map(cinema => 
            cinema.id === action.cinemaId
              ? { ...cinema, movies: [...cinema.movies, action.movie] }
              : cinema
          )
        };
      }
      return state;
    
    default:
      return state;
  }
}

// Context Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Fetch cinemas from the backend on mount
  useEffect(() => {
    const fetchCinemas = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const response = await fetch('http://localhost:8080/api/cinemas');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        dispatch({ type: 'SET_CINEMAS', payload: data });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchCinemas();
  }, []);

  // Implement confirmBooking API call
  const confirmBooking = async (showId, seatIds) => {
    try {
      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: state.currentUser.id,
          show_id: showId,
          seat_ids: seatIds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const bookingData = await response.json();
      dispatch({ type: 'SET_BOOKING', payload: bookingData });
      return bookingData.id; // Return the new booking ID
    } catch (error) {
      console.error("Error confirming booking:", error);
      throw error; // Re-throw to be handled by the component
    }
  };

  const value = {
    state,
    dispatch,
    confirmBooking,
    cancelBooking: (bookingId) => dispatch({ type: 'CANCEL_BOOKING', bookingId }),
    toggleAdmin: () => dispatch({ type: 'TOGGLE_ADMIN' }),
    addMovie: (cinemaId, movie) => dispatch({ type: 'ADD_MOVIE', cinemaId, movie }), // This will need to be updated
    logout: () => dispatch({ type: 'LOGOUT' })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
