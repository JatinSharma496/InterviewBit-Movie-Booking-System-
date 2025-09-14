import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import CinemaList from './components/CinemaList';
import MovieList from './components/MovieList';
import SeatSelection from './components/SeatSelection';
import BookingConfirmation from './components/BookingConfirmation';
import BookingHistory from './components/BookingHistory';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<CinemaList />} />
              <Route path="/cinema/:cinemaId" element={<MovieList />} />
              <Route path="/booking/:cinemaId/:movieId/:showtimeId" element={<SeatSelection />} />
              <Route path="/confirmation/:bookingId" element={<BookingConfirmation />} />
              <Route path="/history" element={<BookingHistory />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
