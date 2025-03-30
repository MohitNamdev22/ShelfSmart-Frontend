import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { FiUser, FiActivity, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const UserActivity = () => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : { name: 'Loading...', role: 'USER' };
  });
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

        const sortedActivities = (response.data || []).sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
      
        setActivities(sortedActivities);
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

  const getActionColor = (action) => {
    switch(action) {
      case 'LOGIN':
        return 'bg-green-100 text-green-800';
      case 'LOGOUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'ITEM_CONSUMED':
        return 'bg-red-100 text-red-800';
      case 'ITEM_ADDED':
        return 'bg-blue-100 text-blue-800';
      case 'ITEM_UPDATED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <Layout userName={user.name} userRole={user.role}>
      <div className="p-6 max-w-7xl mx-auto md:mt-12">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 sm:p-6 mb-4 sm:mb-8 text-white">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center">
            <FiActivity className="mr-2" />
            User Activity
          </h2>
          <p className="mt-1 sm:mt-2 opacity-90 text-sm sm:text-base">
            Track user actions and activities in the system
          </p>
          </div>

          {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Activity Table */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-x-auto">
          <div className="min-w-[600px]">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-left">
                  {!isMobile && <th className="p-3 sm:p-4 text-xs sm:text-sm">ID</th>}
                  <th className="p-3 sm:p-4 text-xs sm:text-sm">User</th>
                  {!isMobile && <th className="p-3 sm:p-4 text-xs sm:text-sm">Email</th>}
                  <th className="p-3 sm:p-4 text-xs sm:text-sm">Action</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm">Details</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm">Time</th>
                </tr>
              </thead>
              <tbody>
                {currentActivities.length === 0 ? (
                  <tr>
                    <td colSpan={isMobile ? 4 : 6} className="p-4 text-center text-gray-500 text-sm sm:text-base">
                      No activities found
                    </td>
                  </tr>
                ) : (
                  currentActivities.map((activity) => (
                    <tr key={activity.id} className="border-t hover:bg-gray-50">
                      {!isMobile && <td className="p-3 sm:p-4 text-gray-800 text-xs sm:text-sm">{activity.id}</td>}
                      <td className="p-3 sm:p-4 text-gray-800 text-xs sm:text-sm">
                        <div className="flex items-center">
                          <FiUser className="mr-1 sm:mr-2 text-gray-400" />
                          {activity.user.name}
                        </div>
                      </td>
                      {!isMobile && <td className="p-3 sm:p-4 text-gray-800 text-xs sm:text-sm">{activity.user.email}</td>}
                      <td className="p-3 sm:p-4 text-gray-800 text-xs sm:text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs sm:text-sm ${getActionColor(activity.action)}`}
                        >
                          {isMobile ? activity.action.split('_')[0] : activity.action}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-gray-800 text-xs sm:text-sm">
                        {isMobile ? 
                          activity.description.length > 20 
                            ? `${activity.description.substring(0, 20)}...` 
                            : activity.description
                          : activity.description
                        }
                      </td>
                      <td className="p-3 sm:p-4 text-gray-800 text-xs sm:text-sm">
                        {isMobile 
                          ? new Date(activity.timestamp).toLocaleTimeString() 
                          : new Date(activity.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 sm:mt-6 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              <FiChevronLeft />
            </button>
            
            {!isMobile && (
              Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })
            )}

            {isMobile && (
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                Page {currentPage} of {totalPages}
              </span>
            )}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default UserActivity;