import React from 'react';
import { Users, Wrench, Calendar, Activity } from 'lucide-react';

const DashboardStats = ({ stats }) => {
  const statItems = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { title: 'Total Providers', value: stats.totalProviders, icon: Wrench, color: 'from-green-500 to-emerald-500' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'from-purple-500 to-pink-500' },
    { title: 'Active Providers', value: stats.activeProviders, icon: Activity, color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center">
              <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-black text-gray-900">{stat.value || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Activity className="h-6 w-6 mr-2 text-green-600" />
          Active Providers by Category
        </h3>
        <div className="space-y-6">
          {stats.activeProvidersByCategory?.map((category, index) => {
            const colors = [
              'from-blue-500 to-blue-600',
              'from-green-500 to-green-600', 
              'from-purple-500 to-purple-600',
              'from-orange-500 to-orange-600'
            ];
            return (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className={`bg-gradient-to-r ${colors[index % colors.length]} p-4`}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center">
                      <Wrench className="h-6 w-6 mr-3" />
                      <div>
                        <h4 className="text-lg font-bold capitalize">{category._id}</h4>
                        <p className="text-sm opacity-90">{category.count} Active Providers</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 divide-y divide-gray-200">
                  {category.providers?.map((provider, providerIndex) => (
                    <div key={providerIndex} className="p-4 hover:bg-white transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-900">{provider.name}</p>
                            <p className="text-xs text-gray-600">{provider.email}</p>
                            <p className="text-xs text-gray-500">{provider.contact} • {provider.experience} years exp</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {(!stats.activeProvidersByCategory || stats.activeProvidersByCategory.length === 0) && (
          <div className="text-center text-gray-500 py-8">
            No active providers found
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;