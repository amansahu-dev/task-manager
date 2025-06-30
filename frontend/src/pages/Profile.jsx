import React, { useState } from "react";
import { FaUserCircle, FaEnvelope, FaEdit, FaSave } from "react-icons/fa";

export default function Profile() {
  // Mock user data
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Productive developer and task manager enthusiast.",
    avatar: ""
  });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setUser(form);
    setEditing(false);
  };

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex flex-col items-center mb-8">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-4"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-gray-400 dark:text-gray-600 mb-4" />
          )}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {user.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={editing ? form.name : user.name}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${editing ? '' : 'opacity-60 cursor-not-allowed'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={editing ? form.email : user.email}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${editing ? '' : 'opacity-60 cursor-not-allowed'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea
              name="bio"
              value={editing ? form.bio : user.bio}
              onChange={handleChange}
              disabled={!editing}
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
              >
                <FaEdit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <FaSave className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 