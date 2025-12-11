import React, { useState, useContext } from "react";
import { Calendar, Clock, User, DollarSign, X, CheckCircle } from "lucide-react";
import { UserDataContext } from '../context/UserContext';

const BookingDetails = ({ onClose, onError, service }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useContext(UserDataContext);
  const loggedInUserId = user?._id || null;

  const handleBooking = async () => {
    if (!date || !time) {
      onError?.("Please select a valid date and time.");
      return;
    }

    if (!loggedInUserId) {
      onError?.('Please login to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1) create booking first (status will be updated on payment verification)
      const bookingPayload = {
        userId: loggedInUserId,
        providerId: service?.providerId?._id || service?.providerId,
        category: service?.category,
        serviceId: service?._id,
        location: 'Customer Location',
        details: notes || `Booking for ${service?.name}`,
        preferredDate: date,
        preferredTime: time,
      };

      const bookingRes = await fetch(`/bookings/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      const bookingResult = await bookingRes.json();
      if (!bookingResult?.booking) {
        throw new Error(bookingResult?.message || 'Failed to create booking');
      }

      const bookingId = bookingResult.booking._id;

      // 2) create payment order using bookingId
      const orderResponse = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:4000'}/payment/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: service?.price || 0,
          bookingId,
          providerId: service?.providerId?._id || service?.providerId,
          paymentMode: 'razorpay',
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderData?.order?.id) {
        throw new Error('Order creation failed');
      }

      const keyId = orderData?.key_id || import.meta.env.VITE_RAZORPAY_API_KEY;
      if (!orderData?.key_id) console.warn('⚠️ Backend did not return key_id; falling back to VITE_RAZORPAY_API_KEY');

      const options = {
        key: keyId,
        amount: orderData.order.amount,
        currency: 'INR',
        name: service?.name || 'Service Booking',
        description: service?.description || service?.category,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // verify payment on backend
            const verifyRes = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:4000'}/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId,
              }),
            });
            const result = await verifyRes.json();
            if (result.success) {
              alert('✅ Payment successful and booking confirmed!');
              onClose?.();
            } else {
              onError?.('Payment verification failed.');
            }
          } catch (err) {
            console.error(err);
            onError?.('Error verifying payment.');
          }
        },
        theme: { color: '#4f46e5' },
      };

      const rzp = new window.Razorpay(options);
      try {
        rzp.open();
      } catch (err) {
        console.error('❌ Razorpay checkout failed to open:', err);
        try {
          await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:4000'}/payment/fallback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId, providerId: service?.providerId?._id || service?.providerId, amount: service?.price || 0, note: 'Checkout UI failed to open' }),
          });
        } catch (e) {
          console.error('Failed to record fallback payment:', e);
        }
        onError?.('Payment UI failed to open; booking left pending. Choose Cash or retry.');
      }
    } catch (error) {
      console.error(error);
      onError?.('Payment initiation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mr-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Book Service</h2>
              <p className="text-gray-600 font-medium">{service?.name || service?.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Service Summary */}
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="font-semibold text-gray-800">{service?.name}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-600 mr-1" />
              <span className="text-xl font-bold text-green-600">{service?.price}</span>
            </div>
          </div>
          {service?.description && <p className="text-gray-600 text-sm mt-2">{service.description}</p>}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="h-4 w-4 mr-2 text-indigo-600" /> Preferred Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              max={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
              className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Clock className="h-4 w-4 mr-2 text-indigo-600" /> Preferred Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="2"
              placeholder="Any specific requirements or instructions..."
              className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 sticky bottom-0 bg-white/95 pt-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 font-bold" disabled={isSubmitting}>
            Cancel
          </button>
          <button onClick={handleBooking} disabled={isSubmitting} className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
