import React from 'react';
import { LogOut, WrenchIcon } from 'lucide-react';

const AdminHeader = ({ onLogout }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold flex items-center space-x-3 text-gray-800">
              <div className="p-2 bg-gradient-to-br from-gray-800 to-black rounded-xl shadow-lg">
                <WrenchIcon className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent font-black tracking-tight">Fixify</span>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;