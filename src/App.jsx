import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Reports from './pages/Report';
import Suppliers from './pages/Suppliers';
import UserActivity from './pages/UserActivity';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/activity" element={<UserActivity />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  </Router>
  );
}

export default App;