import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Wrench,WrenchIcon, Calendar, Activity, Trash2, LogOut, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [statsRes, usersRes, providersRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:4000/admin/dashboard', config),
        axios.get('http://localhost:4000/admin/users', config),
        axios.get('http://localhost:4000/admin/providers', config),
        axios.get('http://localhost:4000/admin/bookings', config)
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setProviders(providersRes.data.providers);
      setBookings(bookingsRes.data.bookings);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:4000/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const deleteProvider = async (providerId) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:4000/admin/providers/${providerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProviders(providers.filter(provider => provider._id !== providerId));
    } catch (error) {
      console.error('Error deleting provider:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex justify-center items-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
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
                onClick={logout}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'providers', label: 'Providers', icon: Wrench },
              { id: 'bookings', label: 'Bookings', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Stats */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-500' },
                { title: 'Total Providers', value: stats.totalProviders, icon: Wrench, color: 'from-green-500 to-emerald-500' },
                { title: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'from-purple-500 to-pink-500' },
                { title: 'Active Providers', value: stats.activeProviders, icon: Activity, color: 'from-orange-500 to-red-500' }
              ].map((stat, index) => (
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

            {/* Active Providers by Category */}
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
                      {/* Category Header */}
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
                      
                      {/* Providers List */}
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
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                Users ({users.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-gray-900">
                        {user.fullname.firstname} {user.fullname.lastname}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Wrench className="h-6 w-6 mr-2 text-green-600" />
                Providers ({providers.length})
              </h3>
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
                    onClick={() => deleteProvider(provider._id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-purple-600" />
                Bookings ({bookings.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <div key={booking._id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-lg font-semibold text-gray-900 capitalize">
                          {booking.category}
                        </div>
                        <div className="text-sm text-gray-600">
                          User: {booking.userId?.fullname?.firstname} {booking.userId?.fullname?.lastname}
                        </div>
                        <div className="text-sm text-gray-600">
                          Provider: {booking.providerId?.fullname?.firstname} {booking.providerId?.fullname?.lastname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;