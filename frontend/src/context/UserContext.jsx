import React, { createContext, useState, useEffect } from "react";
import socket from '../services/socket';
import { toast } from 'react-toastify';
import { FaBell, FaCheck, FaClock, FaInfoCircle, FaUser } from 'react-icons/fa';

export const UserContext = createContext();

function getNotificationIcon(type, priority) {
  switch (type) {
    case 'task':
      return <FaUser className="text-blue-600 dark:text-blue-400 w-5 h-5 mr-2" />;
    case 'reminder':
      return <FaClock className="text-yellow-600 dark:text-yellow-400 w-5 h-5 mr-2" />;
    case 'update':
      return <FaCheck className="text-green-600 dark:text-green-400 w-5 h-5 mr-2" />;
    case 'system':
      return <FaInfoCircle className="text-purple-600 dark:text-purple-400 w-5 h-5 mr-2" />;
    default:
      return <FaBell className="text-gray-600 dark:text-gray-400 w-5 h-5 mr-2" />;
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

function NotificationToast({ notification }) {
  return (
    <div className="flex items-start gap-3">
      {getNotificationIcon(notification.type, notification.priority)}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {notification.title || 'Notification'}
          </span>
          {notification.priority && (
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(notification.priority)} border-current bg-gray-100 dark:bg-gray-700/50`}>
              {notification.priority.toUpperCase()}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-200 mt-1">
          {notification.message}
        </div>
        {notification.type === 'system' && (
          <div className="text-xs text-purple-500 mt-1">System Notification</div>
        )}
        {notification.type === 'task' && (
          <div className="text-xs text-blue-500 mt-1">Task Notification</div>
        )}
        {notification.type === 'reminder' && (
          <div className="text-xs text-yellow-500 mt-1">Reminder</div>
        )}
        {notification.type === 'update' && (
          <div className="text-xs text-green-500 mt-1">Update</div>
        )}
      </div>
    </div>
  );
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [profileFetched, setProfileFetched] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [user, token]);

  useEffect(() => {
    if (user && user._id && token) {
      console.log('[Socket] Connecting and registering user:', user._id);
      socket.connect();
      socket.emit('register', user._id);
      socket.on('connect', () => {
        console.log('[Socket] Connected:', socket.id);
      });
      socket.on('disconnect', () => {
        console.log('[Socket] Disconnected');
      });
    } else {
      console.log('[Socket] Disconnecting (no user or token)');
      socket.disconnect();
    }
    // Clean up listeners on unmount or user/token change
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [user, token]);

  // Global notification handler for real-time notifications
  useEffect(() => {
    const handleNotification = (notification) => {

      setUnreadCount((c) => c + 1);
      toast(
        <NotificationToast notification={notification} />, {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: { minWidth: 320, minHeight: 60 },
        }
      );
    };
    socket.on('notification', handleNotification);
    return () => {
      socket.off('notification', handleNotification);
    };
  }, []);

  const incrementUnread = () => {
    console.log('[Notification] Increment unread count');
    setUnreadCount((c) => c + 1);
  };
  const resetUnread = () => {
    console.log('[Notification] Reset unread count');
    setUnreadCount(0);
  };

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    setProfileFetched(false); // Ensure profile is fetched after login
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setProfileFetched(false);
    setUnreadCount(0);
    socket.disconnect();
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, profileFetched, setProfileFetched, unreadCount, setUnreadCount, incrementUnread, resetUnread }}>
      {children}
    </UserContext.Provider>
  );
}

export { socket }; 