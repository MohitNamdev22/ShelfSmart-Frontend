import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';

function App() {
  const userName = 'Jane Doe'; // Placeholder; fetch from token later
  const userRole = 'ADMIN'; // Placeholder; fetch from token later

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <main className="flex-1">  
            <Routes>
              <Route path="/" element={<Login />} />
               <Route path="/register" element={<Registration />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              {/*<Route path="/add-item" element={<AddItem />} />
              <Route path="/edit-item/:id" element={<EditItem />} />
              <Route path="/reports" element={<Reports />} /> */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;