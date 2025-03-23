import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/solid';

function Navbar({ userName, userRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          ShelfSmart
        </Link>
        {/* User Profile Dropdown */}
        <div className="relative group">
          <div className="flex items-center space-x-2 cursor-pointer">
            <UserCircleIcon className="h-6 w-6 text-gray-600" />
            <span className="text-gray-800">{userName || 'User'}</span>
            <span className="text-sm text-gray-500">({userRole || 'User'})</span>
          </div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
            <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;