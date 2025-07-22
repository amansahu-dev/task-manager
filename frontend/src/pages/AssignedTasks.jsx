import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from '../services/api';
import { UserContext } from "../context/UserContext";
import { FaArrowLeft, FaCalendar, FaFlag } from "react-icons/fa";

const priorityColors = {
  high: "text-red-600 dark:text-red-400",
  medium: "text-yellow-600 dark:text-yellow-400",
  low: "text-green-600 dark:text-green-400"
};

const statusColors = {
  "in-progress": "bg-blue-600 dark:bg-blue-900 text-white dark:text-blue-200 border border-blue-600 dark:border-blue-700",
  pending: "bg-yellow-500 dark:bg-yellow-900 text-white dark:text-yellow-200 border border-yellow-500 dark:border-yellow-700",
  completed: "bg-green-600 dark:bg-green-900 text-white dark:text-green-200 border border-green-600 dark:border-green-700"
};

export default function AssignedTasks() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    const fetchAssigned = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ApiService.getAssignedTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch assigned tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchAssigned();
  }, [user, navigate]);

  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center mb-6">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assigned To me</h1>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Assigned Tasks</h2>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned By</span>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-lg text-gray-600 dark:text-gray-300">Loading assigned tasks...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-lg text-red-600 dark:text-red-400">{error}</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-6xl mb-4">📥</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No assigned tasks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tasks assigned to you by others will appear here.
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id || task.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  {/* Left: Task Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status?.toLowerCase()]}`}>{task.status?.replace('-', ' ')}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <FaCalendar className="w-4 h-4" />
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaFlag className={`w-4 h-4 ${priorityColors[task.priority]}`} />
                        <span className={priorityColors[task.priority]}>{task.priority}</span>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400">{task.category}</span>
                    </div>
                  </div>
                  {/* Right: User info and status dropdown */}
                  <div className="flex flex-col md:items-end md:pl-8 mt-6 md:mt-0 w-full md:w-auto">
                    {/* User info row */}
                    {task.user && (
                      <div className="flex flex-row items-center gap-3 w-full md:justify-end">
                        {task.user.avatar ? (
                          <img
                            src={task.user.avatar.startsWith('data:') ? task.user.avatar : `data:image/jpeg;base64,${task.user.avatar}`}
                            alt={task.user.name || task.user.email}
                            className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                            {task.user.name
                              ? task.user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
                              : (task.user.email ? task.user.email[0].toUpperCase() : '?')}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{task.user.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{task.user.email}</div>
                        </div>
                      </div>
                    )}
                    {/* Status dropdown row */}
                    <div className="flex items-center gap-2 w-full md:w-auto mt-3 md:justify-end">
                      <label className="text-xs text-gray-500 dark:text-gray-400">Update Status:</label>
                      <select
                        value={task.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          setUpdatingStatusId(task._id || task.id);
                          try {
                            await ApiService.updateTaskStatus(task._id || task.id, newStatus);
                            setTasks(tasks => tasks.map(t =>
                              (t._id === task._id || t.id === task.id) ? { ...t, status: newStatus } : t
                            ));
                          } catch (err) {
                            alert('Failed to update status: ' + (err.message || 'Unknown error'));
                          } finally {
                            setUpdatingStatusId(null);
                          }
                        }}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto"
                        disabled={updatingStatusId === (task._id || task.id)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      {updatingStatusId === (task._id || task.id) && (
                        <span className="ml-2 text-xs text-blue-500">Updating...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 