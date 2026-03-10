import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  FolderOpen, 
  MessageSquare, 
  Settings, 
  Bell,
  CheckCircle,
  AlertCircle,
  Plus,
  User,
  LogOut,
  Play,
  Users,
  Clock,
  Search,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useRoomStore } from '../store/roomStore';
import CreateRoomModal from '../components/CreateRoomModal';
import toast from 'react-hot-toast';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, verifyToken } = useAuthStore();
  const { rooms, fetchRooms } = useRoomStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const init = async () => {
      const isValid = await verifyToken();
      if (!isValid) {
        navigate('/login');
      }
    };
    init();
  }, [verifyToken, navigate]);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      fetchRooms(token);
    }
  }, [user, fetchRooms]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Active Projects', value: 5, icon: FolderOpen, color: '#00d9ff' },
    { label: 'Open Tasks', value: 12, icon: CheckCircle, color: '#00ff88' },
    { label: 'New Messages', value: 3, icon: MessageSquare, color: '#ffaa00' },
    { label: 'Pending Issues', value: 1, icon: AlertCircle, color: '#ff4466' }
  ];

  const recentActivity = [
    { id: 1, icon: AlertCircle, text: 'Opened Ticket', detail: 'Cbnccs paten 1081', time: '2 hours ago', color: '#ffaa00' },
    { id: 2, icon: CheckCircle, text: 'Completed task "Design Login Page" in Project Alpha', detail: 'Sccessparen Fra 6200', time: '5 hours ago', color: '#00ff88' },
    { id: 3, icon: Code2, text: 'Pushed a new commit to API Integration', detail: 'Uploaded comity 1082', time: '1 day ago', color: '#00d9ff' },
    { id: 4, icon: FolderOpen, text: 'Created new project Beta Application', detail: 'Uploaded fattial fime 206', time: '2 days ago', color: '#0099ff' },
    { id: 5, icon: Play, text: 'Uploaded initial files to Project Gamma', detail: 'Uploaded fattial fime 206', time: '3 days ago', color: '#00d9ff' }
  ];

  const tasks = [
    { id: 1, text: 'Fix bug in user authentication flow', done: false },
    { id: 2, text: 'Review code for Project Beta', done: true },
    { id: 3, text: 'Write documentation for API', done: false },
    { id: 4, text: 'Prepare report for Project Alpha', done: false }
  ];

  const quickLinks = [
    { icon: Plus, text: 'Start a New Project', onClick: () => toast('Feature coming soon!') },
    { icon: FolderOpen, text: 'View All Projects', onClick: () => toast('Feature coming soon!') },
    { icon: MessageSquare, text: 'Message Center', onClick: () => toast('Feature coming soon!') },
    { icon: Settings, text: 'Account Settings', onClick: () => toast('Feature coming soon!') }
  ];

  if (!user) {
    return <div className="loading-screen"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="dashboard-page">
      <div className="cosmic-bg"></div>

      {/* Navbar */}
      <nav className="dashboard-nav glass-card">
        <div className="nav-left">
          <div className="nav-logo">
            <Code2 size={28} strokeWidth={2.5} />
            <span>CodeLabs</span>
          </div>
          <div className="nav-links">
            <button className="nav-link active">
              <Play size={18} />
              Dashboard
            </button>
            <button className="nav-link">
              <FolderOpen size={18} />
              Projects
            </button>
            <button className="nav-link">
              <MessageSquare size={18} />
              Messages
            </button>
            <button className="nav-link">
              <Settings size={18} />
              Settings
            </button>
          </div>
        </div>
        <div className="nav-right">
          <div className="nav-user-info">
            <span>Welcome, <strong>{user.username}</strong>!</span>
          </div>
          <button className="icon-btn">
            <Bell size={20} />
            <span className="notification-badge">2</span>
          </button>
          <div className="user-avatar">
            <img src={user.avatar} alt={user.username} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Section */}
          <div className="welcome-section">
            <div>
              <h1 className="page-title">Welcome Back, {user.username}!</h1>
              <p className="page-subtitle">Here are your latest updates</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="stat-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                  <stat.icon size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="main-grid">
            {/* Recent Activity */}
            <motion.div
              className="activity-section glass-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="section-header">
                <h2>Recent Activity</h2>
                <button className="view-all-btn">View All →</button>
              </div>
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="activity-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                  >
                    <div className="activity-icon" style={{ background: `${activity.color}20`, color: activity.color }}>
                      <activity.icon size={18} />
                    </div>
                    <div className="activity-content">
                      <p className="activity-text">{activity.text}</p>
                      <p className="activity-detail">{activity.detail}</p>
                    </div>
                    <div className="activity-time">{activity.time}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tasks & Quick Links */}
            <div className="sidebar-sections">
              {/* Tasks */}
              <motion.div
                className="tasks-section glass-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="section-header">
                  <h2>Your Tasks</h2>
                  <button className="view-all-btn">View All →</button>
                </div>
                <div className="tasks-list">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      className={`task-item ${task.done ? 'done' : ''}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                    >
                      <div className="task-checkbox">
                        {task.done && <CheckCircle size={16} />}
                      </div>
                      <span>{task.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                className="quick-links-section glass-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h2>Quick Links</h2>
                <div className="quick-links-grid">
                  {quickLinks.map((link, index) => (
                    <motion.button
                      key={link.text}
                      className="quick-link-btn"
                      onClick={link.onClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                    >
                      <link.icon size={20} />
                      <span>{link.text}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="help-section">
                  <h3>Need help?</h3>
                  <button className="help-btn">
                    <MessageSquare size={16} />
                    Visit our Help Center
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Live Rooms Section */}
          <motion.div
            className="rooms-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="section-header-large">
              <div>
                <h2>Live Coding Rooms</h2>
                <p>Join or create a collaborative coding session</p>
              </div>
              <div className="rooms-actions">
                <div className="search-bar">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')}>
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button 
                  className="btn-primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={18} />
                  Create Room
                </button>
              </div>
            </div>

            <div className="rooms-grid">
              {filteredRooms.length === 0 ? (
                <div className="no-rooms">
                  <Users size={48} />
                  <p>No active rooms found</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create Your First Room
                  </button>
                </div>
              ) : (
                filteredRooms.map((room, index) => (
                  <motion.div
                    key={room.roomId}
                    className="room-card glass-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="room-header">
                      <h3>{room.name}</h3>
                      <span className={`badge badge-${room.roomType === 'public' ? 'success' : 'warning'}`}>
                        {room.roomType}
                      </span>
                    </div>
                    <p className="room-description">{room.description || 'No description'}</p>
                    <div className="room-info">
                      <div className="room-stat">
                        <Users size={16} />
                        <span>{room.participants?.length || 0} / {room.maxParticipants}</span>
                      </div>
                      <div className="room-stat">
                        <Clock size={16} />
                        <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="room-features">
                      {room.enabledFeatures?.codeSharing && <span className="feature-tag">Code</span>}
                      {room.enabledFeatures?.videoMeeting && <span className="feature-tag">Video</span>}
                      {room.enabledFeatures?.musicPlaylist && <span className="feature-tag">Music</span>}
                    </div>
                    <button 
                      className="btn-primary join-btn"
                      onClick={() => handleJoinRoom(room.roomId)}
                    >
                      <Play size={16} />
                      Join Room
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateRoomModal onClose={() => setShowCreateModal(false)} />
        )}
      </AnimatePresence>

      {/* Logout Button (Fixed) */}
      <motion.button
        className="logout-btn glass-card"
        onClick={handleLogout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <LogOut size={20} />
      </motion.button>
    </div>
  );
}

export default Dashboard;
