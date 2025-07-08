import React, { useState, useContext, useEffect } from "react";
import { FaUserCircle, FaEnvelope, FaEdit, FaSave, FaCamera } from "react-icons/fa";
import api from "../services/api";
import { UserContext } from "../context/UserContext";

export default function Profile() {
  const { user, login } = useContext(UserContext);
  const [profile, setProfile] = useState(user || {});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", avatar: null });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch latest profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await api.getUserProfile();
        setProfile(data);
        setForm({ name: data.name || "", bio: data.bio || "", avatar: null });
        setAvatarPreview(data.avatar ? `data:image/*;base64,${data.avatar}` : "");
        login(data, localStorage.getItem("token")); // update context
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // When user changes (context), update profile/form
  useEffect(() => {
    if (user) {
      setProfile(user);
      setForm({ name: user.name || "", bio: user.bio || "", avatar: null });
      setAvatarPreview(user.avatar ? `data:image/*;base64,${user.avatar}` : "");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const updateData = { name: form.name, bio: form.bio };
      if (form.avatar) updateData.avatar = form.avatar;
      const updated = await api.updateUserProfile(updateData);
      setProfile(updated);
      login(updated, localStorage.getItem("token")); // update context
      setEditing(false);
      setAvatarPreview(updated.avatar ? `data:image/*;base64,${updated.avatar}` : "");
    } catch (err) {
      setError(err.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
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
          {editing && (
            <label className="cursor-pointer flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
              <FaCamera />
              <span>Edit Avatar</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={loading}
              />
            </label>
          )}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {profile.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
        </div>
        <form className="space-y-6" onSubmit={e => e.preventDefault()}>
          {error && <div className="text-red-600 dark:text-red-400 text-sm text-center mb-4">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={editing ? form.name : profile.name}
              onChange={handleChange}
              disabled={!editing || loading}
              className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${editing ? '' : 'opacity-60 cursor-not-allowed'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white opacity-60 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea
              name="bio"
              value={editing ? form.bio : profile.bio || ""}
              onChange={handleChange}
              disabled={!editing || loading}
              rows="3"
              className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${editing ? '' : 'opacity-60 cursor-not-allowed'}`}
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4">
            {!editing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                disabled={loading}
              >
                <FaEdit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                disabled={loading}
              >
                <FaSave className="w-4 h-4" />
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 