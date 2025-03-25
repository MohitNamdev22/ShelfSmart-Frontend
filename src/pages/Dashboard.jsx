// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { FiPackage, FiAlertCircle, FiClock } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AIInventorySuggestions from '../components/AIAccordion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import { defaults } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement);
defaults.font.family = 'Inter';

const Dashboard = () => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : { name: 'Loading...', role: 'USER' };
  });
  const [stats, setStats] = useState({ totalItems: 0, lowStockItems: 0, expiringSoon: 0 });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [suggestions, setSuggestions] = useState({});
  const [stockMovements, setStockMovements] = useState([]); 
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
        setLowStockItems(
          lowStockResponse.data.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: `${item.quantity} units`,
            status: 'Low Stock',
          }))
        );
        setStats((prev) => ({ ...prev, lowStockItems: lowStockResponse.data.length }));

        // Expiring Soon Items
        const expiryResponse = await axios.get('http://localhost:8080/alerts/expiry', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpiringItems(
          expiryResponse.data.map((item) => ({
            name: item.name,
            expiry: item.expiryDate,
            status: 'Expiring',
          }))
        );
        setStats((prev) => ({ ...prev, expiringSoon: expiryResponse.data.length }));

        // AI Suggestions
        const suggestionsResponse = await axios.get('http://localhost:8080/inventory/suggestions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuggestions(suggestionsResponse.data);

        // Stock Movements (Last 30 Days)
        const endDate = new Date().toISOString().split('T')[0]; // Today
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 days ago
        const movementsResponse = await axios.get('http://localhost:8080/reports/custom', {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate, endDate },
        });
        // Parse CSV response using PapaParse
        const parsedData = Papa.parse(movementsResponse.data, {
          header: true, // Use the first row as headers
          skipEmptyLines: true, // Skip empty lines
        });
        setStockMovements(parsedData.data || []);
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
      const item = lowStockItems.find((i) => i.name === itemName);
      if (!item.id) throw new Error('Item ID not available');

      const updatedItem = { ...item, quantity: parseInt(item.quantity) + 10 };
      await axios.put(
        `http://localhost:8080/inventory/${item.id}`,
        updatedItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLowStockItems(
        lowStockItems.map((i) =>
          i.name === itemName ? { ...i, quantity: `${updatedItem.quantity} units` } : i
        )
      );
      setStats((prev) => ({ ...prev, lowStockItems: lowStockItems.length }));
    } catch (err) {
      setError('Failed to restock item');
      console.error(err);
    }
  };

  // Donut Chart Data
  const stockLevelsData = {
    labels: ['Low Stock', 'Expiring Soon', 'Normal Stock'],
    datasets: [
      {
        data: [
          stats.lowStockItems,
          stats.expiringSoon,
          stats.totalItems - (stats.lowStockItems + stats.expiringSoon),
        ],
        backgroundColor: ['#EF4444', '#FBBF24', '#10B981'],
        hoverBackgroundColor: ['#DC2626', '#F59E0B', '#059669'],
        borderWidth: 0,
      },
    ],
  };

  // Line Chart Data
  const getMovementTrendsData = () => {
    const movementsByDate = stockMovements.reduce((acc, movement) => {
      const date = new Date(movement.Timestamp).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { ADDED: 0, CONSUMED: 0, UPDATED: 0, DELETED: 0 };
      acc[date][movement.MovementType] = (acc[date][movement.MovementType] || 0) + parseInt(movement.QuantityChanged);
      return acc;
    }, {});


    const labels = [];
    const endDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(endDate.getTime() - i * 24 * 60 * 60 * 1000);
      labels.push(date.toISOString().split('T')[0]);
    }

    const datasets = [
      {
        label: 'Added',
        data: labels.map((date) => movementsByDate[date]?.ADDED || 0),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
      },
      {
        label: 'Consumed',
        data: labels.map((date) => movementsByDate[date]?.CONSUMED || 0),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: true,
      },
      {
        label: 'Updated',
        data: labels.map((date) => movementsByDate[date]?.UPDATED || 0),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
      },
      {
        label: 'Deleted',
        data: labels.map((date) => movementsByDate[date]?.DELETED || 0),
        borderColor: '#FBBF24',
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        fill: true,
      },
    ];

    return {
      labels,
      datasets,
    };
  };

  // Bar Chart Data
  const getTopConsumedItemsData = () => {
    const consumedByItem = stockMovements
      .filter((movement) => movement.MovementType === 'CONSUMED')
      .reduce((acc, movement) => {
        const itemName = movement.ItemName;
        acc[itemName] = (acc[itemName] || 0) + Math.abs(parseInt(movement.QuantityChanged));
        return acc;
      }, {});
      // Sort functionality
    const topItems = Object.entries(consumedByItem)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      labels: topItems.map(([itemName]) => itemName),
      datasets: [
        {
          label: 'Units Consumed',
          data: topItems.map(([, quantity]) => quantity),
          backgroundColor: '#EF4444',
          borderColor: '#DC2626',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Donut Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Stock Levels Overview</h3>
            <div className="h-64">
              <Doughnut
                data={stockLevelsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' },
                    tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}` } },
                  },
                }}
              />
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Stock Movement Trends (Last 30 Days)</h3>
            <div className="h-64">
              <Line
                data={getMovementTrendsData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { title: { display: true, text: 'Date' } },
                    y: { title: { display: true, text: 'Quantity' } },
                  },
                  plugins: {
                    legend: { position: 'bottom' },
                    tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw}` } },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Top 5 Consumed Items (Last 30 Days)</h3>
          <div className="h-64">
            <Bar
              data={getTopConsumedItemsData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { title: { display: true, text: 'Item' } },
                  y: { title: { display: true, text: 'Units Consumed' } },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw} units` } },
                },
              }}
            />
          </div>
        </div>

        {/* Low Stock and Expiring Soon Sections */}
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

        {/* AI Inventory Suggestions */}
        <AIInventorySuggestions suggestions={suggestions} />
      </div>
    </Layout>
  );
}

export default Dashboard;