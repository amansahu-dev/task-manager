import React from "react";
import { FaBell, FaUserCircle, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-50 flex items-center justify-between px-8 py-4">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        TaskManager
      </Link>
      <div className="flex items-center gap-6">
        <button className="relative">
          <FaBell className="text-xl text-gray-600 hover:text-blue-600" />
          <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-1">3</span>
        </button>
        <button>
          <FaCog className="text-xl text-gray-600 hover:text-blue-600" />
        </button>
        <button>
          <FaUserCircle className="text-xl text-gray-600 hover:text-blue-600" />
        </button>
        <Link to="/login" className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Login</Link>
        <Link to="/signup" className="px-4 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition">Sign Up</Link>
      </div>
    </nav>
  );
} 