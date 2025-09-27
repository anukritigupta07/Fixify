import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTabs from '../components/admin/AdminTabs';
import DashboardStats from '../components/admin/DashboardStats';
import UsersTab from '../components/admin/UsersTab';
import ProvidersTab from '../components/admin/ProvidersTab';
import ServicesTab from '../components/admin/ServicesTab';
import BookingsTab from '../components/admin/BookingsTab';
import FeedbackTab from '../components/admin/FeedbackTab';
import AdminModals from '../components/admin/AdminModals';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [statsRes, usersRes, providersRes, bookingsRes, servicesRes] = await Promise.all([
        axios.get('http://localhost:4000/admin/dashboard', config),
        axios.get('http://localhost:4000/admin/users', config),
        axios.get('http://localhost:4000/admin/providers', config),
        axios.get('http://localhost:4000/admin/bookings', config),
        axios.get('http://localhost:4000/admin/services', config)
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setProviders(providersRes.data.providers);
      setBookings(bookingsRes.data.bookings);
      setServices(servicesRes.data.services);

      // Fetch feedback separately to avoid breaking main dashboard
      try {
        const feedbackRes = await axios.get('http://localhost:4000/feedback/all', config);
        setFeedback(feedbackRes.data.feedback || []);
      } catch (feedbackError) {
        console.error('Error fetching feedback:', feedbackError);
        setFeedback([]);
      }
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

  const addUser = async (userData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:4000/admin/users', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers([...users, response.data.user]);
      setShowAddUser(false);
      alert('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user');
    }
  };

  const addProvider = async (providerData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:4000/admin/providers', providerData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProviders([...providers, response.data.provider]);
      setShowAddProvider(false);
      alert('Provider added successfully!');
    } catch (error) {
      console.error('Error adding provider:', error);
      alert('Error adding provider');
    }
  };

  const addService = async (serviceData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:4000/admin/services', serviceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices([...services, response.data.service]);
      setShowAddService(false);
      alert('Service added successfully!');
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Error adding service');
    }
  };

  const deleteService = async (serviceId) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:4000/admin/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(services.filter(service => service._id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const editService = (service) => {
    setEditingService(service);
    setShowEditService(true);
  };

  const updateService = async (serviceData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`http://localhost:4000/admin/services/${editingService._id}`, serviceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(services.map(service => 
        service._id === editingService._id ? response.data.service : service
      ));
      setShowEditService(false);
      setEditingService(null);
      alert('Service updated successfully!');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Error updating service');
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
      <AdminHeader onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'dashboard' && <DashboardStats stats={stats} />}

        {activeTab === 'users' && (
          <UsersTab 
            users={users} 
            onDeleteUser={deleteUser} 
            onShowAddUser={() => setShowAddUser(true)} 
          />
        )}

        {activeTab === 'providers' && (
          <ProvidersTab 
            providers={providers} 
            onDeleteProvider={deleteProvider} 
            onShowAddProvider={() => setShowAddProvider(true)} 
          />
        )}

        {activeTab === 'services' && (
          <ServicesTab 
            services={services} 
            onDeleteService={deleteService} 
            onShowAddService={() => setShowAddService(true)} 
          />
        )}

        {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}

        {activeTab === 'feedback' && <FeedbackTab feedback={feedback} />}

        <AdminModals 
          showAddUser={showAddUser} setShowAddUser={setShowAddUser} addUser={addUser}
          showAddProvider={showAddProvider} setShowAddProvider={setShowAddProvider} addProvider={addProvider}
          showAddService={showAddService} setShowAddService={setShowAddService} addService={addService}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;