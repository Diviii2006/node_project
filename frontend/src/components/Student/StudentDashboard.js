import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import FeedbackForm from './FeedbackForm';
import MyFeedback from './MyFeedback';
import axios from 'axios';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/student');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-dashboard">
      <Sidebar />
      <div className="student-content">
        <Routes>
          <Route path="/" element={<Dashboard data={dashboardData} loading={loading} />} />
          <Route path="/feedback/:subjectId" element={<FeedbackForm />} />
          <Route path="/my-feedback" element={<MyFeedback />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;