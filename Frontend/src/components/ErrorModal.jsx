import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-scaleIn">
        <div className="bg-gradient-to-r from-[#0047AB] to-[#10B981] p-5 flex justify-between items-center">
          <h2 className="text-white font-bold text-xl">Error</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-center">
          <AlertCircle className="w-16 h-16 text-blue-600 mx-auto" />
          <p className="text-lg text-gray-700 font-medium">{message}</p>
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0047AB] to-[#10B981] hover:from-[#003B9A] hover:to-[#0E9A6F] transition-all"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
