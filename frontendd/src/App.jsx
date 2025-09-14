import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import MovieHome from './components/MovieHome';
import MovieDetail from './components/MovieDetail';
import SeatSelection from './components/SeatSelection';
import BookingConfirmation from './components/BookingConfirmation';
import BookingHistory from './components/BookingHistory';
import AdminPanel from './components/AdminPanel';
import UnifiedAuth from './components/UnifiedAuth';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppContent() {
  const { state } = useApp();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={state.currentUser ? <MovieHome /> : <LandingPage />} />
            <Route path="/auth" element={<UnifiedAuth />} />
            <Route path="/movie/:movieId" element={
              <ProtectedRoute>
                <MovieDetail />
              </ProtectedRoute>
            } />
            <Route path="/booking/:cinemaId/:movieId/:showtimeId" element={
              <ProtectedRoute>
                <SeatSelection />
              </ProtectedRoute>
            } />
            <Route path="/confirmation/:bookingId" element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
