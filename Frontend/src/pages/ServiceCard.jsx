import React, { useState } from "react";
import axios from "axios";
import BookingDetails from "./BookingDetails";
import { Star, MapPin, Calendar, DollarSign, Sparkles, Award } from "lucide-react";

const ServiceCard = ({ service, userId }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Open booking modal
  const handleBookService = () => {
    if (!userId) {
      alert("❌ Login first.");
      return;
    }
    setShowBookingModal(true);
  };

  // Handle confirm booking
  const handleConfirmBooking = async (bookingData) => {
    try {
      const payload = {
        userId,
        providerId: service.providerId || service.provider?._id || service._id,
        category: service.category,
        serviceId: service.id || service._id,
        location: service.location || 'Customer Location',
        details: bookingData.notes || `Booking for ${service.name}`,
        preferredDate: bookingData.date,
        preferredTime: bookingData.time,
      };

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/bookings/booking`,
        payload
      );

      alert("✅ Booking successful!");
      setShowBookingModal(false);
    } catch (err) {
      console.error("Booking error:", err);
      alert("❌ Booking failed. Check console for details.");
    }
  };

  // Handle cancel
  const handleCloseBooking = () => {
    setShowBookingModal(false);
  };

  // Handle validation errors
  const handleBookingError = (msg) => {
    alert(msg);
  };

  return (
    <div className="group relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      {/* Premium Badge */}
      {service.rating >= 4.5 && (
        <div className="absolute top-3 left-3 z-10">
          <div className="flex items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
            <Award className="w-3 h-3 mr-1" />
            Premium
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative overflow-hidden h-64">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold rounded-full border border-white/50 shadow-lg">
            {service.category}
          </span>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3">
          <div className="flex items-center px-2.5 py-1.5 bg-black/80 backdrop-blur-sm rounded-full">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-current mr-1" />
            <span className="text-xs font-bold text-white">{service.rating}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors duration-300">
            {service.name}
          </h3>
          <div className="flex items-center ml-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-lg font-bold text-green-600">{service.price}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
          {service.description}
        </p>
        
        {/* Service Location */}
       
        
        {/* Book Service Button */}
        <button
          onClick={handleBookService}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 rounded-2xl font-bold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center group/btn relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
          <Calendar className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
          <span className="relative z-10">Book Now</span>
          <Sparkles className="w-4 h-4 ml-2 group-hover/btn:animate-pulse" />
        </button>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingDetails
          service={service}
          onClose={handleCloseBooking}
          onConfirm={handleConfirmBooking}
          onError={handleBookingError}
        />
      )}
    </div>
  );
};

export default ServiceCard;
