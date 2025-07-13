import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center overflow-hidden">
      {/* Enhanced background gradient with radial overlay */}
      <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-blue-200 via-purple-200 via-pink-200 to-yellow-100" />
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{background: "radial-gradient(ellipse at 70% 30%, rgba(186,230,253,0.4) 0%, rgba(236, 72, 153, 0.15) 60%, transparent 100%)"}} />
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full flex flex-col items-center">
        <div className="w-12 h-12 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">TM</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3 text-center">Welcome to Task Manager</h1>
        <p className="text-gray-700 dark:text-gray-300 text-base mb-8 text-center leading-relaxed">
          Organize your work, boost productivity, and never miss a deadline.<br />
          Manage tasks, track progress, and collaborate with your team—all in one place.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <Link
            to="/login"
            className="w-full px-5 py-3 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow hover:from-blue-600 hover:to-purple-700 transition text-center"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-full px-5 py-3 text-base font-semibold rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-center"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
