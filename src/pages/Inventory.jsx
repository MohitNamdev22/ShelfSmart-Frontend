// Inventory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { FiSearch, FiCalendar, FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi';

function Inventory() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Loading...', role: 'USER' });
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchInventory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      try {
        // Fetch user data (placeholder)
        const userData = { name: 'John Doe', role: 'ADMIN' };
        setUser(userData);

        // Fetch inventory with search and category filters
        const params = {};
        if (searchQuery) params.name = searchQuery;
        if (categoryFilter && categoryFilter !== 'All Category') params.category = categoryFilter;
        
        const response = await axios.get('http://localhost:8080/inventory/search', {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        setInventoryItems(response.data);
      } catch (err) {
        setError('Failed to load inventory');
        console.error(err);
      }
    };
    fetchInventory();
  }, [searchQuery, categoryFilter]);

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setCategoryFilter(e.target.value);

  const handleEdit = (id) => navigate(`/edit-item/${id}`);
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/inventory/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInventoryItems(inventoryItems.filter((item) => item.id !== id));
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };
  const handleAddItem = () => navigate('/add-item');

  // Pagination (client-side for now)
  const totalItems = inventoryItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = inventoryItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Layout userName={user.name} userRole={user.role}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
          {user.role === 'ADMIN' && (
            <button
              onClick={handleAddItem}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <span className="mr-2">+</span> Add Item
            </button>
          )}
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
          <div className="relative flex-1 mb-4 md:mb-0">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search items..."
              className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative mb-4 md:mb-0">
            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option>All Category</option>
              {/* Dynamically fetch categories if backend supports it */}
              <option>Grains</option>
              <option>Pasta</option>
              <option>Canned Goods</option>
              <option>Oils</option>
              <option>Legumes</option>
              <option>Sweeteners</option>
              <option>Baking</option>
            </select>
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="relative mb-4 md:mb-0">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Date Range (Not Implemented)"
              className="pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-100">
            <FiDownload className="mr-2" />
            Export (Not Implemented)
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-left">
                <th className="p-4">Name</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Category</th>
                <th className="p-4">Supplier</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No items found</td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-4 text-gray-800">{item.name}</td>
                    <td className="p-4 text-gray-800">{item.quantity}</td>
                    <td className="p-4 text-gray-800">{item.expiryDate}</td>
                    <td className="p-4 text-gray-800">{item.category}</td>
                    <td className="p-4 text-gray-800">{item.supplierInfo}</td>
                    {user.role === 'ADMIN' && (
                      <td className="p-4 flex space-x-2">
                        <button onClick={() => handleEdit(item.id)} className="text-blue-600 hover:text-blue-800">
                          <FiEdit />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                          <FiTrash2 />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + currentItems.length, totalItems)} of {totalItems} entries
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border rounded-lg ${currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Inventory;