import React, { useState, useContext, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBell, FaShieldAlt, FaPalette, FaGlobe, FaDownload, FaTrash, FaSave, FaTimes, FaUserCircle, FaCamera } from "react-icons/fa";
import ApiService from '../services/api';
import { UserContext } from "../context/UserContext";

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { user, login, logout } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("profile");
  // Profile state
  const [profile, setProfile] = useState(user || {});
  const [profileForm, setProfileForm] = useState({ name: "", bio: "", avatar: null });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const initialFormData = {
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Full-stack developer passionate about creating amazing user experiences.",
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showActivity: true
    }
  };
  const [formData, setFormData] = useState(initialFormData);
  const [userSettings, setUserSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Export and delete handlers
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Import logic
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [importFile, setImportFile] = useState(null);

  // Fetch latest profile on mount only
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      setProfileLoading(true);
      setProfileError("");
      try {
        const data = await ApiService.getUserProfile();
        setProfile(data);
        setProfileForm({ name: data.name || "", bio: data.bio || "", avatar: null });
        setAvatarPreview(data.avatar ? `data:image/*;base64,${data.avatar}` : "");
        login(data, localStorage.getItem("token")); // update context
      } catch (err) {
        setProfileError("Failed to load profile");
      } finally {
        setProfileLoading(false);
      }
    }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // When user changes (context), update profile/form
  useEffect(() => {
    if (user) {
      setProfile(user);
      setProfileForm({ name: user.name || "", bio: user.bio || "", avatar: null });
      setAvatarPreview(user.avatar ? `data:image/*;base64,${user.avatar}` : "");
    }
  }, [user]);

  // Fetch user settings on mount
  useEffect(() => {
    async function fetchSettings() {
      setSettingsLoading(true);
      setSettingsError("");
      try {
        const data = await ApiService.getUserSettings();
        setUserSettings(data);
      } catch (err) {
        setSettingsError("Failed to load notification preferences");
      } finally {
        setSettingsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // Handler for toggles
  const handleSettingsToggle = (key) => {
    setUserSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
    setSettingsSaved(false);
  };
  // Save/cancel handlers
  const handleSettingsSave = async () => {
    setSettingsLoading(true);
    setSettingsError("");
    try {
      const updated = await ApiService.updateUserSettings({ notifications: userSettings.notifications });
      setUserSettings(updated);
      setSettingsSaved(true);
    } catch (err) {
      setSettingsError("Failed to save notification preferences");
    } finally {
      setSettingsLoading(false);
    }
  };
  const handleSettingsCancel = () => {
    setSettingsSaved(false);
    // Refetch from backend to reset
    setSettingsLoading(true);
    setSettingsError("");
    ApiService.getUserSettings().then(data => {
      setUserSettings(data);
      setSettingsLoading(false);
    }).catch(() => {
      setSettingsError("Failed to reload notification preferences");
      setSettingsLoading(false);
    });
  };

  // Handler for privacy toggles and dropdown
  const handlePrivacyChange = (key, value) => {
    setUserSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
    setSettingsSaved(false);
  };
  // Save/cancel handlers for privacy (reuse settings handlers)
  const handlePrivacySave = async () => {
    setSettingsLoading(true);
    setSettingsError("");
    try {
      const updated = await ApiService.updateUserSettings({ privacy: userSettings.privacy });
      setUserSettings(updated);
      setSettingsSaved(true);
    } catch (err) {
      setSettingsError("Failed to save privacy settings");
    } finally {
      setSettingsLoading(false);
    }
  };
  const handlePrivacyCancel = () => {
    setSettingsSaved(false);
    setSettingsLoading(true);
    setSettingsError("");
    ApiService.getUserSettings().then(data => {
      setUserSettings(data);
      setSettingsLoading(false);
    }).catch(() => {
      setSettingsError("Failed to reload privacy settings");
      setSettingsLoading(false);
    });
  };

  // Profile form handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileForm((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const handleProfileSave = async () => {
    setProfileLoading(true);
    setProfileError("");
    try {
      const updateData = { name: profileForm.name, bio: profileForm.bio };
      if (profileForm.avatar) updateData.avatar = profileForm.avatar;
      const updated = await ApiService.updateUserProfile(updateData);
      setProfile(updated);
      login(updated, localStorage.getItem("token")); // update context
      setProfileForm({ name: updated.name || "", bio: updated.bio || "", avatar: null });
      setAvatarPreview(updated.avatar ? `data:image/*;base64,${updated.avatar}` : "");
    } catch (err) {
      setProfileError(err.message || "Profile update failed");
    } finally {
      setProfileLoading(false);
    }
  };
  const handleProfileCancel = () => {
    setProfileForm({ name: profile.name || "", bio: profile.bio || "", avatar: null });
    setAvatarPreview(profile.avatar ? `data:image/*;base64,${profile.avatar}` : "");
    setProfileError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [section, key] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving settings:', formData);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "privacy", label: "Privacy", icon: FaShieldAlt },
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "export", label: "Export Data", icon: FaDownload }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
        <div className="flex flex-col items-center mb-8">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-4"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-gray-400 dark:text-gray-600 mb-4" />
          )}
          <label className="cursor-pointer flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <FaCamera />
            <span>Edit Avatar</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={profileLoading}
            />
          </label>
        </div>
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          {profileError && <div className="text-red-600 dark:text-red-400 text-sm text-center mb-4">{profileError}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              disabled={profileLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email || ""}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white opacity-60 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea
              name="bio"
              rows="3"
              value={profileForm.bio}
              onChange={handleProfileChange}
              disabled={profileLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleProfileCancel}
              className="px-6 py-3 border border-red-300 text-red-600 dark:border-red-500 dark:text-red-400 bg-white dark:bg-gray-800 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center space-x-2"
              disabled={profileLoading}
            >
              <FaTimes className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              type="button"
              onClick={handleProfileSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              disabled={profileLoading}
            >
              <FaSave className="w-4 h-4" />
              <span>{profileLoading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
        {settingsError && <div className="text-red-600 dark:text-red-400 text-sm mb-4">{settingsError}</div>}
        {settingsLoading || !userSettings ? (
          <div className="text-gray-600 dark:text-gray-300 py-8 text-center">Loading notification preferences...</div>
        ) : (
          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Daily Reminders</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get a daily notification for due/overdue tasks</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userSettings.notifications.dailyReminders}
                  onChange={() => handleSettingsToggle('dailyReminders')}
                  className="sr-only peer"
                  disabled={settingsLoading}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">General Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about new tasks, updates, and system messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userSettings.notifications.general}
                  onChange={() => handleSettingsToggle('general')}
                  className="sr-only peer"
                  disabled={settingsLoading}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleSettingsCancel}
                className="px-6 py-3 border border-red-300 text-red-600 dark:border-red-500 dark:text-red-400 bg-white dark:bg-gray-800 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center space-x-2"
                disabled={settingsLoading}
              >
                <FaTimes className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSettingsSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                disabled={settingsLoading}
              >
                <FaSave className="w-4 h-4" />
                <span>{settingsLoading ? "Saving..." : settingsSaved ? "Saved" : "Save Changes"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Privacy Settings</h3>
        {settingsError && <div className="text-red-600 dark:text-red-400 text-sm mb-4">{settingsError}</div>}
        {settingsLoading || !userSettings || !userSettings.privacy ? (
          <div className="text-gray-600 dark:text-gray-300 py-8 text-center">Loading privacy settings...</div>
        ) : (
          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Visibility
              </label>
              <select
                value={userSettings.privacy.profileVisibility}
                onChange={e => handlePrivacyChange('profileVisibility', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={settingsLoading}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Show Email Address</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to see your email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userSettings.privacy.showEmail}
                  onChange={() => handlePrivacyChange('showEmail', !userSettings.privacy.showEmail)}
                  className="sr-only peer"
                  disabled={settingsLoading}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Show Activity Status</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Show when you're online</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userSettings.privacy.showActivity}
                  onChange={() => handlePrivacyChange('showActivity', !userSettings.privacy.showActivity)}
                  className="sr-only peer"
                  disabled={settingsLoading}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Allow Task Assignment</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to assign tasks to you</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userSettings.privacy.allowTaskAssignment}
                  onChange={() => handlePrivacyChange('allowTaskAssignment', !userSettings.privacy.allowTaskAssignment)}
                  className="sr-only peer"
                  disabled={settingsLoading}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handlePrivacyCancel}
                className="px-6 py-3 border border-red-300 text-red-600 dark:border-red-500 dark:text-red-400 bg-white dark:bg-gray-800 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center space-x-2"
                disabled={settingsLoading}
              >
                <FaTimes className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handlePrivacySave}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                disabled={settingsLoading}
              >
                <FaSave className="w-4 h-4" />
                <span>{settingsLoading ? "Saving..." : settingsSaved ? "Saved" : "Save Changes"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Preview</h5>
            <div className={`p-3 rounded border ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                This is how your interface will look with the current theme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleExportData = async () => {
    setExportLoading(true);
    setExportError("");
    try {
      const blob = await ApiService.exportUserData();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user_data.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setExportError("Failed to export data. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleImportFileChange = (e) => {
    setImportFile(e.target.files[0]);
    setImportError("");
    setImportSuccess("");
  };
  const handleImportData = async () => {
    if (!importFile) return;
    setImportLoading(true);
    setImportError("");
    setImportSuccess("");
    try {
      const res = await ApiService.importUserData(importFile);
      setImportSuccess(res.message || "Data imported successfully. Please refresh the page.");
      setImportFile(null);
      // Optionally: window.location.reload();
    } catch (err) {
      setImportError(err.message || "Failed to import data. Please try again.");
    } finally {
      setImportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await ApiService.deleteUserAccount();
      logout();
      navigate('/');
    } catch (err) {
      setDeleteError("Failed to delete account. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderExportTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Management</h3>
        {exportError && <div className="text-red-600 dark:text-red-400 text-sm mb-4">{exportError}</div>}
        {deleteError && <div className="text-red-600 dark:text-red-400 text-sm mb-4">{deleteError}</div>}
        {importError && <div className="text-red-600 dark:text-red-400 text-sm mb-4">{importError}</div>}
        {importSuccess && <div className="text-green-600 dark:text-green-400 text-sm mb-4">{importSuccess}</div>}
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-blue-900/20 border border-blue-400 dark:border-blue-800 rounded-lg">
            <div className="flex items-start">
              <FaDownload className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <div className="w-full">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-700">Export Your Data</h4>
                <p className="text-sm text-blue-700 dark:text-blue-500 mt-1">
                  Download all your tasks, notifications, settings, and profile in JSON format
                </p>
                <button
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700 transition-colors disabled:opacity-60"
                  onClick={handleExportData}
                  disabled={exportLoading}
                >
                  {exportLoading ? 'Exporting...' : 'Export Data'}
                </button>
                {/* Import section */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="file"
                    accept="application/json"
                    onChange={handleImportFileChange}
                    disabled={importLoading}
                    className="block w-full sm:w-auto text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <button
                    type="button"
                    onClick={handleImportData}
                    disabled={!importFile || importLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    {importLoading ? 'Importing...' : 'Import Data'}
                  </button>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Import will overwrite your current data. Only JSON files exported from this app are supported.</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-red-900/20 border border-red-400 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <FaTrash className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-semibold text-red-900 dark:text-red-700">Delete Account</h4>
                <p className="text-sm text-red-700 dark:text-red-500 mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700 transition-colors disabled:opacity-60"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "notifications":
        return renderNotificationsTab();
      case "privacy":
        return renderPrivacyTab();
      case "appearance":
        return renderAppearanceTab();
      case "export":
        return renderExportTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Tabs */}
          <div className="bg-gray-50 dark:bg-gray-900/40 px-2 sm:px-6 pt-4 pb-2 rounded-t-xl shadow-sm">
            <nav className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full sm:w-auto px-5 py-2 rounded-full flex items-center justify-center gap-2 font-semibold text-base shadow-sm transition-all duration-200 border-2 ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            <div className="max-w-2xl mx-auto">
              {renderTabContent()}
              {/* Removed global Save/Cancel buttons here. */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 