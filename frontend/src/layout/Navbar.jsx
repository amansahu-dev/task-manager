import React, { useState, useContext } from "react";
import { FaBell, FaUserCircle, FaCog, FaSun, FaMoon, FaBars, FaTimes, FaHome, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, unreadCount } = useContext(UserContext);
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleThemeToggle = () => {
    console.log('Theme toggle clicked, current theme:', isDark ? 'dark' : 'light');
    toggleTheme();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-lg z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TM</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              TaskManager
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <Link
                to="/dashboard"
                className={`p-2 rounded-lg transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}
                aria-label="Home"
              >
                <FaHome className="w-5 h-5" />
              </Link>
            )}
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FaSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <FaMoon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            {/* User-specific icons */}
            {user && (
              <>
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className={`relative p-2 rounded-lg transition-colors ${
                    isActive('/notifications')
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <FaBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                {/* Settings */}
                <Link
                  to="/settings"
                  className={`p-2 rounded-lg transition-colors ${
                    isActive('/settings')
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <FaCog className="w-5 h-5" />
                </Link>
                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      isActive('/profile')
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}
                    aria-label="Profile"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar.startsWith("data:") ? user.avatar : `data:image/*;base64,${user.avatar}`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                      />
                    ) : (
                      <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-base">
                        {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : <FaUserCircle className="w-6 h-6" />}
                      </span>
                    )}
                    <span className="hidden md:inline font-medium">{user.name.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={() => {logout(); navigate("/");}}
                    className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg border border-transparent hover:border-red-400"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isMenuOpen ? (
                <FaTimes className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <FaBars className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-3">
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/dashboard') 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaHome className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/notifications"
                    className={`relative px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                      isActive('/notifications')
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaBell className="w-5 h-5" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/settings"
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/settings')
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaCog className="w-5 h-5" />
                    Settings
                  </Link>
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/profile')
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar.startsWith("data:") ? user.avatar : `data:image/*;base64,${user.avatar}`}
                        alt="Profile"
                        className="w-7 h-7 rounded-full object-cover border-2 border-blue-500"
                      />
                    ) : (
                      <span className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-base">
                        {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : <FaUserCircle className="w-5 h-5" />}
                      </span>
                    )}
                    {user.name}
                  </Link>
                  <div className="flex flex-col space-y-2 pt-2">
                    <button
                      onClick={() => { setIsMenuOpen(false); logout(); navigate("/"); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg border border-transparent hover:border-red-400 text-left"
                    >
                      <FaSignOutAlt className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 