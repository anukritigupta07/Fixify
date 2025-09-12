import React from "react";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="font-sans antialiased bg-gray-100 text-gray-900 min-h-screen">
      <Start />
    </div>
  );
}

// Start Page
function Start() {
  const title = "Welcome to Fixify";
  const subtitle = "Your one-stop solution for smart utility & service management.";
  const bgImage =
    "https://images.unsplash.com/photo-1579546929940-0259b3f9b233?auto=format&fit=crop&w=1650&q=80";

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-md" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-3xl shadow-xl animate-slideUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-purple-500/10 shadow-md animate-pulse-slow-light">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-12 h-12 text-purple-600"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77a1 1 0 0 0 0 1.4z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="text-gray-600 mt-3 text-lg">{subtitle}</p>
        </div>

        {/* Buttons */}
        <div className="space-y-4 ">
          <Link to="/login">
            <button className="w-full py-3 mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="w-full py-3 rounded-full border border-gray-400 text-gray-600 font-medium text-lg hover:bg-gray-200 transition duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(2rem); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideUp { animation: slideUp 0.8s ease-out; }

          @keyframes pulse-slow-light {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.2); }
            50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(147, 51, 234, 0); }
          }
          .animate-pulse-slow-light { animation: pulse-slow-light 3s infinite; }
        `}
      </style>
    </div>
  );
}
