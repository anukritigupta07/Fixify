import React from 'react';
import { Wrench, Trash2 } from 'lucide-react';

const ProvidersTab = ({ providers, onDeleteProvider, onShowAddProvider }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Wrench className="h-6 w-6 mr-2 text-green-600" />
          Providers ({providers.length})
        </h3>
        <button
          onClick={onShowAddProvider}
          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center"
        >
          <Wrench className="h-4 w-4 mr-2" />
          Add Provider
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {providers.map((provider) => (
          <div key={provider._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-lg font-semibold text-gray-900">
                  {provider.fullname.firstname} {provider.fullname.lastname}
                </div>
                <div className="text-sm text-gray-600">{provider.email}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {provider.profession} • {provider.experience} years
                </div>
                <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  provider.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {provider.status}
                </div>
              </div>
            </div>
            <button
              onClick={() => onDeleteProvider(provider._id)}
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

export default ProvidersTab;