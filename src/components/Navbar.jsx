import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiChevronDown, FiUser } from 'react-icons/fi';
import axios from 'axios';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(() => {
    // Initialize userData from localStorage if available
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
        
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(response.data));
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    // Only fetch if we don't have userData
    if (!userData) {
      fetchUserData();
    }
  }, [userData]);

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
      navigate('/');
    }
  };
  

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 h-[70px]">
      <div className="flex items-center justify-between p-4">
        {/* Logo and App Name */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img src="icon.png" alt="ShelfSmart Icon" className="w-11 h-11" />
          <span className="text-xl font-bold text-gray-800">ShelfSmart</span>
        </Link>

        {/* User Profile and Notifications */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <FiBell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
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