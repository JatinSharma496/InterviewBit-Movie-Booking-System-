// API Configuration
// Dynamically determine the API base URL based on the current host
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // If accessing from localhost, use localhost for API
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8080';
  }
  
  // If accessing from mobile/other devices, use the same host with port 8080
  return `http://${hostname}:8080`;
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
