// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { FiPackage, FiAlertCircle, FiClock } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Dashboard() {
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : { name: 'Loading...', role: 'USER' };
      });
      const [stats, setStats] = useState({ totalItems: 0, lowStockItems: 0, expiringSoon: 0 });
      const [lowStockItems, setLowStockItems] = useState([]);
      const [expiringItems, setExpiringItems] = useState([]);
      const [error, setError] = useState('');
    

  useEffect(() => {
    const fetchData = async () => {
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

        // Total Items
        const inventoryResponse = await axios.get('http://localhost:8080/inventory', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats((prev) => ({ ...prev, totalItems: inventoryResponse.data.length }));

        // Low Stock Items
        const lowStockResponse = await axios.get('http://localhost:8080/inventory/low-stock', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLowStockItems(lowStockResponse.data.map((item) => ({
            id: item.id,
          name: item.name,
          quantity: `${item.quantity} units`,
          status: 'Low Stock',
        })));
        setStats((prev) => ({ ...prev, lowStockItems: lowStockResponse.data.length }));

        // Expiring Soon Items
        const expiryResponse = await axios.get('http://localhost:8080/alerts/expiry', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpiringItems(expiryResponse.data.map((item) => ({
          name: item.name,
          expiry: item.expiryDate,
          status: 'Expiring',
        })));
        setStats((prev) => ({ ...prev, expiringSoon: expiryResponse.data.length }));
      } catch (err) {
        setError('Failed to load dashboard data');
  toast.error('Failed to load dashboard data');
      }
    };
    fetchData();
  }, []);

  const handleRestock = async (itemName) => {
    try {
      const token = localStorage.getItem('token');
      // Find item by name (assumes lowStockItems has id; adjust if needed)
      const item = lowStockItems.find(i => i.name === itemName);
      if (!item.id) throw new Error('Item ID not available');
      
      const updatedItem = { ...item, quantity: parseInt(item.quantity) + 10 }; // Example: Add 10 units
      await axios.put(`http://localhost:8080/inventory/${item.id}`, updatedItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLowStockItems(lowStockItems.map(i => 
        i.name === itemName ? { ...i, quantity: `${updatedItem.quantity} units` } : i
      ));
      setStats(prev => ({ ...prev, lowStockItems: lowStockItems.length }));
    } catch (err) {
      setError('Failed to restock item');
      console.error(err);
    }
  };

  return (
    <Layout>
        <ToastContainer position="top-right" autoClose={3000} />;
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 mb-8 text-white">
        <h2 className="text-3xl font-bold">
          Welcome back, {user.name}
          <span className="ml-3 text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
            {user.role}
          </span>
        </h2>
        <p className="mt-2 opacity-90">Here's what's happening with your inventory today</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards with improved UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiPackage className="w-6 h-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-4xl font-bold text-gray-800">{stats.totalItems}</p>
              <p className="text-sm text-gray-500 mt-1">Total Items</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <FiAlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-4xl font-bold text-gray-800">{stats.lowStockItems}</p>
              <p className="text-sm text-gray-500 mt-1">Low Stock Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FiClock className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-4xl font-bold text-gray-800">{stats.expiringSoon}</p>
              <p className="text-sm text-gray-500 mt-1">Expiring Soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock and Expiring Soon Sections with improved UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
            Low Stock Items
          </h3>
          <div className="space-y-4">
            {lowStockItems.length === 0 ? (
              <p className="text-gray-500">No low stock items</p>
            ) : (
              lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Quantity left: <span className="text-red-500 font-medium">{item.quantity}</span>
                    </p>
                  </div>
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => handleRestock(item.name)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Restock
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiClock className="w-5 h-5 text-yellow-500 mr-2" />
            Expiring Soon
          </h3>
          <div className="space-y-4">
            {expiringItems.length === 0 ? (
              <p className="text-gray-500">No expiring items</p>
            ) : (
              expiringItems.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Expires: <span className="text-yellow-500 font-medium">{item.expiry}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  </Layout>
  );
}

export default Dashboard;