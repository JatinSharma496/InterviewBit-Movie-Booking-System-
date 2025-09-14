// Simple test script to verify booking API is working
const testBookingAPI = async () => {
  try {
    console.log('Testing booking API...');
    
    const response = await fetch('http://localhost:8080/api/bookings');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const bookings = await response.json();
    console.log('✅ Bookings fetched successfully!');
    console.log(`Found ${bookings.length} bookings`);
    
    if (bookings.length > 0) {
      console.log('Sample booking:', {
        id: bookings[0].id,
        movieTitle: bookings[0].movieTitle,
        cinemaName: bookings[0].cinemaName,
        status: bookings[0].status
      });
    }
    
  } catch (error) {
    console.error('❌ Error fetching bookings:', error.message);
  }
};

// Run the test
testBookingAPI();
