import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import ProgramAnalytics from './ProgramAnalytics';
import FacultyPerformance from './FacultyPerformance';
import axios from 'axios';

const DeanDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/admin');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dean-dashboard">
      <Sidebar />
      <div className="dean-content">
        <Routes>
          <Route path="/" element={<Dashboard data={dashboardData} loading={loading} />} />
          <Route path="/programs" element={<ProgramAnalytics />} />
          <Route path="/faculty" element={<FacultyPerformance />} />
        </Routes>
      </div>
    </div>
  );
};

export default DeanDashboard;