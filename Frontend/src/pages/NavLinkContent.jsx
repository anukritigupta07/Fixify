import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu as MenuIcon, X as XIcon } from "lucide-react";
import { UserDataContext } from "../context/UserContext";
import { UtilityDataContext } from "../context/UtilityContext";
import LiveCity from "../components/LiveCity";

const NavLinkContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserDataContext);
  const { utility, setUtility } = useContext(UtilityDataContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("utilityData");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    
    // Clear context states
    setUser(null);
    setUtility(null);
    setIsMenuOpen(false);
    
    // Navigate without refresh
    navigate("/");
  };

  // ✅ Decide who is logged in (check localStorage for current session type)
  const currentUtilityData = localStorage.getItem('utilityData');
  const currentUserData = localStorage.getItem('userData');
  
  const isProvider = currentUtilityData && utility?.email;
  const isUser = currentUserData && user?.email && !currentUtilityData;

  const WrenchIcon = (props) => (
    <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );

  const MapPinIcon = (props) => (
    <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  return (
    <header className="bg-white/90 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b border-gray-200/50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Enhanced Logo */}
        <div className="text-2xl font-bold flex items-center space-x-3 text-gray-800">
          <div className="p-2 bg-gradient-to-br from-gray-800 to-black rounded-xl shadow-lg">
            <WrenchIcon className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent font-black tracking-tight">Fixify</span>
        </div>

        {/* Enhanced Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center space-x-2">
          <Link to="/" className="px-4 py-2 rounded-xl hover:bg-gray-100 hover:text-gray-800 font-semibold transition-all duration-300 transform hover:scale-105">Home</Link>

          {/* Services only for user or guest (not provider) */}
          {!isProvider && (
            <Link to="/serviceInfo" className="px-4 py-2 rounded-xl hover:bg-gray-100 hover:text-gray-800 font-semibold transition-all duration-300 transform hover:scale-105">Services</Link>
          )}

          {/* Show Dashboard only if normal user logged in */}
          {isUser && (
            <Link to="/dashboard" className="px-4 py-2 rounded-xl hover:bg-gray-100 hover:text-gray-800 font-semibold transition-all duration-300 transform hover:scale-105">Dashboard</Link>
          )}

          {/* Show Provider only if provider logged in */}
          {isProvider && (
            <Link to="/provider-board" className="px-4 py-2 rounded-xl hover:bg-gray-100 hover:text-gray-800 font-semibold transition-all duration-300 transform hover:scale-105">Provider</Link>
          )}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Show LiveCity only if logged in */}
          {(isUser || isProvider) && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4 text-gray-500" />
              <Link to="/choose-address" className="font-medium"><LiveCity /></Link>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
          )}

          {isUser || isProvider ? (
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-xl hover:shadow-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-xl hover:bg-gray-100 hover:text-gray-800 font-semibold transition-all duration-300">Login</Link>
              <Link to="/signup" className="bg-gradient-to-r from-gray-800 to-black text-white px-6 py-2 rounded-xl hover:shadow-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-gray-100">
            {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-200/50 animate-fade-in-down">
          <div className="flex flex-col items-start p-6 space-y-3">
            <Link to="/" className="w-full py-3 px-4 rounded-xl hover:bg-gray-100 hover:text-gray-800 font-semibold transition-all duration-300">Home</Link>

            {/* Services only if not provider */}
            {!isProvider && (
              <Link to="/serviceInfo" className="w-full py-3 px-4 rounded-xl hover:bg-gray-100 hover:text-gray-800 font-semibold transition-all duration-300">Services</Link>
            )}

            {/* User only */}
            {isUser && (
              <Link to="/dashboard" className="w-full py-3 px-4 rounded-xl hover:bg-gray-100 hover:text-gray-800 font-semibold transition-all duration-300">Dashboard</Link>
            )}

            {/* Provider only */}
            {isProvider && (
              <Link to="/provider-board" className="w-full py-3 px-4 rounded-xl hover:bg-gray-100 hover:text-gray-800 font-semibold transition-all duration-300">Provider</Link>
            )}

            <div className="pt-4 mt-4 border-t border-gray-200 w-full">
              {isUser || isProvider ? (
                <button onClick={handleLogout} className="w-full text-left py-3 px-4 rounded-xl hover:bg-red-50 hover:text-red-600 font-semibold transition-all duration-300">Logout</button>
              ) : (
                <>
                  <Link to="/login" className="w-full py-3 px-4 rounded-xl hover:bg-gray-100 hover:text-gray-800 font-semibold transition-all duration-300">Login</Link>
                  <Link to="/signup" className="w-full text-center bg-gradient-to-r from-gray-800 to-black text-white px-4 py-3 rounded-xl hover:shadow-lg font-semibold transition-all duration-300 mt-2">Register</Link>
                </>
              )}
            </div>

            {(isUser || isProvider) && (
              <div className="flex items-center space-x-2 pt-4 text-gray-600">
                <MapPinIcon className="w-4 h-4 text-gray-500" />
                <span className="font-medium"><LiveCity /></span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavLinkContent;
