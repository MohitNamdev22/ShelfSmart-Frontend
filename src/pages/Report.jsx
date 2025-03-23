import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import Layout from '../components/Layout';
import { FiFileText, FiDownload, FiCalendar } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Reports() {
  const [user, setUser] = useState({ name: 'Loading...', role: 'USER' });
  const [dailyMovements, setDailyMovements] = useState([]);
  const [weeklyMovements, setWeeklyMovements] = useState([]);
  const [customMovements, setCustomMovements] = useState([]);
  const [dailyLatestTimestamp, setDailyLatestTimestamp] = useState('N/A');
  const [weeklyLatestTimestamp, setWeeklyLatestTimestamp] = useState('N/A');
  const [startDate, setStartDate] = useState('2024-07-22'); // Default start date
  const [endDate, setEndDate] = useState('2025-03-23'); // Default end date
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Initial load (daily/weekly)
  const [customLoading, setCustomLoading] = useState(false); // Custom report load
  const [isDownloading, setIsDownloading] = useState({
    daily: false,
    weekly: false,
    custom: false,
  });

  // Fetch daily and weekly reports on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        const userData = localStorage.getItem('userData');
        setUser(userData ? JSON.parse(userData) : { name: 'Loading...', role: 'USER' });

        const [dailyResponse, weeklyResponse] = await Promise.all([
          axios.get('http://localhost:8080/reports/daily', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8080/reports/weekly', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const dailyData = Papa.parse(dailyResponse.data, { header: true }).data;
        const weeklyData = Papa.parse(weeklyResponse.data, { header: true }).data;

        setDailyMovements(dailyData);
        setWeeklyMovements(weeklyData);

        if (dailyData.length > 0) {
          const latestDaily = dailyData.reduce((latest, movement) =>
            new Date(movement.Timestamp) > new Date(latest.Timestamp) ? movement : latest
          );
          setDailyLatestTimestamp(new Date(latestDaily.Timestamp).toLocaleString());
        }

        if (weeklyData.length > 0) {
          const latestWeekly = weeklyData.reduce((latest, movement) =>
            new Date(movement.Timestamp) > new Date(latest.Timestamp) ? movement : latest
          );
          setWeeklyLatestTimestamp(new Date(latestWeekly.Timestamp).toLocaleString());
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports');
        toast.error('Failed to load reports');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch custom report when startDate or endDate changes
  useEffect(() => {
    const fetchCustomReport = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      setCustomLoading(true); // Start loading
      try {
        const response = await axios.get('http://localhost:8080/reports/custom', {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate, endDate },
        });

        const customData = Papa.parse(response.data, { header: true }).data;
        setCustomMovements(customData); // Update table data
      } catch (err) {
        console.error('Error fetching custom report:', err);
        toast.error('Failed to load custom report');
      } finally {
        setCustomLoading(false); // Stop loading
      }
    };

    fetchCustomReport();
  }, [startDate, endDate]);

  const handleDownload = async (movements, fileName, type) => {
    if (!movements || movements.length === 0) {
      toast.error('No data available to download');
      return;
    }

    setIsDownloading((prev) => ({ ...prev, [type]: true }));

    try {
      const headers = 'MovementId,ItemId,ItemName,QuantityChanged,MovementType,Timestamp';
      const rows = movements.map((movement) => {
        return [
          movement.MovementId || '',
          movement.ItemId || '',
          `"${movement.ItemName?.replace(/"/g, '""') || ''}"`,
          movement.QuantityChanged || 0,
          movement.MovementType || '',
          movement.Timestamp || '',
        ].join(',');
      });

      const csvContent = `${headers}\n${rows.join('\n')}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report');
    } finally {
      setIsDownloading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDailyReportDownload = () => handleDownload(dailyMovements, 'Daily_Stock_Report', 'daily');
  const handleWeeklyReportDownload = () => handleDownload(weeklyMovements, 'Weekly_Stock_Report', 'weekly');
  const handleCustomReportDownload = () => handleDownload(customMovements, 'Custom_Stock_Report', 'custom');

  return (
    <Layout userName={user.name} userRole={user.role}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
          <p className="text-gray-500">View and manage your stock reports</p>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <FiFileText className="text-blue-500 text-3xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">Daily Report</h3>
              <p className="text-gray-500">Download the latest daily stock report</p>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handleDailyReportDownload}
                  disabled={isDownloading.daily || isLoading || dailyMovements.length === 0}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isDownloading.daily ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <FiDownload className="mr-2" />
                      Download Report
                    </>
                  )}
                </button>
                <p className="text-gray-500 text-sm">
                  Last generated: {isLoading ? 'Loading...' : dailyMovements.length > 0 ? dailyLatestTimestamp : 'No data'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
            <FiFileText className="text-blue-500 text-3xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">Weekly Report</h3>
              <p className="text-gray-500">Download the comprehensive weekly report</p>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handleWeeklyReportDownload}
                  disabled={isDownloading.weekly || isLoading || weeklyMovements.length === 0}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isDownloading.weekly ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <FiDownload className="mr-2" />
                      Download Report
                    </>
                  )}
                </button>
                <p className="text-gray-500 text-sm">
                  Last generated: {isLoading ? 'Loading...' : weeklyMovements.length > 0 ? weeklyLatestTimestamp : 'No data'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Report Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Report</h3>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
            <div className="relative mb-4 md:mb-0">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative mb-4 md:mb-0">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCustomReportDownload}
              disabled={isDownloading.custom || customLoading || customMovements.length === 0}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isDownloading.custom ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <FiDownload className="mr-2" />
                  Download Custom Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stock Movements Table */}
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-left">
                <th className="p-4">Movement ID</th>
                <th className="p-4">Item Name</th>
                <th className="p-4">Quantity Changed</th>
                <th className="p-4">Movement Type</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Item ID</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    <div className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : customLoading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    <div className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Fetching custom report...
                    </div>
                  </td>
                </tr>
              ) : customMovements.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No movements found for the selected date range
                  </td>
                </tr>
              ) : (
                customMovements.map((movement) => (
                  <tr key={movement.MovementId} className="border-t">
                    <td className="p-4 text-gray-800">{movement.MovementId}</td>
                    <td className="p-4 text-gray-800">{movement.ItemName}</td>
                    <td className="p-4 text-gray-800">{movement.QuantityChanged}</td>
                    <td className="p-4 text-gray-800">{movement.MovementType}</td>
                    <td className="p-4 text-gray-800">{new Date(movement.Timestamp).toLocaleString()}</td>
                    <td className="p-4 text-gray-800">{movement.ItemId}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Reports;