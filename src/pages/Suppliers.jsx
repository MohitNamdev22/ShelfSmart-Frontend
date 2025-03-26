import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { FiUsers, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Suppliers() {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : { name: 'Loading...', role: 'USER' };
  });
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactInfo: '',
    email: '',
    address: '',
  });
  const [isAdding, setIsAdding] = useState(false); 
  const [isEditing, setIsEditing] = useState(false); 
  const [isDeleting, setIsDeleting] = useState(false); 

  useEffect(() => {
    const fetchSuppliers = async () => {
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

        const response = await axios.get('http://localhost:8080/suppliers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuppliers(response.data || []);
      } catch (err) {
        setError('Failed to load suppliers');
        toast.error('Failed to load suppliers');
        console.error(err);
      }
    };
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(supplier => {
    const query = searchQuery.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(query) ||
      supplier.email.toLowerCase().includes(query) ||
      supplier.contactInfo.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentSuppliers = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  


  // Handle Add Supplier
  const handleAddSupplier = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      return;
    }

    setIsAdding(true);
    try {
      const response = await axios.post('http://localhost:8080/suppliers', newSupplier, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers([...suppliers, response.data]);
      setNewSupplier({ name: '', contactInfo: '', email: '', address: '' });
      setIsAddModalOpen(false);
      toast.success('Supplier added successfully');
    } catch (err) {
      setError('Failed to add supplier');
      toast.error('Failed to add supplier');
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  // Handle Edit Supplier
  const handleEditSupplier = async () => {
    const token = localStorage.getItem('token');
    if (!token || !selectedSupplier) {
      setError('Not authenticated or no supplier selected');
      return;
    }

    setIsEditing(true); 
    try {
      const response = await axios.put(
        `http://localhost:8080/suppliers/${selectedSupplier.id}`,
        selectedSupplier,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === selectedSupplier.id ? response.data : supplier
        )
      );
      setIsEditModalOpen(false);
      setSelectedSupplier(null);
      toast.success('Supplier updated successfully');
    } catch (err) {
      setError('Failed to update supplier');
      toast.error('Failed to update supplier');
      console.error(err);
    } finally {
      setIsEditing(false);
    }
  };

  // Handle Delete Supplier
  const handleDeleteSupplier = async () => {
    const token = localStorage.getItem('token');
    if (!token || !selectedSupplier) {
      setError('Not authenticated or no supplier selected');
      return;
    }

    setIsDeleting(true); 
    try {
      await axios.delete(`http://localhost:8080/suppliers/${selectedSupplier.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(suppliers.filter((supplier) => supplier.id !== selectedSupplier.id));
      setIsDeleteModalOpen(false);
      setSelectedSupplier(null);
      toast.success('Supplier deleted successfully');
    } catch (err) {
      setError('Failed to delete supplier');
      toast.error('Failed to delete supplier');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout userName={user.name} userRole={user.role}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Suppliers Management</h2>
          <p className="text-gray-500">View and manage your suppliers</p>
        </div>
          {user.role === 'ADMIN' && (
          <div className="mb-6">
            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={isAdding}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isAdding
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isAdding ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" />
                  Add Supplier
                </>
              )}
            </button>
          </div>
        )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

<div className="mb-6">
  <div className="relative">
    <input
      type="text"
      placeholder="Search suppliers by name, email or contact..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full md:w-96 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  </div>
  {searchQuery && (
    <p className="mt-2 text-sm text-gray-600">
      Found {filteredSuppliers.length} supplier(s) matching your search
    </p>
  )}
</div>
        

        {/* Suppliers Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-left">
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Email</th>
                <th className="p-4">Address</th>
                {user.role === 'ADMIN' && <th className="p-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={user.role === 'ADMIN' ? 6 : 5} className="p-4 text-center text-gray-500">
                    No suppliers found
                  </td>
                </tr>
              ) : (
                currentSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-t">
                    <td className="p-4 text-gray-800">{supplier.id}</td>
                    <td className="p-4 text-gray-800">{supplier.name}</td>
                    <td className="p-4 text-gray-800">{supplier.contactInfo}</td>
                    <td className="p-4 text-gray-800">{supplier.email}</td>
                    <td className="p-4 text-gray-800">{supplier.address}</td>
                    {user.role === 'ADMIN' && (
                      <td className="p-4 text-gray-800 flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                          disabled={isEditing || isDeleting}
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          disabled={isEditing || isDeleting}
                        >
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add Supplier</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newSupplier.name}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, name: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter supplier name"
                    disabled={isAdding}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Contact Info</label>
                  <input
                    type="text"
                    value={newSupplier.contactInfo}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, contactInfo: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contact info"
                    disabled={isAdding}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, email: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email"
                    disabled={isAdding}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Address</label>
                  <textarea
                    value={newSupplier.address}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, address: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter address"
                    rows="3"
                    disabled={isAdding}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  disabled={isAdding}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSupplier}
                  disabled={isAdding}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    isAdding
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {isAdding ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Adding...
                    </>
                  ) : (
                    'Add Supplier'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && selectedSupplier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Edit Supplier</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={selectedSupplier.name}
                    onChange={(e) =>
                      setSelectedSupplier({ ...selectedSupplier, name: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isEditing}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Contact Info</label>
                  <input
                    type="text"
                    value={selectedSupplier.contactInfo}
                    onChange={(e) =>
                      setSelectedSupplier({ ...selectedSupplier, contactInfo: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isEditing}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={selectedSupplier.email}
                    onChange={(e) =>
                      setSelectedSupplier({ ...selectedSupplier, email: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isEditing}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Address</label>
                  <textarea
                    value={selectedSupplier.address}
                    onChange={(e) =>
                      setSelectedSupplier({ ...selectedSupplier, address: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    disabled={isEditing}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  disabled={isEditing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSupplier}
                  disabled={isEditing}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    isEditing
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {isEditing ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && selectedSupplier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Delete Supplier</h3>
              <p className="text-gray-700">
                Are you sure you want to delete the supplier{' '}
                <span className="font-medium">{selectedSupplier.name}</span>? This action cannot be
                undone.
              </p>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSupplier}
                  disabled={isDeleting}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    isDeleting
                      ? 'bg-red-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Suppliers;