import React, { useState, useEffect } from 'react';
import './ResidentDashboard.css'; // Import CSS file
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User } from 'lucide-react';

const ResidentDashboard = () => {
  const { user, logout } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestMessage, setLatestMessage] = useState(null);
  const [topCommunityIssues, setTopCommunityIssues] = useState([]);
  const [privateIssues, setPrivateIssues] = useState([]);
  const [communityName, setCommunityName] = useState('');

  // Fetch community name when user is available
  useEffect(() => {
    const fetchCommunityName = async () => {
      if (!user?.community) return;
      
      try {
        const response = await api.get(`/communities/${user.community}`);
        setCommunityName(response.data.name);
      } catch (error) {
        console.error('Error fetching community:', error);
      }
    };

    fetchCommunityName();
  }, [user]);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get('/announcements/community');
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  // Fetch latest communication
  useEffect(() => {
    const fetchLatestMessage = async () => {
      try {
        const response = await api.get('/communication/latest');
        setLatestMessage(response.data);
      } catch (error) {
        console.error('Error fetching latest message:', error);
      }
    };

    fetchLatestMessage();
  }, []);

  // Fetch top community issues
  useEffect(() => {
    const fetchTopIssues = async () => {
      try {
        const response = await api.get('/issues/community?sort=popular');
        setTopCommunityIssues(response.data);
      } catch (error) {
        console.error('Error fetching top issues:', error);
      }
    };

    fetchTopIssues();
  }, []);

  // Fetch private issues
  useEffect(() => {
    const fetchPrivateIssues = async () => {
      try {
        const response = await api.get('/issues/my?type=private');
        setPrivateIssues(response.data.slice(0, 5)); // Show latest 5
      } catch (error) {
        console.error('Error fetching private issues:', error);
      }
    };

    fetchPrivateIssues();
  }, []);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (announcements.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="dashboard">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Left side: Profile */}
          <div className="navbar-left">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <div className="profile-icon">
                <User size={32} />
              </div>
            )}
            <span className="user-name">{user?.name || 'Loading...'}</span>
          </div>

          {/* Right side: Community name and logout */}
          <div className="navbar-right">
            <span className="community-name">{communityName}</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Announcement Carousel */}
        <div className="card announcement-card">
          <h2 className="card-title">Announcements</h2>
          {announcements.length > 0 ? (
            <div className="carousel">
              <div
                className="carousel-inner"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {announcements.map((announcement, index) => (
                  <div key={announcement._id} className="carousel-slide">
                    <div className="announcement-content">
                      <h3 className="announcement-title">
                        {announcement.title}
                      </h3>
                      <p className="announcement-description">
                        {announcement.description}
                      </p>
                      {announcement.category === 'event' && (
                        <div className="event-badge">
                          <span>💬</span>
                          <span>Chat</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="no-data">No announcements available</p>
          )}

          {/* Dot Indicators */}
          {announcements.length > 1 && (
            <div className="dots">
              {announcements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Latest Communication */}
        <div className="card communication-card">
          <h2 className="card-title">Latest Communication</h2>
          {latestMessage ? (
            <div className="communication-content">
              {latestMessage.sender.avatar ? (
                <img
                  src={latestMessage.sender.avatar}
                  alt={latestMessage.sender.name}
                  className="avatar"
                />
              ) : (
                <div className="avatar-icon">
                  <User size={24} />
                </div>
              )}
              <div className="communication-details">
                <div className="communication-header">
                  <span className="sender-name">
                    {latestMessage.sender.name}
                  </span>
                  <span className="timestamp">
                    {formatTimestamp(latestMessage.timestamp)}
                  </span>
                </div>
                <p className="message-preview">
                  {latestMessage.preview}
                </p>
              </div>
            </div>
          ) : (
            <p className="no-data">No recent communications</p>
          )}
        </div>

        {/* Issues Grid */}
        <div className="issues-grid">
          {/* Private Issues */}
          <div className="card issues-card">
            <h2 className="card-title">My Private Issues</h2>
            <div className="issues-list">
              {privateIssues.length > 0 ? privateIssues.map((issue, index) => (
                <div key={issue._id} className="issue-item">
                  <div className="issue-content">
                    <h3 className="issue-title">
                      {issue.title}
                    </h3>
                    <div className="issue-meta">
                      <span className={`status-badge ${issue.status.replace(' ', '-')}`}>
                        {issue.status}
                      </span>
                      <span className="issue-date">
                        {formatTimestamp(issue.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="no-data">No private issues</p>
              )}
            </div>
          </div>

          {/* Top Community Issues */}
          <div className="card issues-card">
            <h2 className="card-title">Top Community Issues</h2>
            <div className="issues-list">
              {topCommunityIssues.slice(0, window.innerWidth < 1024 ? 3 : 5).map((issue, index) => (
                <div key={issue._id} className="issue-item">
                  <div className="issue-content">
                    <h3 className="issue-title">
                      {issue.title}
                    </h3>
                    <div className="issue-meta">
                      <span className="upvotes">
                        👍 {issue.upvotes?.length || 0}
                      </span>
                      <span className={`status-badge ${issue.status.replace(' ', '-')}`}>
                        {issue.status}
                      </span>
                      <span className="issue-category">
                        {issue.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
