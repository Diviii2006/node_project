import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import FeedbackAnalytics from './FeedbackAnalytics';
import StudentParticipation from './StudentParticipation';
import axios from 'axios';

const HODDashboard = () => {
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
    <div className="hod-dashboard">
      <Sidebar />
      <div className="hod-content">
        <Routes>
          <Route path="/" element={<Dashboard data={dashboardData} loading={loading} />} />
          <Route path="/analytics" element={<FeedbackAnalytics />} />
          <Route path="/participation" element={<StudentParticipation />} />
        </Routes>
      </div>
    </div>
  );
};

export default HODDashboard;