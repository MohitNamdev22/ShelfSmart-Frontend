import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ userName, userRole, children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar userRole={userRole} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar userName={userName} userRole={userRole} />

        {/* Main Content */}
        <main className="flex-1 p-6 mt-16 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;