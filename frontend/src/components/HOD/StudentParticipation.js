import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { FaUsers, FaCheckCircle, FaClock } from 'react-icons/fa';
import axios from 'axios';

const StudentParticipation = () => {
  const [participationData, setParticipationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParticipationData();
  }, []);

  const fetchParticipationData = async () => {
    try {
      // Mock data for demonstration
      const mockData = {
        totalStudents: 150,
        submittedFeedback: 120,
        pendingFeedback: 30,
        participationRate: 80,
        programWise: [
          { program: 'B.Tech CSE', total: 60, submitted: 50, pending: 10 },
          { program: 'B.Tech IT', total: 45, submitted: 35, pending: 10 },
          { program: 'MCA', total: 30, submitted: 25, pending: 5 },
          { program: 'MBA', total: 15, submitted: 10, pending: 5 }
        ]
      };
      setParticipationData(mockData);
    } catch (error) {
      console.error('Failed to fetch participation data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading participation data...</p>
      </div>
    );
  }

  const COLORS = ['#10B981', '#F59E0B'];
  const pieData = [
    { name: 'Submitted', value: participationData.submittedFeedback },
    { name: 'Pending', value: participationData.pendingFeedback }
  ];

  return (
    <div className="student-participation">
      <div className="page-header">
        <h1>Student Participation</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#3B82F6' }}>
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{participationData.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#10B981' }}>
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{participationData.submittedFeedback}</h3>
            <p>Feedback Submitted</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#F59E0B' }}>
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>{participationData.pendingFeedback}</h3>
            <p>Pending Feedback</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#8B5CF6' }}>
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{participationData.participationRate}%</h3>
            <p>Participation Rate</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Overall Participation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Program-wise Participation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={participationData.programWise}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="program" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="submitted" fill="#10B981" name="Submitted" />
              <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StudentParticipation;