import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FaFilter, FaDownload, FaChartBar } from 'react-icons/fa';
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

  const exportReport = () => {
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Subject,Faculty,Teaching Quality,Course Content,Communication,Punctuality,Overall Rating,Total Feedbacks\n"
      + analytics.map(item => 
          `${item.subjectName},${item.faculty},${item.avgTeachingQuality?.toFixed(1)},${item.avgCourseContent?.toFixed(1)},${item.avgCommunication?.toFixed(1)},${item.avgPunctuality?.toFixed(1)},${item.avgOverallSatisfaction?.toFixed(1)},${item.totalFeedbacks}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "feedback_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <button className="btn-primary" onClick={exportReport}>
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

          {filters.program === 'B.Tech' && (
            <input
              type="text"
              name="group"
              placeholder="Group (e.g., CSE)"
              value={filters.group}
              onChange={handleFilterChange}
            />
          )}

          {(filters.program === 'MCA' || filters.program === 'MBA') && (
            <input
              type="text"
              name="section"
              placeholder="Section (e.g., A)"
              value={filters.section}
              onChange={handleFilterChange}
            />
          )}
        </div>
      </div>

      {analytics.length === 0 ? (
        <div className="empty-state">
          <FaChartBar size={48} color="#64748b" />
          <h3>No Feedback Data Available</h3>
          <p>No feedback has been submitted yet for the selected filters.</p>
        </div>
      ) : (
        <>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Subject-wise Overall Satisfaction</h3>
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

            <div className="chart-card">
              <h3>Teaching Quality vs Communication</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subjectName" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="avgTeachingQuality" stroke="#10B981" strokeWidth={2} name="Teaching Quality" />
                  <Line type="monotone" dataKey="avgCommunication" stroke="#F59E0B" strokeWidth={2} name="Communication" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="analytics-table">
            <h3>Detailed Analytics</h3>
            <div className="table-container">
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
                      <td>
                        <span className={`rating-badge ${item.avgTeachingQuality >= 4 ? 'good' : item.avgTeachingQuality >= 3 ? 'average' : 'poor'}`}>
                          {item.avgTeachingQuality?.toFixed(1)}
                        </span>
                      </td>
                      <td>
                        <span className={`rating-badge ${item.avgCourseContent >= 4 ? 'good' : item.avgCourseContent >= 3 ? 'average' : 'poor'}`}>
                          {item.avgCourseContent?.toFixed(1)}
                        </span>
                      </td>
                      <td>
                        <span className={`rating-badge ${item.avgCommunication >= 4 ? 'good' : item.avgCommunication >= 3 ? 'average' : 'poor'}`}>
                          {item.avgCommunication?.toFixed(1)}
                        </span>
                      </td>
                      <td>
                        <span className={`rating-badge ${item.avgPunctuality >= 4 ? 'good' : item.avgPunctuality >= 3 ? 'average' : 'poor'}`}>
                          {item.avgPunctuality?.toFixed(1)}
                        </span>
                      </td>
                      <td>
                        <span className={`rating-badge ${item.avgOverallSatisfaction >= 4 ? 'good' : item.avgOverallSatisfaction >= 3 ? 'average' : 'poor'}`}>
                          {item.avgOverallSatisfaction?.toFixed(1)}
                        </span>
                      </td>
                      <td>{item.totalFeedbacks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedbackAnalytics;