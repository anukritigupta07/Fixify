import React from 'react';
import { Clock, CheckCircle, XCircle, MapPin, Phone, User } from 'lucide-react';

const BookingTracker = ({ booking }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'border-yellow-400 bg-yellow-400/10';
      case 'confirmed': return 'border-green-400 bg-green-400/10';
      case 'rejected': return 'border-red-400 bg-red-400/10';
      case 'completed': return 'border-green-400 bg-green-400/10';
      default: return 'border-gray-400 bg-gray-400/10';
    }
  };

  const steps = [
    { id: 1, name: 'Booking Placed', status: 'completed' },
    { id: 2, name: 'Provider Assigned', status: booking.status === 'pending' ? 'pending' : 'completed' },
    { id: 3, name: 'Service Confirmed', status: booking.status === 'confirmed' ? 'completed' : booking.status === 'rejected' ? 'rejected' : 'pending' },
    { id: 4, name: 'Service Completed', status: booking.status === 'completed' ? 'completed' : 'pending' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/50">
      <h3 className="text-2xl font-black text-white mb-8">Booking Status</h3>
      
      {/* Status Timeline */}
      <div className="space-y-6 mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStatusColor(step.status)}`}>
              {getStatusIcon(step.status)}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{step.name}</p>
              <p className="text-gray-400 text-sm capitalize">{step.status}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="w-px h-8 bg-gray-600 ml-5"></div>
            )}
          </div>
        ))}
      </div>

      {/* Booking Details */}
      <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-gray-600/30">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-400" />
          <span className="text-white font-medium">Service: {booking.category}</span>
        </div>
        
        {booking.preferredDate && (
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-white">Date: {booking.preferredDate} at {booking.preferredTime}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <span className="text-white">Location: {booking.location}</span>
        </div>

        {booking.providerId && (
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-white">Provider: {booking.providerId.fullname?.firstname} {booking.providerId.fullname?.lastname}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        {booking.status === 'pending' && (
          <button className="flex-1 px-6 py-3 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-2xl transition-all duration-300">
            Cancel Booking
          </button>
        )}
        
        {booking.status === 'confirmed' && (
          <button className="flex-1 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all duration-300">
            Contact Provider
          </button>
        )}
        
        {booking.status === 'completed' && (
          <button className="flex-1 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all duration-300">
            Leave Review
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingTracker;