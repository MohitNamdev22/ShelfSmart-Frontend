import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Import icons from react-icons
import { HiMenu, HiX } from 'react-icons/hi';
import { 
  MdDashboard, 
  MdInventory, 
  MdBarChart, 
  MdSettings, 
  MdAdd, 
  MdImportExport,
  MdAnalytics
} from 'react-icons/md';

const Sidebar = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const baseNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: MdDashboard },
    { path: '/inventory', label: 'Inventory', icon: MdInventory },
    { path: '/reports', label: 'Reports', icon: MdBarChart },
    { path: '/activity', label: 'User Activity', icon: MdAnalytics },
  ];

  const adminNavItems = [
    { path: '/suppliers', label: 'Suppliers', icon: MdImportExport },
  ];

  const navItems = userRole === 'ADMIN' ? [...baseNavItems, ...adminNavItems] : baseNavItems;

  const isActive = (path) => location.pathname === path;

  const adminItems = userRole === 'ADMIN' ? [
  ] : [];


  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-6 left-4 z-20 md:hidden text-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      <div className={`fixed top-0 left-0 h-full bg-white shadow-lg w-64 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-10`}>
        
        <div className="p-6 flex items-center">
          <img src="icon.png" alt="ShelfSmart Icon" className="w-8 h-8 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">ShelfSmart</h2>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-4 ${
                isActive(item.path)
                  ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay */}
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