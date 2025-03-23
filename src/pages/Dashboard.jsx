// Dashboard.jsx
import React from 'react';
import Layout from '../components/Layout'; // Import the new Layout component

function Dashboard() {
  // Hardcoded data for demonstration (replace with API calls in a real app)
  const user = { name: 'John Doe', role: 'ADMIN' }; // Example user data
  const stats = {
    totalItems: 2459,
    lowStockItems: 45,
    expiringSoon: 28,
  };
  const lowStockItems = [
    { name: 'Organic Brown Rice', quantity: '5 kg', status: 'Low Stock' },
    { name: 'Whole Wheat Pasta', quantity: '8 boxes', status: 'Low Stock' },
    { name: 'Quinoa', quantity: '3 kg', status: 'Low Stock' },
  ];
  const expiringItems = [
    { name: 'Fresh Milk', expiry: 'Jan 25, 2024', status: 'Expiring' },
    { name: 'Yogurt', expiry: 'Jan 20, 2024', status: 'Expiring' },
    { name: 'Orange Juice', expiry: 'Jan 27, 2024', status: 'Expiring' },
  ];

  return (
    <Layout userName={user.name} userRole={user.role}>
      {/* Main Dashboard Content */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user.name}
          <span className="ml-2 text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
            {user.role}
          </span>
        </h2>
        <p className="text-gray-500 mt-1">
          Here’s what’s happening with your inventory
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 text-blue-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.totalItems}</p>
                <p className="text-gray-500">Total Items</p>
                <p className="text-green-500 text-sm mt-1">+12%</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 text-orange-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.lowStockItems}</p>
                <p className="text-gray-500">Low Stock Items</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 text-yellow-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.expiringSoon}</p>
                <p className="text-gray-500">Items Expiring Soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock and Expiring Soon Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Low Stock Items */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Items</h3>
            {lowStockItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border-b last:border-b-0"
              >
                <div>
                  <p className="text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity left: {item.quantity}{' '}
                    <span className="text-red-500">{item.status}</span>
                  </p>
                </div>
                <button className="px-4 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                  Restock
                </button>
              </div>
            ))}
          </div>

          {/* Expiring Soon Items */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Expiring Soon</h3>
            {expiringItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border-b last:border-b-0"
              >
                <div>
                  <p className="text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Expires: {item.expiry}{' '}
                    <span className="text-yellow-500">{item.status}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;