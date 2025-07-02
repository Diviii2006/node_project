import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FaUniversity, FaChalkboardTeacher, FaGraduationCap, FaChartLine } from 'react-icons/fa';

const Dashboard = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Dean dashboard...</p>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Programs',
      value: '3',
      icon: FaUniversity,
      color: '#3B82F6'
    },
    {
      title: 'Total Faculty',
      value: data?.totalFaculty || 0,
      icon: FaChalkboardTeacher,
      color: '#F59E0B'
    },
    {
      title: 'Total Students',
      value: data?.totalStudents || 0,
      icon: FaGraduationCap,
      color: '#10B981'
    },
    {
      title: 'Overall Satisfaction',
      value: '4.2/5',
      icon: FaChartLine,
      color: '#8B5CF6'
    }
  ];

  const programPerformance = [
    { program: 'B.Tech', avgRating: 4.1, students: 200, faculty: 15 },
    { program: 'MCA', avgRating: 4.3, students: 60, faculty: 8 },
    { program: 'MBA', avgRating: 4.0, students: 40, faculty: 6 }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dean Dashboard</h1>
        <p>Institution-wide academic performance overview</p>
      </div>

      <div className="stats-grid">
        {statsCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ color: card.color }}>
              <card.icon />
            </div>
            <div className="stat-content">
              <h3>{card.value}</h3>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Program-wise Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={programPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="program" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="avgRating" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Feedback Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.feedbackTrends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id.term" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="program-summary">
        <h3>Program Summary</h3>
        <div className="programs-grid">
          {programPerformance.map((program, index) => (
            <div key={index} className="program-card">
              <h4>{program.program}</h4>
              <div className="program-stats">
                <p><strong>Students:</strong> {program.students}</p>
                <p><strong>Faculty:</strong> {program.faculty}</p>
                <p><strong>Avg Rating:</strong> {program.avgRating}/5</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;