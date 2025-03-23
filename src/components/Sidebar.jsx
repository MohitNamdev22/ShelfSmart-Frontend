import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

function Sidebar({ userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/inventory', label: 'Inventory' },
    { path: '/reports', label: 'Reports' },
  ];

  const adminItems = userRole === 'ADMIN' ? [{ path: '/add-item', label: 'Manage Inventory' }] : [];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-20 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>
      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-full bg-gray-800 text-white w-64 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-10`}
      >
        <div className="p-4">
          {[...navItems, ...adminItems].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block py-2 px-4 rounded ${
                isActive(item.path) ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
              onClick={() => setIsOpen(false)} // Close on mobile click
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;