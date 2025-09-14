// Comprehensive test script to verify all endpoints after database schema changes
const testAllEndpoints = async () => {
  const baseUrl = 'http://localhost:8080/api';
  
  const tests = [
    {
      name: 'Cinemas',
      url: `${baseUrl}/cinemas`,
      expectedFields: ['id', 'name', 'location', 'contactInfo', 'screens']
    },
    {
      name: 'Movies',
      url: `${baseUrl}/movies`,
      expectedFields: ['id', 'title', 'description', 'genre', 'rating', 'duration']
    },
    {
      name: 'Bookings',
      url: `${baseUrl}/bookings`,
      expectedFields: ['id', 'movieTitle', 'cinemaName', 'status', 'totalAmount']
    },
    {
      name: 'Screens',
      url: `${baseUrl}/screens`,
      expectedFields: ['id', 'name', 'capacity', 'cinemaId']
    },
    {
      name: 'Shows',
      url: `${baseUrl}/shows`,
      expectedFields: ['id', 'date', 'time', 'movieId', 'screenId', 'cinemaName']
    }
  ];

  console.log('🧪 Testing all endpoints after database schema changes...\n');

  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const response = await fetch(test.url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ ${test.name}: ${data.length || 1} items fetched`);
      
      // Check if it's an array
      if (Array.isArray(data) && data.length > 0) {
        const sample = data[0];
        const missingFields = test.expectedFields.filter(field => !(field in sample));
        if (missingFields.length > 0) {
          console.log(`⚠️  Missing fields: ${missingFields.join(', ')}`);
        } else {
          console.log(`✅ All expected fields present`);
        }
      }
      
    } catch (error) {
      console.error(`❌ ${test.name}: ${error.message}`);
    }
    console.log('');
  }

  // Test specific cinema-movie relationship
  console.log('Testing cinema-movie relationship...');
  try {
    const cinemasResponse = await fetch(`${baseUrl}/cinemas`);
    const cinemas = await cinemasResponse.json();
    
    if (cinemas.length > 0) {
      const cinemaId = cinemas[0].id;
      const moviesResponse = await fetch(`${baseUrl}/cinemas/${cinemaId}/movies`);
      const movies = await moviesResponse.json();
      console.log(`✅ Cinema ${cinemaId} has ${movies.length} movies`);
    }
  } catch (error) {
    console.error(`❌ Cinema-movie relationship: ${error.message}`);
  }
};

// Run the tests
testAllEndpoints();
