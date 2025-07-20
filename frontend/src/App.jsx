import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Navbar from "./layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import EditTask from "./pages/EditTask";
import Notifications from "./pages/Notifications";
import NewTask from "./pages/NewTask";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import RecentlyDeleted from "./pages/RecentlyDeleted";
import AssignedTasks from "./pages/AssignedTasks";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const { forceUpdate } = useTheme();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300" key={forceUpdate}>
        <Navbar />
        <div className="pt-20 px-4 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/edit-task/:id" element={<EditTask />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/new-task" element={<NewTask />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recently-deleted" element={<RecentlyDeleted />} />
            <Route path="/assigned-tasks" element={<AssignedTasks />} />
          </Routes>
        </div>
      </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        {/* ToastContainer for global toasts */}
        <ToastContainer />
        <AppContent />
    </Router>
    </ThemeProvider>
  );
}

export default App;