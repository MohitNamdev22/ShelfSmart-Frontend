import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { FiUsers, FiEdit, FiTrash2, FiPlus, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Suppliers = () => {
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
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const TableSkeleton = () => (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-x-auto animate-pulse">
      <div className="min-w-[600px]">
        <div className="bg-gray-50 p-4">
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-4 bg-gray-100 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setIsLoading(false);
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
      } finally {
        setIsLoading(false);
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
      <div className="p-4 sm:p-6 max-w-7xl mx-auto md:mt-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <div className="">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Suppliers Management</h2>
            <p className="text-sm sm:text-base text-gray-500">View and manage your suppliers</p>
          </div>
          {user.role === 'ADMIN' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={isAdding}
              className={`flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
                isAdding
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white text-sm sm:text-base`}
            >
              {isAdding ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 text-white"
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
                  {isMobile ? 'Adding' : 'Adding...'}
                </>
              ) : (
                <>
                  <FiPlus className="mr-1 sm:mr-2" />
                  {isMobile ? 'Add' : 'Add Supplier'}
                </>
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm sm:text-base">
            {error}
          </div>
        )}

<div className="mb-4 sm:mb-6">
  <div className="relative">
    <input
      type="text"
      placeholder="Search suppliers by name, email or contact..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
          </div>
          {searchQuery && !isLoading && (
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              Found {filteredSuppliers.length} supplier(s)
            </p>
          )}
        </div>
        

        {/* Suppliers Table */}
        {isLoading ? (
          <TableSkeleton/>
        ): (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-x-auto">
          <div className="min-w-[600px]"> {/* Minimum width for small screens */}
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-left">
                  {!isMobile && <th className="p-3 sm:p-4 text-xs sm:text-sm">ID</th>}
                  <th className="p-3 sm:p-4 text-xs sm:text-sm">Name</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm">Contact</th>
                  {!isMobile && <th className="p-3 sm:p-4 text-xs sm:text-sm">Email</th>}
                  {!isMobile && <th className="p-3 sm:p-4 text-xs sm:text-sm">Address</th>}
                  {user.role === 'ADMIN' && <th className="p-3 sm:p-4 text-xs sm:text-sm">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentSuppliers.length === 0 ? (
                  <tr>
                    <td 
                      colSpan={isMobile ? (user.role === 'ADMIN' ? 3 : 2) : (user.role === 'ADMIN' ? 6 : 5)} 
                      className="p-4 text-center text-gray-500 text-sm sm:text-base"
                    >
                      No suppliers found
                    </td>
                  </tr>
                ) : (
                  currentSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-t hover:bg-gray-50">
                      {!isMobile && <td className="p-3 sm:p-4 text-gray-800 text-xs sm:text-sm">{supplier.id}</td>}
                      <td className="p-3 sm:p-4 text-gray-800 text-xs sm:text-sm">{supplier.name}</td>
                      <td className="p-3 sm:p-4 text-gray-800 text-xs sm:text-sm">{supplier.contactInfo}</td>
                      {!isMobile && <td className="p-3 sm:p-4 text-gray-800 text-xs sm:text-sm">{supplier.email}</td>}
                      {!isMobile && <td className="p-3 sm:p-4 text-gray-800 text-xs sm:text-sm">{supplier.address}</td>}
                      {user.role === 'ADMIN' && (
                        <td className="p-3 sm:p-4 text-gray-800 text-xs sm:text-sm">
                          <div className="flex space-x-1 sm:space-x-2">
                            <button
                              onClick={() => {
                                setSelectedSupplier(supplier);
                                setIsEditModalOpen(true);
                              }}
                              className="p-1 sm:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                              disabled={isEditing || isDeleting}
                              title="Edit"
                            >
                              <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedSupplier(supplier);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1 sm:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                              disabled={isEditing || isDeleting}
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-4 sm:mt-6 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              <FiChevronLeft />
            </button>
            
            {!isMobile && (
              Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })
            )}

            {isMobile && (
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs sm:text-sm">
                Page {currentPage} of {totalPages}
              </span>
            )}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              <FiChevronRight />
            </button>
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