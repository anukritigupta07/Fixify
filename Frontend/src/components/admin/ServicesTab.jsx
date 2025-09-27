import React from 'react';
import { Activity, Trash2 } from 'lucide-react';

const ServicesTab = ({ services, onDeleteService, onShowAddService }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Activity className="h-6 w-6 mr-2 text-orange-600" />
          Services ({services.length})
        </h3>
        <button
          onClick={onShowAddService}
          className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors duration-300 flex items-center"
        >
          <Activity className="h-4 w-4 mr-2" />
          Add Service
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {services.map((service) => (
          <div key={service._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-lg font-semibold text-gray-900">
                  {service.name}
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {service.category} • ₹{service.price}
                </div>
              </div>
            </div>
            <button
              onClick={() => onDeleteService(service._id)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesTab;