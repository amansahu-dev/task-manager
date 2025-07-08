import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaPlus, FaFilter, FaSearch, FaCalendar, FaClock, FaFlag, FaCheck, FaTrash, FaEdit, FaTimes } from "react-icons/fa";

const mockTasks = [
  {
    id: 1,
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the new feature",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-01-15",
    category: "Development",
    tags: ["documentation", "project"]
  },
  {
    id: 2,
    title: "Review code changes",
    description: "Review pull request #123 for the authentication module",
    priority: "medium",
    status: "pending",
    dueDate: "2024-01-12",
    category: "Code Review",
    tags: ["review", "authentication"]
  },
  {
    id: 3,
    title: "Update dependencies",
    description: "Update all npm packages to their latest versions",
    priority: "low",
    status: "completed",
    dueDate: "2024-01-10",
    category: "Maintenance",
    tags: ["dependencies", "maintenance"]
  }
];

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
  const [tasks, setTasks] = useState(mockTasks);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
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
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          New Task
        </button>
      </div>

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
              <div key={task.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {task.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <FaCalendar className="w-4 h-4" />
                        <span>{task.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaFlag className={`w-4 h-4 ${priorityColors[task.priority]}`} />
                        <span className={priorityColors[task.priority]}>{task.priority}</span>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400">{task.category}</span>
                    </div>
                    {task.tags.length > 0 && (
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
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <Link
                      to={`/edit-task/${task.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <FaEdit className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
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
    </div>
  );
} 