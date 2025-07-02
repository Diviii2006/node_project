import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import SubjectManagement from './SubjectManagement';
import FeedbackAnalytics from './FeedbackAnalytics';
import axios from 'axios';

const AdminDashboard = () => {
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
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Dashboard data={dashboardData} loading={loading} />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/subjects" element={<SubjectManagement />} />
          <Route path="/analytics" element={<FeedbackAnalytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;