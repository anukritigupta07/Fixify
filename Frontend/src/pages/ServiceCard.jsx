import React, { useState } from "react";
import axios from "axios";
import BookingDetails from "./BookingDetails";
import { Star, MapPin, Calendar, DollarSign } from "lucide-react";

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
        category: service.category,
        serviceId: service.id,
        location: bookingData.address,
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
    <div className="group bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-bold rounded-full border border-gray-200/50">
            {service.category}
          </span>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full border border-gray-200/50">
            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
            <span className="text-sm font-bold text-gray-800">{service.rating}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-300">
          {service.name}
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {service.description}
        </p>
        
        {/* Service Details */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{service.location}</span>
          </div>
          
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-green-600 mr-1" />
            <span className="text-2xl font-bold text-green-600">{service.price}</span>
          </div>
        </div>
        
        {/* Book Service Button */}
        <button
          onClick={handleBookService}
          className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center group"
        >
          <Calendar className="w-5 h-5 mr-2 group-hover:animate-pulse" />
          Book Service Now
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
