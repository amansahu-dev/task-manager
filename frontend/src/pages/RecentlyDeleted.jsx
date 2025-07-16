import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from '../services/api';
import { UserContext } from "../context/UserContext";
import { FaTrashRestore, FaTrashAlt, FaArrowLeft } from "react-icons/fa";

export default function RecentlyDeleted() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    const fetchDeleted = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ApiService.getDeletedTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch deleted tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchDeleted();
  }, [user, navigate]);

  const handleRestore = async (taskId) => {
    setActionId(taskId);
    try {
      await ApiService.restoreTask(taskId);
      setTasks(tasks => tasks.filter(task => task._id !== taskId && task.id !== taskId));
    } catch (err) {
      alert('Failed to restore: ' + (err.message || 'Unknown error'));
    } finally {
      setActionId(null);
    }
  };

  const handlePermanentDelete = async (taskId) => {
    if (!window.confirm('Permanently delete this task? This cannot be undone.')) return;
    setActionId(taskId);
    try {
      await ApiService.permanentlyDeleteTask(taskId);
      setTasks(tasks => tasks.filter(task => task._id !== taskId && task.id !== taskId));
    } catch (err) {
      alert('Failed to delete: ' + (err.message || 'Unknown error'));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recently Deleted Tasks</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          {loading ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-300">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 dark:text-red-400">{error}</div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">🗑️</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No recently deleted tasks</h3>
              <p className="text-gray-600 dark:text-gray-400">Deleted tasks will appear here for restoration or permanent removal.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {tasks.map(task => (
                <li key={task._id || task.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{task.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{task.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRestore(task._id || task.id)}
                      disabled={actionId === (task._id || task.id)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
                    >
                      <FaTrashRestore className="w-4 h-4" />
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(task._id || task.id)}
                      disabled={actionId === (task._id || task.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
                    >
                      <FaTrashAlt className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 