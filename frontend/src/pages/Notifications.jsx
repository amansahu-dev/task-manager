import React, { useState, useEffect, useContext } from "react";
import { FaBell, FaCheck, FaTrash, FaClock, FaInfoCircle, FaUser } from "react-icons/fa";
import ApiService from '../services/api';
import { UserContext } from '../context/UserContext';

function getNotificationIcon(type) {
  switch (type) {
    case 'task':
      return <FaUser className="text-blue-600 dark:text-blue-400 w-5 h-5" />;
    case 'reminder':
      return <FaClock className="text-yellow-600 dark:text-yellow-400 w-5 h-5" />;
    case 'update':
      return <FaCheck className="text-green-600 dark:text-green-400 w-5 h-5" />;
    case 'system':
      return <FaInfoCircle className="text-purple-600 dark:text-purple-400 w-5 h-5" />;
    default:
      return <FaBell className="text-gray-600 dark:text-gray-400 w-5 h-5" />;
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'high':
      return 'text-red-600 dark:text-red-400 font-bold';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400 font-semibold';
    case 'low':
      return 'text-green-600 dark:text-green-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const { resetUnread } = useContext(UserContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ApiService.getNotifications();
        setNotifications(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Reset unread count when visiting notifications page
  useEffect(() => {
    resetUnread();
  }, [resetUnread]);

  const markAsRead = async (id) => {
    try {
      await ApiService.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      alert('Failed to mark as read: ' + (err.message || 'Unknown error'));
    }
  };

  const deleteNotification = async (id) => {
    try {
      await ApiService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      alert('Failed to delete notification: ' + (err.message || 'Unknown error'));
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications.filter(n => !n.read).map(n => ApiService.markNotificationAsRead(n._id))
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      alert('Failed to mark all as read: ' + (err.message || 'Unknown error'));
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all notifications? This cannot be undone.')) return;
    try {
      setLoading(true);
      await ApiService.clearAllNotifications();
      setNotifications([]);
    } catch (err) {
      setError('Failed to clear notifications: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
              disabled={loading || notifications.length === 0}
            >
              Mark all as read
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
              disabled={loading || notifications.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All notifications</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="task">Tasks</option>
              <option value="reminder">Reminders</option>
              <option value="update">Updates</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <span className="text-lg text-gray-600 dark:text-gray-300">Loading notifications...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <span className="text-lg text-red-600 dark:text-red-400">{error}</span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <FaBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "all" 
                  ? "You're all caught up!" 
                  : `No ${filter} notifications found`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {notification.title || 'Notification'}
                      </h3>
                      {notification.priority && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(notification.priority)} border-current bg-gray-100 dark:bg-gray-700/50`}>
                          {notification.priority.toUpperCase()}
                        </span>
                      )}
                      {notification.type && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border border-current bg-gray-50 dark:bg-gray-800/50 ${
                          notification.type === 'system' ? 'text-purple-600 border-purple-600' :
                          notification.type === 'task' ? 'text-blue-600 border-blue-600' :
                          notification.type === 'reminder' ? 'text-yellow-600 border-yellow-600' :
                          notification.type === 'update' ? 'text-green-600 border-green-600' :
                          'text-gray-600 border-gray-600'
                        }`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                      )}
                      {!notification.read && (
                        <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 