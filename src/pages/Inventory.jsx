import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch, FiCalendar, FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi';
import Select from 'react-select';

const InventoryModal = React.memo(({ isOpen, onClose, isEdit, formData, handleFormChange, handleFormSubmit, isSubmitting, suppliers }) => {
  if (!isOpen) return null;

  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.id,
    label: supplier.name
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg z-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {isEdit ? 'Edit Inventory Item' : 'Add Inventory Item'}
        </h2>
        <p className="text-gray-500 mb-6">
          Fill in the information below to {isEdit ? 'update the' : 'add a new'} item to your inventory
        </p>

        <form onSubmit={(e) => handleFormSubmit(e, isEdit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Enter item name"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">
                Threshold <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="threshold"
                value={formData.threshold}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleFormChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              placeholder="Enter category"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1">
              Supplier <span className="text-red-500">*</span>
            </label>
            <Select
              options={supplierOptions}
              value={supplierOptions.find(option => option.value === formData.supplier?.id) || null}
              onChange={(selected) => handleFormChange({ target: { name: 'supplier', value: selected ? { id: selected.value } : null } })}
              placeholder="Search and select supplier"
              isClearable
              className="basic-single"
              classNamePrefix="select"
              menuPlacement="top"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEdit ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                isEdit ? 'Update Item' : 'Save Item'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 p-3 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

const DeleteModal = React.memo(({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md z-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Deletion</h2>
        <p className="text-gray-500 mb-6">
          Are you sure you want to delete <span className="font-semibold">{itemName}</span>? This action cannot be undone.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 p-3 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
});

const Inventory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Loading...', role: 'USER' });
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    threshold: 0,
    expiryDate: '',
    category: '',
    supplier: null 
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Not authenticated');
        setError('Not authenticated');
        navigate('/login');
        return;
      }

      try {
        // (placeholder data)
        const userData = { name: 'John Doe', role: 'ADMIN' };
        setUser(userData);

        // Fetch inventory
        const params = {};
        if (searchQuery) params.name = searchQuery;
        if (categoryFilter && categoryFilter !== 'All Category') params.category = categoryFilter;
        const inventoryResponse = await axios.get('http://localhost:8080/inventory/search', {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        setInventoryItems(inventoryResponse.data);

        // Fetch suppliers
        const suppliersResponse = await axios.get('http://localhost:8080/suppliers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuppliers(suppliersResponse.data);
      } catch (err) {
        setError('Failed to load data');
        toast.error('Failed to load data');
        console.error(err);
      }
    };
    fetchData();
  }, [searchQuery, categoryFilter, navigate]);

  const handleSearch = useCallback((e) => setSearchQuery(e.target.value), []);
  const handleCategoryChange = useCallback((e) => setCategoryFilter(e.target.value), []);

  const handleAddItem = useCallback(() => {
    setFormData({
      name: '',
      quantity: 0,
      threshold: 0,
      expiryDate: '',
      category: '',
      supplier: suppliers.length > 0 ? { id: suppliers[0].id } : null 
    });
    setIsAddModalOpen(true);
  }, [suppliers]);

  const handleEdit = useCallback((item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      threshold: item.threshold || 0,
      expiryDate: item.expiryDate,
      category: item.category || '',
      supplier: item.supplier ? { id: item.supplier.id } : null
    });
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedItem) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/inventory/${selectedItem.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventoryItems(inventoryItems.filter((item) => item.id !== selectedItem.id));
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
      toast.success('Item deleted successfully');
    } catch (err) {
      toast.error('Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  }, [selectedItem, inventoryItems]);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'supplier' ? value : value
    }));
  }, []);

  const handleFormSubmit = useCallback(
    async (e, isEdit = false) => {
      e.preventDefault();
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        name: formData.name,
        quantity: parseInt(formData.quantity),
        threshold: parseInt(formData.threshold),
        expiryDate: formData.expiryDate,
        category: formData.category,
        supplier: formData.supplier
      };

      try {
        if (isEdit) {
          await axios.put(
            `http://localhost:8080/inventory/${selectedItem.id}`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setInventoryItems(
            inventoryItems.map((item) =>
              item.id === selectedItem.id ? { ...item, ...payload, supplier: suppliers.find(s => s.id === payload.supplier.id) } : item
            )
          );
          toast.success('Item updated successfully');
        } else {
          const response = await axios.post(
            'http://localhost:8080/inventory',
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setInventoryItems([...inventoryItems, response.data]);
          toast.success('Item added successfully');
        }
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
      } catch (err) {
        toast.error(isEdit ? 'Failed to update item' : 'Failed to add item');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, selectedItem, inventoryItems, suppliers]
  );

  const totalItems = inventoryItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = inventoryItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }, [totalPages]);

  return (
    <Layout userName={user.name} userRole={user.role}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
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
        <div className="flex flex-col w-1/2 md:flex-row md:items-center md:space-x-4 mb-6">
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
              <option>Grains</option>
              <option>Pasta</option>
              <option>Canned Goods</option>
              <option>Oils</option>
              <option>Legumes</option>
              <option>Sweeteners</option>
              <option>Baking</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
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
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No items found
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-4 text-gray-800">{item.name}</td>
                    <td className="p-4 text-gray-800">{item.quantity}</td>
                    <td className="p-4 text-gray-800">{item.expiryDate}</td>
                    <td className="p-4 text-gray-800">{item.category}</td>
                    <td className="p-4 text-gray-800">{item.supplier ? item.supplier.name : 'N/A'}</td>
                    {user.role === 'ADMIN' && (
                      <td className="p-4 flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-800"
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

        {/* Pagination Section */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + currentItems.length, totalItems)} of{' '}
            {totalItems} entries
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
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
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

        {/* Modals */}
        <InventoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          isEdit={false}
          formData={formData}
          handleFormChange={handleFormChange}
          handleFormSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          suppliers={suppliers}
        />
        <InventoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          isEdit={true}
          formData={formData}
          handleFormChange={handleFormChange}
          handleFormSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          suppliers={suppliers}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          itemName={selectedItem?.name || ''}
          isDeleting={isDeleting}
        />
      </div>
    </Layout>
  );
};

export default Inventory;