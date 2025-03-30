import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiChevronDown, FiUser, FiAlertCircle, FiClock } from 'react-icons/fi';
import axios from 'axios';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const [notifications, setNotifications] = useState({
    lowStock: [],
    expiringSoon: []
  });
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:8080/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        localStorage.setItem('userData', JSON.stringify(response.data));
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    if (!userData) {
      fetchUserData();
    }
  }, [userData]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

      const [lowStockResponse, expiryResponse] = await Promise.all([
        axios.get('http://localhost:8080/inventory/low-stock', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:8080/alerts/expiry', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

        setNotifications({
          lowStock: lowStockResponse.data.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity
          })) || [],
          expiringSoon: expiryResponse.data.map(item => ({
            id: item.id,
            name: item.name,
            expiryDate: item.expiryDate
          })) || []
        });
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 300000);
    return () => clearInterval(interval);
  }, []);
  const totalNotifications = notifications.lowStock.length + notifications.expiringSoon.length;

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/user/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setUserData(null);
      navigate('/login');
    }
  };
  

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 h-[70px]">
      <div className="flex items-center justify-between p-4">
      <Link to="/dashboard" className="flex items-center space-x-2 md:ml-0 ml-8">
        <img src="icon.png" alt="ShelfSmart Icon" className="w-11 h-11" />
        <span className="text-xl font-bold text-gray-800 md:block hidden">ShelfSmart</span>
      </Link>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative focus:outline-none"
            >
              <FiBell className="w-6 h-6 text-gray-600 hover:text-gray-800" />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {totalNotifications}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>

                {totalNotifications === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No notifications
                  </div>
                ) : (
                  <>
                    {notifications.lowStock.length > 0 && (
                      <div className="px-4 py-2">
                        <div className="flex items-center text-red-600 mb-2">
                          <FiAlertCircle className="mr-2" />
                          <span className="font-medium">Low Stock Items</span>
                        </div>
                        {notifications.lowStock.map(item => (
                          <div key={item.id} className="pl-6 py-1 text-sm text-gray-600">
                            {item.name} - {item.quantity} remaining
                          </div>
                        ))}
                      </div>
                    )}

                    {notifications.expiringSoon.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-100">
                        <div className="flex items-center text-yellow-600 mb-2">
                          <FiClock className="mr-2" />
                          <span className="font-medium">Expiring Soon</span>
                        </div>
                        {notifications.expiringSoon.map(item => (
                          <div key={item.id} className="pl-6 py-1 text-sm text-gray-600">
                            {item.name} - Expires {new Date(item.expiryDate).toLocaleDateString()}
                          </div>
                        ))}
                      </div>
                    )}

                    <Link
                      to="/inventory"
                      className="block mt-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 text-center"
                      onClick={() => setIsNotificationOpen(false)}
                    >
                      View All in Inventory
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <FiUser className="w-5 h-5" />
              </div>
              <span className="text-gray-800">{userData?.name || 'User'}</span>
              <FiChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-500">
                  Role: {userData?.role || 'Loading...'}
                </div>
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;