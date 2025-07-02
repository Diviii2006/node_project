import { Link } from 'react-router-dom';
import { FaBook, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const Dashboard = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const { student, feedbackStatus, totalSubjects, submittedCount, pendingCount } = data || {};

  const statsCards = [
    {
      title: 'Total Subjects',
      value: totalSubjects || 0,
      icon: FaBook,
      color: '#3B82F6'
    },
    {
      title: 'Feedback Submitted',
      value: submittedCount || 0,
      icon: FaCheckCircle,
      color: '#10B981'
    },
    {
      title: 'Pending Feedback',
      value: pendingCount || 0,
      icon: FaClock,
      color: '#F59E0B'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {student?.name}!</h1>
        <p>Track your feedback submission progress</p>
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

      <div className="subjects-section">
        <h2>Your Subjects</h2>
        <div className="subjects-grid">
          {feedbackStatus?.map((item) => (
            <div key={item.subject._id} className={`subject-card ${item.submitted ? 'completed' : 'pending'}`}>
              <div className="subject-header">
                <h3>{item.subject.name}</h3>
                <div className="subject-status">
                  {item.submitted ? (
                    <FaCheckCircle className="status-icon completed" />
                  ) : (
                    <FaClock className="status-icon pending" />
                  )}
                </div>
              </div>
              
              <div className="subject-info">
                <p><strong>Code:</strong> {item.subject.code}</p>
                <p><strong>Faculty:</strong> {item.subject.faculty}</p>
                <p><strong>Credits:</strong> {item.subject.credits}</p>
              </div>

              <div className="subject-actions">
                {item.submitted ? (
                  <div className="feedback-submitted">
                    <span>Feedback Submitted</span>
                    <small>on {new Date(item.submittedAt).toLocaleDateString()}</small>
                  </div>
                ) : (
                  <Link 
                    to={`/student/feedback/${item.subject._id}`}
                    className="btn-primary"
                  >
                    Give Feedback
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="pending-reminder">
          <FaExclamationTriangle className="reminder-icon" />
          <div>
            <h3>Reminder</h3>
            <p>You have {pendingCount} pending feedback submissions. Please complete them soon!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;