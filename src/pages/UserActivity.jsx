import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { FiUser, FiActivity } from 'react-icons/fi';

function UserActivity() {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : { name: 'Loading...', role: 'USER' };
  });
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchActivities = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }

        const response = await axios.get('http://localhost:8080/activity', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivities(response.data || []);
      } catch (err) {
        setError('Failed to load user activity data');
        console.error(err);
      }
    };
    fetchActivities();
  }, []);

  
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivities = activities.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Layout userName={user.name} userRole={user.role}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 mb-8 text-white">
          <h2 className="text-3xl font-bold flex items-center">
            <FiActivity className="mr-2" />
            User Activity
          </h2>
          <p className="mt-2 opacity-90">Track user actions and activities in the system</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        {/* Activity Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-left">
                <th className="p-4">ID</th>
                <th className="p-4">User Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Action</th>
                <th className="p-4">Description</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {currentActivities.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No activities found
                  </td>
                </tr>
              ) : (
                currentActivities.map((activity) => (
                  <tr key={activity.id} className="border-t">
                    <td className="p-4 text-gray-800">{activity.id}</td>
                    <td className="p-4 text-gray-800">{activity.user.name}</td>
                    <td className="p-4 text-gray-800">{activity.user.email}</td>
                    <td className="p-4 text-gray-800">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          activity.action === 'LOGIN'
                            ? 'bg-green-100 text-green-800'
                            : activity.action === 'ITEM_CONSUMED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {activity.action}
                      </span>
                    </td>
                    <td className="p-4 text-gray-800">{activity.description}</td>
                    <td className="p-4 text-gray-800">
                      {new Date(activity.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default UserActivity;