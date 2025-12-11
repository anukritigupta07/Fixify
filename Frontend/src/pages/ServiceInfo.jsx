import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ServiceCard from './ServiceCard';
import NavLinkContent from './NavLinkContent';
import BookingModal from '../components/BookingModal';
import { UserDataContext } from '../context/UserContext';
import { Search, Filter, MapPin, TrendingUp, CheckCircle, CreditCard, Wallet, X, Clock, Calendar, User } from 'lucide-react';
import ErrorModal from '../components/ErrorModal';

const ServiceInfo = ({ location, profession }) => {
  const { user } = useContext(UserDataContext);
  const loggedInUserId = user?._id || null;

  const [services, setServices] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ✅ Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/services`);
        setServices(response.data.services || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      }
    };
    fetchServices();
  }, []);

  const categories = ['All', ...new Set(services.map(s => s.category || 'Other'))];

  useEffect(() => {
    if (profession && categories.includes(profession)) setCategory(profession);
  }, [profession]);

  const filteredServices = services.filter(
    service =>
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === 'All' || service.category === category)
  );

  // ✅ Booking modal handlers
  const handleOpenBooking = (service) => {
    if (!loggedInUserId) {
      setErrorMessage('❌ Please login first.');
      setShowErrorModal(true);
      return;
    }
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleCloseBooking = () => {
    setShowBookingModal(false);
    setSelectedService(null);
  };

  // ✅ Confirm Booking
  const handleConfirmBooking = async (bookingData) => {
    try {
      const payload = {
        userId: loggedInUserId,
        providerId: selectedService.providerId || selectedService.provider?._id,
        category: selectedService.category,
        serviceId: selectedService._id || selectedService.name,
        location: bookingData.address || 'Customer Location',
        details: bookingData.notes || `Booking for ${selectedService.name}`,
        preferredDate: bookingData.date,
        preferredTime: bookingData.time,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/bookings/create`,
        payload
      );

      if (response.data?.booking) {
        setCurrentBooking(response.data.booking);
        setShowBookingModal(false);
        if (!bookingData.paymentMethod) {
          setShowPaymentModal(true);
        }
      } else {
        setErrorMessage(response.data.message || 'Booking failed! No active provider available for this service.');
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error('❌ Booking error:', err);
      setErrorMessage(err.response?.data?.message || 'Booking failed! Check console for details.');
      setShowErrorModal(true);
    }
  };

  // ✅ Cash Payment Handler
  const handleCashPayment = async () => {
    alert('💵 Cash payment selected. Booking confirmed!');
    setShowPaymentModal(false);
    setCurrentBooking(null);
  };

  // ✅ Razorpay Payment
  const handleRazorpayPayment = async () => {
  if (!selectedService || !currentBooking) {
    setErrorMessage('No booking or service selected.');
    setShowErrorModal(true);
    return;
  }

  try {
    // Resolve providerId from multiple possible shapes returned by backend
    const providerId =
      (selectedService.providerId && (selectedService.providerId._id || selectedService.providerId)) ||
      (selectedService.provider && (selectedService.provider._id || selectedService.provider)) ||
      null;

    if (!providerId) {
      console.error('❌ Missing providerId in service object:', selectedService);
      setErrorMessage('Provider ID missing for this service. Cannot initiate payment.');
      setShowErrorModal(true);
      return;
    }

    // Create payment order using resolved providerId
    const orderRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/payment/order`, {
      amount: selectedService.price || 500,
      bookingId: currentBooking._id,
      providerId,
      paymentMode: 'razorpay',
    });

  console.log('🧾 Razorpay Order Response (full):', orderRes.data);

  const orderData = orderRes.data?.order;
  // prefer key_id returned by backend (guarantees matching key/credentials)
  const keyId = orderRes.data?.key_id || import.meta.env.VITE_RAZORPAY_API_KEY;
  if (!orderRes.data?.key_id) console.warn('⚠️ Backend did not return key_id; falling back to VITE_RAZORPAY_API_KEY');
    if (!orderData?.id) {
      console.error('Order creation failed:', orderData);
      setErrorMessage('Failed to create payment order.');
      setShowErrorModal(true);
      return;
    }

    const options = {
  key: keyId,
      amount: orderData.amount,
      currency: 'INR',
      name: selectedService.name || 'Service Booking',
      description: selectedService.description || selectedService.category,
      order_id: orderData.id,
      handler: async (response) => {
        try {
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: currentBooking._id,
            }
          );

          if (verifyRes.data.success) {
            alert('✅ Payment successful!');
            setShowPaymentModal(false);
            setCurrentBooking(null);
          } else {
            setErrorMessage('❌ Payment verification failed.');
            setShowErrorModal(true);
          }
        } catch (err) {
          console.error('Error verifying payment:', err);
          setErrorMessage('Verification error. Check console.');
          setShowErrorModal(true);
        }
      },
      theme: { color: '#4f46e5' },
    };

    const rzp = new window.Razorpay(options);
    try {
      rzp.open();
    } catch (err) {
      console.error('❌ Razorpay checkout failed to open:', err);
      // record fallback payment in backend
      try {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/payment/fallback`, {
          bookingId: currentBooking?._id,
          providerId: selectedService.providerId?._id || selectedService.providerId,
          amount: selectedService.price || 0,
          note: 'Checkout UI failed to open',
        });
      } catch (e) {
        console.error('Failed to record fallback payment:', e);
      }
      setErrorMessage('Payment UI failed to open. We recorded the attempt and left booking pending. You can choose Cash on Service or retry.');
      setShowErrorModal(true);
    }
  } catch (err) {
    console.error('Error initiating payment:', err);
    setErrorMessage('Payment initiation failed. Try again.');
    setShowErrorModal(true);
  }
};

  const handleBookingError = (msg) => {
    setErrorMessage(msg);
    setShowErrorModal(true);
  };

  // ✅ UI (unchanged)
  return (
    <div
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #d1fae5 100%)'
      }}
    >
      <NavLinkContent />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full filter blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full filter blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#0047AB] to-[#10B981] bg-clip-text text-transparent mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Professional services at your doorstep
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">{location}</span>
          </div>
        </div>

        <div className="backdrop-blur-xl rounded-[2rem] p-6 mb-8" style={{
          background: 'rgba(255, 255, 255, 0.7)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
        }}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-blue-400" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-14 pr-5 py-4 border border-blue-200/50 rounded-2xl"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-emerald-400" strokeWidth={2.5} />
              </div>
              <select
                className="pl-14 pr-10 py-4 border border-emerald-200/50 rounded-2xl"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-blue-900 text-sm">
                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service._id || index}
                service={service}
                onBookService={() => handleOpenBooking(service)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white/70 rounded-2xl shadow-md">
            <Search className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-gray-800">No services found</h3>
            <p className="text-gray-600">Try changing filters or search keywords.</p>
          </div>
        )}
      </div>

      {/* ✅ Booking Modal */}
      {showBookingModal && selectedService && (
        <BookingModal
          service={selectedService}
          userId={loggedInUserId}
          onClose={handleCloseBooking}
          onConfirm={handleConfirmBooking}
          onError={handleBookingError}
        />
      )}

     
     {/* ✅ Booking Confirmation Card (appears after booking is created) */}
{currentBooking && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
    <div className="w-[380px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#0047AB] to-[#10B981] text-white flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          {selectedService?.image ? (
            <img
              src={selectedService.image}
              alt="service"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-white" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide opacity-90">
            Booking Confirmed
          </div>
          <div className="font-bold text-lg leading-tight truncate">
            {selectedService?.name}
          </div>
        </div>
        <button
          onClick={() => setCurrentBooking(null)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-[#0047AB]" />
            </div>
            <div>
              <div className="text-sm text-gray-700 font-semibold">
                {currentBooking?.preferredDate ||
                  currentBooking?.date ||
                  "N/A"}
              </div>
              <div className="text-xs text-gray-500">
                {currentBooking?.preferredTime ||
                  currentBooking?.time ||
                  "Anytime"}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Amount</div>
            <div className="font-bold text-lg text-emerald-600">
              ₹{selectedService?.price}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 line-clamp-3">
          {currentBooking?.details ||
            currentBooking?.notes ||
            "No additional notes"}
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => handleRazorpayPayment()}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0047AB] to-[#10B981] text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition"
          >
            <CreditCard className="w-4 h-4" /> Pay Now
          </button>
          <button
            onClick={() => handleCashPayment()}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-2xl text-gray-800 font-semibold hover:bg-gray-50 transition"
          >
            <Wallet className="w-4 h-4 text-[#0047AB]" /> Cash
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          Booking ID:{" "}
          <span className="text-gray-700">
            {currentBooking?._id?.slice(-6) || "—"}
          </span>
        </div>
      </div>
    </div>
  </div>
)}

    {showErrorModal && (
      <ErrorModal message={errorMessage} onClose={() => setShowErrorModal(false)} />
    )}
    </div>
  );
};

export default ServiceInfo;
