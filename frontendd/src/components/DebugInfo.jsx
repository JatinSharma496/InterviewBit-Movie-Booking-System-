import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

function DebugInfo() {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    const info = {
      currentHost: window.location.hostname,
      currentPort: window.location.port,
      apiBaseUrl: API_BASE_URL,
      userAgent: navigator.userAgent,
      protocol: window.location.protocol
    };
    setDebugInfo(info);
  }, []);

  const testApiConnection = async () => {
    try {
      setTestResult('Testing...');
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setTestResult('✅ API connection successful!');
      } else {
        setTestResult(`❌ API connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestResult(`❌ API connection error: ${error.message}`);
    }
  };

  const testLogin = async () => {
    try {
      setTestResult('Testing login...');
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        }),
      });
      
      if (response.ok) {
        const user = await response.json();
        setTestResult(`✅ Login successful! User: ${user.name}`);
      } else {
        setTestResult(`❌ Login failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestResult(`❌ Login error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Debug Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Connection Info</h3>
          <p><strong>Current Host:</strong> {debugInfo.currentHost}</p>
          <p><strong>Current Port:</strong> {debugInfo.currentPort}</p>
          <p><strong>API Base URL:</strong> {debugInfo.apiBaseUrl}</p>
          <p><strong>Protocol:</strong> {debugInfo.protocol}</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Device Info</h3>
          <p><strong>User Agent:</strong> {debugInfo.userAgent}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">API Tests</h3>
        <div className="space-x-2 mb-2">
          <button 
            onClick={testApiConnection}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test API Connection
          </button>
          <button 
            onClick={testLogin}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Login
          </button>
        </div>
        {testResult && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            {testResult}
          </div>
        )}
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
        <h4 className="font-semibold">Troubleshooting Tips:</h4>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Make sure both backend and frontend servers are running</li>
          <li>Check that your mobile device and computer are on the same WiFi network</li>
          <li>Verify the IP address is correct (should match one of the IPs from ipconfig)</li>
          <li>If you see CORS errors, the backend CORS configuration might need adjustment</li>
          <li>Check browser developer tools console for any error messages</li>
        </ul>
      </div>
    </div>
  );
}

export default DebugInfo;
