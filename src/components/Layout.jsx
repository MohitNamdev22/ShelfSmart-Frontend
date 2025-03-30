import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ userName, userRole, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      <div className={`fixed inset-y-0 z-50 md:relative ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          userRole={userRole} 
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

       {/* Main Content Area */}
       <div className="flex-1 flex flex-col min-w-0"> 
        <Navbar 
          userName={userName} 
          userRole={userRole}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        />

        {/* Main Content - Responsive Padding */}
        <main className={`flex-1 p-4 md:p-6 ${
          isMobile ? 'mt-16' : 'mt-0 md:ml-64'
        } transition-all duration-300`}>
          <div className="bg-gray-100 rounded-lg shadow-xs p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;