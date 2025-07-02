import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaSearch, FaDownload, FaStar } from 'react-icons/fa';

const FacultyPerformance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const facultyData = [
    {
      name: 'Dr. John Smith',
      program: 'B.Tech CSE',
      subjects: ['Data Structures', 'Algorithms'],
      avgRating: 4.5,
      totalFeedbacks: 45,
      teachingQuality: 4.6,
      communication: 4.4,
      punctuality: 4.5
    },
    {
      name: 'Prof. Sarah Johnson',
      program: 'MCA',
      subjects: ['Database Systems', 'Web Development'],
      avgRating: 4.3,
      totalFeedbacks: 30,
      teachingQuality: 4.4,
      communication: 4.2,
      punctuality: 4.3
    },
    {
      name: 'Dr. Michael Brown',
      program: 'MBA',
      subjects: ['Marketing', 'Business Strategy'],
      avgRating: 4.1,
      totalFeedbacks: 25,
      teachingQuality: 4.0,
      communication: 4.2,
      punctuality: 4.1
    },
    {
      name: 'Prof. Emily Davis',
      program: 'B.Tech IT',
      subjects: ['Software Engineering', 'Project Management'],
      avgRating: 4.4,
      totalFeedbacks: 40,
      teachingQuality: 4.5,
      communication: 4.3,
      punctuality: 4.4
    }
  ];

  const filteredFaculty = facultyData
    .filter(faculty => 
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.program.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return b.avgRating - a.avgRating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'feedbacks') return b.totalFeedbacks - a.totalFeedbacks;
      return 0;
    });

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#10B981';
    if (rating >= 4.0) return '#F59E0B';
    return '#EF4444';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        color={index < Math.floor(rating) ? '#F59E0B' : '#E5E7EB'}
        size={14}
      />
    ));
  };

  return (
    <div className="faculty-performance">
      <div className="page-header">
        <h1>Faculty Performance</h1>
        <button className="btn-primary">
          <FaDownload /> Export Report
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
            <option value="feedbacks">Sort by Feedback Count</option>
          </select>
        </div>
      </div>

      <div className="chart-card">
        <h3>Faculty Performance Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredFaculty}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="avgRating" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="faculty-grid">
        {filteredFaculty.map((faculty, index) => (
          <div key={index} className="faculty-card">
            <div className="faculty-header">
              <h3>{faculty.name}</h3>
              <div className="rating-badge" style={{ backgroundColor: getRatingColor(faculty.avgRating) }}>
                {faculty.avgRating}
              </div>
            </div>

            <div className="faculty-info">
              <p><strong>Program:</strong> {faculty.program}</p>
              <p><strong>Subjects:</strong> {faculty.subjects.join(', ')}</p>
              <p><strong>Total Feedbacks:</strong> {faculty.totalFeedbacks}</p>
            </div>

            <div className="rating-breakdown">
              <div className="rating-item">
                <span>Teaching Quality:</span>
                <div className="stars">
                  {renderStars(faculty.teachingQuality)}
                  <span className="rating-value">{faculty.teachingQuality}</span>
                </div>
              </div>

              <div className="rating-item">
                <span>Communication:</span>
                <div className="stars">
                  {renderStars(faculty.communication)}
                  <span className="rating-value">{faculty.communication}</span>
                </div>
              </div>

              <div className="rating-item">
                <span>Punctuality:</span>
                <div className="stars">
                  {renderStars(faculty.punctuality)}
                  <span className="rating-value">{faculty.punctuality}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyPerformance;