import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaMapMarkerAlt } from 'react-icons/fa';

function CinemaList() {
  const { state } = useApp();
  const { cinemas, loading, error } = state;

  if (loading) {
    return <div className="text-center text-xl">Loading cinemas...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Cinema</h1>
        <p className="text-gray-600 text-lg">Select a cinema to view available movies and showtimes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cinemas.map(cinema => (
          <div key={cinema.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
            <div className="p-6 flex-grow">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{cinema.name}</h2>
              <div className="flex items-center text-gray-600 mb-4">
                <FaMapMarkerAlt className="mr-2" />
                <span>{cinema.location}</span>
              </div>
              <p className="text-gray-600 text-sm">Contact: {cinema.contact_info}</p>
            </div>
            <div className="p-6 pt-0">
              <Link
                to={`/cinema/${cinema.id}`}
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                View Movies & Showtimes
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CinemaList;