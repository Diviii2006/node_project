import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaFilter, FaDownload } from 'react-icons/fa';
import axios from 'axios';

const FeedbackAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    program: '',
    year: '',
    term: '',
    group: '',
    section: ''
  });

  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`/api/feedback/analytics?${params}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="feedback-analytics">
      <div className="page-header">
        <h1>Feedback Analytics</h1>
        <button className="btn-primary">
          <FaDownload /> Export Report
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-controls">
          <select name="program" value={filters.program} onChange={handleFilterChange}>
            <option value="">All Programs</option>
            <option value="B.Tech">B.Tech</option>
            <option value="MCA">MCA</option>
            <option value="MBA">MBA</option>
          </select>

          <select name="year" value={filters.year} onChange={handleFilterChange}>
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          <select name="term" value={filters.term} onChange={handleFilterChange}>
            <option value="">All Terms</option>
            <option value="I">Term I</option>
            <option value="II">Term II</option>
          </select>
        </div>
      </div>

      <div className="chart-card">
        <h3>Subject-wise Average Ratings</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analytics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subjectName" angle={-45} textAnchor="end" height={100} />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="avgOverallSatisfaction" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="analytics-table">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Faculty</th>
              <th>Teaching Quality</th>
              <th>Course Content</th>
              <th>Communication</th>
              <th>Punctuality</th>
              <th>Overall Rating</th>
              <th>Total Feedback</th>
            </tr>
          </thead>
          <tbody>
            {analytics.map((item, index) => (
              <tr key={index}>
                <td>{item.subjectName}</td>
                <td>{item.faculty}</td>
                <td>{item.avgTeachingQuality?.toFixed(1)}</td>
                <td>{item.avgCourseContent?.toFixed(1)}</td>
                <td>{item.avgCommunication?.toFixed(1)}</td>
                <td>{item.avgPunctuality?.toFixed(1)}</td>
                <td>{item.avgOverallSatisfaction?.toFixed(1)}</td>
                <td>{item.totalFeedbacks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackAnalytics;