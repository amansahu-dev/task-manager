import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaPlus, FaFilter, FaSearch, FaCalendar, FaClock, FaFlag, FaCheck, FaTrash, FaEdit, FaTimes } from "react-icons/fa";
import ApiService from '../services/api';
import { UserContext } from "../context/UserContext";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ApiService.getTasks();
        console.log(data);
        setTasks(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user, navigate]);

  // Calculate filtered tasks before stats
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats always reflect all tasks, not filtered
  const stats = [
    {
      title: "Total Tasks",
      count: tasks.length,
      gradient: "from-blue-500 to-blue-600",
      icon: "📋"
    },
    {
      title: "In Progress",
      count: tasks.filter(task => task.status === "in-progress").length,
      gradient: "from-yellow-500 to-orange-500",
      icon: "⏳"
    },
    {
      title: "Completed",
      count: tasks.filter(task => task.status === "completed").length,
      gradient: "from-green-500 to-green-600",
      icon: "✅"
    },
    {
      title: "Pending",
      count: tasks.filter(task => task.status === "pending").length,
      gradient: "from-purple-500 to-purple-600",
      icon: "⏰"
    }
  ];

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingStatusId(taskId);
    try {
      const updatedTask = await ApiService.updateTask(taskId, { status: newStatus });
      setTasks(tasks => tasks.map(task =>
        (task._id === taskId || task.id === taskId) ? { ...task, status: updatedTask.status } : task
      ));
    } catch (err) {
      alert('Failed to update status: ' + (err.message || 'Unknown error'));
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId && task.id !== taskId));
  };

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, User!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <button
          onClick={() => navigate('/new-task')}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          New Task
        </button>
      </div>

      {/* Loading/Error State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-lg text-gray-600 dark:text-gray-300">Loading tasks...</span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-lg text-red-600 dark:text-red-400">{error}</span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.count}
                    </p>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredTasks.length} of {tasks.length} tasks
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTasks.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No tasks found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm || filterStatus !== "all" 
                      ? "Try adjusting your search or filters"
                      : "Create your first task to get started"
                    }
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task._id || task.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status?.toLowerCase()]}`}>
                            {task.status?.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {task.description}
                        </p>
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
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center space-x-2 mt-3">
                            {task.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id || task.id, e.target.value)}
                          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={updatingStatusId === (task._id || task.id)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <Link
                          to={`/edit-task/${task._id || task.id}`}
                          state={task}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          <FaEdit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteTask(task._id || task.id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 