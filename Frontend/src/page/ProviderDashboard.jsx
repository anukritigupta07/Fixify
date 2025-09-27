import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { UtilityDataContext } from "../context/UtilityContext";
import NavLinkContent from "../pages/NavLinkContent";
import { 
  User, 
  MapPin, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Power, 
  TrendingUp,
  Briefcase,
  Phone
} from "lucide-react";

const socket = io("http://localhost:4000");

export default function ProviderDashboard() {
  const { utility: provider, isLoading: providerLoading } = useContext(UtilityDataContext);
  const [bookings, setBookings] = useState([]);
  const providerId = provider?._id;

  // Provider status state
  const [status, setStatus] = useState("inactive");

  // Fetch provider status
  useEffect(() => {
    if (!providerId) return;
    
    const fetchProviderStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/utilities/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStatus(response.data.utility.status || "inactive");
      } catch (err) {
        console.error("❌ Failed to fetch provider status:", err);
      }
    };
    
    fetchProviderStatus();
  }, [providerId]);

  // Fetch bookings and setup socket
  useEffect(() => {
    if (!providerId) return;

    socket.emit("registerProvider", providerId);

    axios
      .get(`http://localhost:4000/bookings/provider/${providerId}`)
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => console.error("❌ Fetch bookings failed:", err));

    const handleNewBooking = (booking) => {
      if (booking.providerId === providerId) {
        setBookings((prev) => [booking, ...prev]);
      }
    };

    const handleBookingCancelled = (data) => {
      setBookings((prev) => prev.filter(b => b._id !== data.bookingId));
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    socket.on("newBooking", handleNewBooking);
    socket.on("bookingCancelled", handleBookingCancelled);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("newBooking", handleNewBooking);
      socket.off("bookingCancelled", handleBookingCancelled);
      socket.off("disconnect", handleDisconnect);
    };
  }, [providerId]);

  // Update booking status
  const updateBookingStatus = async (bookingId, action) => {
    try {
      console.log(`🔄 Updating booking ${bookingId} with action: ${action}`);
      const response = await axios.post(`http://localhost:4000/bookings/${bookingId}/action`, { action });
      console.log('✅ Response:', response.data);
      
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: response.data.booking.status, providerId: response.data.booking.providerId } : b))
      );
    } catch (err) {
      console.error("❌ Failed to update booking:", err);
      alert('Failed to update booking status. Please try again.');
    }
  };

  // Toggle provider active/inactive
  const toggleProviderStatus = async () => {
    const newStatus = status === "active" ? "inactive" : "active";

    try {
      const res = await axios.patch(
        `http://localhost:4000/utilities/${providerId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setStatus(res.data.utility.status);
    } catch (err) {
      console.error("❌ Failed to update provider status:", err);
    }
  };

  if (providerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <NavLinkContent />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate booking stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    rejected: bookings.filter(b => b.status === 'rejected').length
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NavLinkContent />
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Profile Section */}
        <div className="mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-gray-800 to-black rounded-2xl shadow-lg mr-6">
                    <Briefcase className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">
                      Welcome, {provider?.fullname?.firstname || 'Provider'}!
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span className="font-semibold">{provider?.profession || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="font-medium">{provider?.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Status Toggle */}
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center px-4 py-3 rounded-2xl font-bold text-white shadow-lg ${
                    status === "active" 
                      ? "bg-gradient-to-r from-green-600 to-green-700" 
                      : "bg-gradient-to-r from-red-600 to-red-700"
                  }`}>
                    <Power className="w-5 h-5 mr-2" />
                    {status.toUpperCase()}
                  </div>
                  <button
                    onClick={toggleProviderStatus}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                      status === "active"
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg"
                        : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg"
                    }`}
                  >
                    {status === "active" ? "Go Inactive" : "Go Active"}
                  </button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border border-gray-300/50">
                  <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                  <div className="text-sm text-gray-600 font-medium">Total</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl border border-yellow-300/50">
                  <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
                  <div className="text-sm text-yellow-700 font-medium">Pending</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl border border-green-300/50">
                  <div className="text-2xl font-bold text-green-800">{stats.confirmed}</div>
                  <div className="text-sm text-green-700 font-medium">Confirmed</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl border border-blue-300/50">
                  <div className="text-2xl font-bold text-blue-800">{stats.completed}</div>
                  <div className="text-sm text-blue-700 font-medium">Completed</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl border border-red-300/50">
                  <div className="text-2xl font-bold text-red-800">{stats.rejected}</div>
                  <div className="text-sm text-red-700 font-medium">Rejected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-8 h-8 mr-3 text-gray-700" />
              Service Requests
            </h2>
          </div>
          
          {bookings.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center border border-gray-300/50">
                  <Calendar className="w-12 h-12 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No service requests yet</h3>
                <p className="text-gray-600 mb-8">When customers book your services, they'll appear here for you to manage.</p>
                <div className="text-sm text-gray-500">
                  Make sure your status is <span className="font-semibold text-green-600">ACTIVE</span> to receive bookings
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="group bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-6 hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl shadow-lg mr-4">
                        <Briefcase className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{b.category}</h3>
                        <p className="text-sm text-gray-500">Service Request</p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`flex items-center px-3 py-2 rounded-full text-sm font-bold ${
                      b.status === "pending"
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700"
                        : b.status === "confirmed"
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
                        : b.status === "completed"
                        ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700"
                        : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700"
                    }`}>
                      {getStatusIcon(b.status)}
                      <span className="ml-2 capitalize">{b.status}</span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-200/50">
                    <div className="flex items-center mb-3">
                      <User className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="font-semibold text-gray-800">Customer:</span>
                    </div>
                    <p className="text-gray-900 font-medium ml-6 mb-2">
                      {b.userId?.fullname.firstname} {b.userId?.fullname.lastname}
                    </p>
                    <div className="flex items-center ml-6 mb-2">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 text-sm">{b.userId?.email}</span>
                    </div>
                    <div className="flex items-center ml-6 mb-2">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 text-sm">{b.userId?.phone}</span>
                    </div>
                    <div className="flex items-center ml-6 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 text-sm">{b.location}</span>
                    </div>
                    {b.preferredDate && (
                      <div className="flex items-center ml-6 mb-2">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 text-sm">{b.preferredDate}</span>
                      </div>
                    )}
                    {b.preferredTime && (
                      <div className="flex items-center ml-6">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 text-sm">{b.preferredTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {b.status === "pending" && (
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-300/50">
                      <button
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-2xl hover:shadow-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                        onClick={() => updateBookingStatus(b._id, "accept")}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Accept
                      </button>
                      <button
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-2xl hover:shadow-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                        onClick={() => updateBookingStatus(b._id, "reject")}
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        Reject
                      </button>
                    </div>
                  )}
                  
                  {b.status === "confirmed" && (
                    <div className="mt-6 pt-4 border-t border-gray-300/50 space-y-3">
                      <button className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 px-4 rounded-2xl hover:shadow-lg font-bold transition-all duration-300 flex items-center justify-center">
                        <Phone className="w-5 h-5 mr-2" />
                        Contact Customer
                      </button>
                      <button
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-2xl hover:shadow-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                        onClick={() => updateBookingStatus(b._id, "complete")}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Complete Service
                      </button>
                    </div>
                  )}
                  
                  {b.status === "completed" && (
                    <div className="mt-6 pt-4 border-t border-gray-300/50">
                      <div className="w-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 py-3 px-4 rounded-2xl font-bold flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Service Completed
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
