import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import NavLinkContent from "./NavLinkContent";
import { Calendar, Clock, User, MapPin, Phone, Mail, Star, TrendingUp, CheckCircle, XCircle, AlertCircle, MessageSquare } from "lucide-react";

export default function UserDashboard() {
  const { user, isLoading: userLoading } = useContext(UserDataContext);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [toast, setToast] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ bookingId: '', rating: 5, comment: '' });

  const userId = user?._id;

  // Fetch user bookings
  useEffect(() => {
    if (!userId) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/bookings/user/${userId}`
        );
        const bookingsData = res.data.bookings || res.data || [];
        setBookings(bookingsData);
      } catch (err) {
        console.error("❌ Failed to fetch bookings:", err);
         setBookings([]); 
      }
    };

    fetchBookings();
  }, [userId]);

  // Cancel a booking
  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await axios.post(
        `http://localhost:4000/bookings/${bookingId}/action`,
        { action: "cancel" }
      );
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      console.error("❌ Failed to cancel booking:", err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  // Submit feedback
  const submitFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:4000/feedback/submit',
        feedbackData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowFeedbackModal(false);
      setFeedbackData({ bookingId: '', rating: 5, comment: '' });
      alert('Feedback submitted successfully!');
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  // Open feedback modal
  const openFeedbackModal = (bookingId) => {
    setFeedbackData({ bookingId, rating: 5, comment: '' });
    setShowFeedbackModal(true);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <NavLinkContent />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // No authentication check - let user access dashboard if they have token

  // Calculate booking stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
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
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-gray-800 to-black rounded-2xl shadow-lg mr-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-1">
                      Welcome back, {user?.fullname?.firstname || 'User'}!
                    </h1>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="font-medium">{user?.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
                <div className="text-center p-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl border border-gray-400/50">
                  <div className="text-2xl font-bold text-gray-800">{stats.cancelled}</div>
                  <div className="text-sm text-gray-700 font-medium">Cancelled</div>
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
              Your Bookings
            </h2>
          </div>
          
          {bookings.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center border border-gray-300/50">
                  <Calendar className="w-12 h-12 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No bookings yet</h3>
                <p className="text-gray-600 mb-8">Start by booking your first service and we'll show all your appointments here.</p>
                <button className="px-8 py-4 bg-gradient-to-r from-gray-800 to-black text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Book Your First Service
                </button>
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
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl shadow-lg mr-4">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{b.category}</h3>
                        <p className="text-sm text-gray-500">Service Booking</p>
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
                        : b.status === "rejected"
                        ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-700"
                        : b.status === "cancelled"
                        ? "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700"
                        : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700"
                    }`}>
                      {getStatusIcon(b.status)}
                      <span className="ml-2 capitalize">{b.status}</span>
                    </div>
                  </div>

                  {/* Provider Info */}
                  <div className="mb-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-200/50">
                    <div className="flex items-center mb-3">
                      <User className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="font-semibold text-gray-800">Provider:</span>
                    </div>
                    {b.providerId ? (
                      <>
                        <p className="text-gray-900 font-medium ml-6 mb-2">
                          {b.providerId.fullname.firstname} {b.providerId.fullname.lastname}
                        </p>
                        <div className="flex items-center ml-6 mb-2">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-600 text-sm">{b.providerId.email}</span>
                        </div>
                        <div className="flex items-center ml-6">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-600 text-sm">{b.providerId.contact}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600 ml-6">Not assigned yet</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {b.status === "pending" && (
                    <div className="mt-6 pt-4 border-t border-gray-300/50">
                      <button
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-2xl hover:shadow-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                        onClick={() => cancelBooking(b._id)}
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        Cancel Booking
                      </button>
                    </div>
                  )}
                  
                  {b.status === "confirmed" && (
                    <div className="mt-6 pt-4 border-t border-gray-300/50 space-y-3">
                      <div className="flex gap-3">
                        <button className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-2xl hover:shadow-lg font-bold transition-all duration-300 text-sm">
                          View Details
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-gray-800 to-black text-white py-3 px-4 rounded-2xl hover:shadow-lg font-bold transition-all duration-300 text-sm">
                          Contact Provider
                        </button>
                      </div>
                      <button
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-2xl hover:shadow-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                        onClick={() => cancelBooking(b._id)}
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        Cancel Booking
                      </button>
                    </div>
                  )}
                  
                  {b.status === "rejected" && (
                    <div className="mt-6 pt-4 border-t border-gray-300/50">
                      <div className="text-center p-4 bg-red-50/80 rounded-2xl border border-red-200/50">
                        <p className="text-red-700 font-medium text-sm mb-3">
                          This booking was declined by the provider
                        </p>
                        <button className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 px-4 rounded-2xl hover:shadow-lg font-bold transition-all duration-300 text-sm">
                          Book Another Provider
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {b.status === "completed" && (
                    <div className="mt-6 pt-4 border-t border-gray-300/50">
                      <button
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-2xl hover:shadow-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                        onClick={() => openFeedbackModal(b._id)}
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Add Feedback
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>


      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Your Feedback</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedbackData(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl ${star <= feedbackData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                value={feedbackData.comment}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Share your experience..."
                required
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                disabled={!feedbackData.comment.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
