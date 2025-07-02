import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaUsers, FaGraduationCap, FaBook, FaComments, FaChartLine } from 'react-icons/fa';

const Dashboard = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading HOD dashboard...</p>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const statsCards = [
    {
      title: 'Total Students',
      value: data?.totalStudents || 0,
      icon: FaGraduationCap,
      color: '#10B981'
    },
    {
      title: 'Total Subjects',
      value: data?.totalSubjects || 0,
      icon: FaBook,
      color: '#8B5CF6'
    },
    {
      title: 'Feedback Received',
      value: data?.totalFeedbacks || 0,
      icon: FaComments,
      color: '#EF4444'
    },
    {
      title: 'Participation Rate',
      value: '85%',
      icon: FaChartLine,
      color: '#F59E0B'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>HOD Dashboard</h1>
        <p>Department feedback overview and analytics</p>
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
          <h3>Faculty Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.feedbackTrends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id.term" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Subject-wise Feedback Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data?.programStats || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, count }) => `${_id}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(data?.programStats || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;