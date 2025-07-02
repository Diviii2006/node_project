import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaHome, FaUsers, FaBook, FaChartBar, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/admin', icon: FaHome, label: 'Dashboard' },
    { path: '/admin/users', icon: FaUsers, label: 'User Management' },
    { path: '/admin/subjects', icon: FaBook, label: 'Subject Management' },
    { path: '/admin/analytics', icon: FaChartBar, label: 'Analytics' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>FMS Admin</h2>
        <div className="user-info">
          <FaUser className="user-icon" />
          <div>
            <p className="user-name">{user?.name}</p>
            <p className="user-role">Administrator</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <FaSignOutAlt className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;