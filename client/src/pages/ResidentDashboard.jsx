import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const ResidentDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestMessage, setLatestMessage] = useState(null);
  const [topCommunityIssues, setTopCommunityIssues] = useState([]);
  const [privateIssues, setPrivateIssues] = useState([]);

  // Placeholder data - replace with actual user/community from context or props
  const user = {
    name: 'John Doe',
    profileImage: 'https://via.placeholder.com/40',
  };
  const communityName = 'Green Valley Community';

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/announcements/community', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
        }
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
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/communication/latest', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setLatestMessage(data);
        }
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
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/issues/community?sort=popular', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTopCommunityIssues(data);
        }
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
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/issues/my?type=private', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPrivateIssues(data.slice(0, 5)); // Show latest 5
        }
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side: Profile */}
            <div className="flex items-center space-x-3">
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              />
              <span className="text-lg font-semibold text-gray-900">{user.name}</span>
            </div>

            {/* Right side: Community name */}
            <div className="text-lg font-medium text-gray-700">
              {communityName}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Announcement Carousel */}
          <div className="bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Announcements</h2>
            {announcements.length > 0 ? (
              <div className="relative h-32 sm:h-24 overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {announcements.map((announcement, index) => (
                    <div key={announcement._id} className="w-full flex-shrink-0">
                      <div className="relative">
                        <h3 className="font-semibold text-gray-900 text-lg sm:text-xl truncate">
                          {announcement.title}
                        </h3>
                        <p className="text-gray-600 mt-2 line-clamp-2 text-sm sm:text-base">
                          {announcement.description}
                        </p>
                        {announcement.category === 'event' && (
                          <div className="absolute bottom-0 right-0 flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                            <MessageCircle size={14} />
                            <span>Chat</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No announcements available</p>
            )}

            {/* Dot Indicators */}
            {announcements.length > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* General Communication Thread Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:scale-[1.01] transition-transform duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Communication</h2>
            {latestMessage ? (
              <div className="flex items-start space-x-3">
                <img
                  src={latestMessage.sender.avatar}
                  alt={latestMessage.sender.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900 text-sm">
                      {latestMessage.sender.name}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatTimestamp(latestMessage.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {latestMessage.preview}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent communications</p>
            )}
          </div>

          {/* Issues Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Private Issues */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">My Private Issues</h2>
              <div className="space-y-3">
                {privateIssues.length > 0 ? privateIssues.map((issue, index) => (
                  <div key={issue._id}>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                          {issue.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            issue.status === 'open' ? 'bg-red-100 text-red-800' :
                            issue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {issue.status}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatTimestamp(issue.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < privateIssues.length - 1 && (
                      <hr className="border-gray-200 my-2" />
                    )}
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">No private issues</p>
                )}
              </div>
            </div>

            {/* Top Community Issues */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Community Issues</h2>
              <div className="space-y-3">
                {topCommunityIssues.slice(0, window.innerWidth < 1024 ? 3 : 5).map((issue, index) => (
                  <div key={issue._id}>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                          {issue.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-gray-600 text-xs flex items-center">
                            👍 {issue.upvotes?.length || 0}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            issue.status === 'open' ? 'bg-red-100 text-red-800' :
                            issue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {issue.status}
                          </span>
                          <span className="text-gray-500 text-xs capitalize">
                            {issue.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < (window.innerWidth < 1024 ? 2 : 4) && (
                      <hr className="border-gray-200 my-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
