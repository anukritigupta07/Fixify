import React from "react";
import { X, CreditCard, Wallet } from "lucide-react";

const PaymentModal = ({ onClose, onSelectPayment }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-[#0047AB] to-[#10B981] p-5 flex justify-between items-center">
          <h2 className="text-white font-bold text-xl">Choose Payment Method</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <button
            onClick={() => onSelectPayment("Cash")}
            className="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <Wallet className="w-5 h-5 text-green-600" />
            <span className="text-lg font-semibold text-gray-800">Cash on Service</span>
          </button>

          <button
            onClick={() => onSelectPayment("UPI")}
            className="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">Pay via UPI</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
