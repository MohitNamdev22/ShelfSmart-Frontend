import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Reports from './pages/Report';
import Suppliers from './pages/Suppliers';
import UserActivity from './pages/UserActivity';

// Protecting Routes based on the Role ( Admin, User)
const ProtectedRoute = ({ element, allowedRoles }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = JSON.parse(localStorage.getItem('userData'))?.role || 'USER'; 

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (allowedRoles && !allowedRoles.includes(userRole)) {
      navigate('/dashboard');
    }
  }, [token, userRole, allowedRoles, navigate]);
  
  return token && (!allowedRoles || allowedRoles.includes(userRole)) ? element : null;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* Protected Routes - Accessible to USER and ADMIN */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} allowedRoles={['USER', 'ADMIN']} />}
        />
        <Route
          path="/inventory"
          element={<ProtectedRoute element={<Inventory />} allowedRoles={['USER', 'ADMIN']} />}
        />
        <Route
          path="/reports"
          element={<ProtectedRoute element={<Reports />} allowedRoles={['USER', 'ADMIN']} />}
        />
        <Route
          path="/activity"
          element={<ProtectedRoute element={<UserActivity />} allowedRoles={['USER', 'ADMIN']} />}
        />

        {/* Admin Only */}
        <Route
          path="/suppliers"
          element={<ProtectedRoute element={<Suppliers />} allowedRoles={['ADMIN']} />}
        />

        {/* Default and Catch-All Routes */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;