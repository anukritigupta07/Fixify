import React, { useState, useEffect } from 'react';
import {
  X, Calendar, Clock, MapPin, CreditCard, Star, Shield,
  CheckCircle, Navigation, Wallet, Smartphone
} from 'lucide-react';

// 💳 Payment Modal (unchanged visually; returns chosen method)
const PaymentModal = ({ onClose, onSelectPayment }) => {
  const [step, setStep] = useState('select');
  const [upiId, setUpiId] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const handleUPIPay = () => {
    if (!upiId.trim()) return alert("Please enter a valid UPI ID");
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      onSelectPayment('UPI');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-[#0047AB] to-[#10B981] p-5 flex justify-between items-center">
          <h2 className="text-white font-bold text-xl">
            {step === 'select' ? 'Choose Payment Method' : 'Pay via UPI'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {step === 'select' && (
          <div className="p-6 space-y-4">
            <button
              onClick={() => onSelectPayment('Cash')}
              className="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <Wallet className="w-5 h-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-800">Cash on Service</span>
            </button>

            <button
              onClick={() => setStep('upi')}
              className="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">Pay via UPI</span>
            </button>
          </div>
        )}

        {step === 'upi' && (
          <div className="p-6 space-y-5">
            <div className="flex flex-col items-center text-center space-y-2">
              <Smartphone className="w-10 h-10 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Simulated UPI Payment</h3>
              <p className="text-sm text-gray-500">Enter your UPI ID to proceed with payment</p>
            </div>

            <input
              type="text"
              placeholder="e.g. username@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />

            <button
              onClick={handleUPIPay}
              disabled={isPaying}
              className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl font-semibold text-white transition-all ${
                isPaying
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#0047AB] to-[#10B981] hover:shadow-lg'
              }`}
            >
              {isPaying ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay ₹ Now</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 🧾 Booking Modal (with manual address and saved-address selection)
const BookingModal = ({ service, userId, onClose, onConfirm, onError }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notes: '',
    address: ''
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (!userId) {
        setIsLoadingAddresses(false);
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/bookings/user/${userId}`);
        const data = await response.json();
        if (data.bookings) {
          const uniqueAddresses = [];
          const addressMap = new Map();
          data.bookings.forEach((booking, index) => {
            if (booking.location) {
              const addressKey = booking.location.toLowerCase().trim();
              if (!addressMap.has(addressKey)) {
                addressMap.set(addressKey, {
                  id: `addr_${index}`,
                  type: index === 0 ? 'Recent' : 'Previous',
                  name: booking.userId?.fullname?.firstname || 'User',
                  address: booking.location
                });
                uniqueAddresses.push(addressMap.get(addressKey));
              }
            }
          });
          setSavedAddresses(uniqueAddresses.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching user addresses:', err);
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    fetchUserAddresses();
  }, [userId]);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `http://localhost:4000/maps/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const addressText = data.display_name || 'Detected Location';
          const currentLocation = {
            id: 'current',
            type: 'Current Location',
            name: 'You',
            address: addressText,
            isCurrentLocation: true
          };
          setSelectedAddress(currentLocation);
          setFormData({ ...formData, address: currentLocation.address });
        } catch (err) {
          console.error('Reverse geocode error:', err);
          alert('Failed to fetch location.');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert('Unable to get your location.');
        setIsGettingLocation(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.address) {
      onError('Please fill all required fields.');
      return;
    }
    // Instead of opening an inline payment selector here (which caused a second popup),
    // call onConfirm immediately and let the parent show the booking-confirmation card.
    // The parent will decide when to open the Razorpay checkout (so only one window appears).
    onConfirm({ ...formData, paymentMethod: null });
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setFormData({ ...formData, address: address.address });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#0047AB] to-[#10B981] text-white p-6 rounded-t-3xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Book Service</h2>
            <p className="text-blue-100">Complete your booking details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 mb-8 border border-blue-100 flex gap-6 items-start">
            {service?.image && <img src={service.image} alt={service.name} className="w-40 h-40 rounded-2xl object-cover" />}
            <div className="flex-1">
              <h3 className="text-3xl font-black text-gray-900 mb-2">{service.name}</h3>
              <p className="text-gray-700 mb-3">{service.description}</p>
              <div className="flex gap-3">
                <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 font-semibold">{service.rating}</span>
                </div>
                <div className="flex items-center bg-green-100 px-3 py-1 rounded-full text-green-700">
                  <CheckCircle className="w-4 h-4 mr-1" /> Verified
                </div>
                <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full text-blue-700">
                  <Shield className="w-4 h-4 mr-1" /> Insured
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-[#10B981]">₹{service.price}</div>
              <div className="text-sm text-gray-600">per service</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Deliver To
              </h4>

              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className={`w-full flex items-center gap-3 p-4 border-2 border-dashed rounded-xl transition-all ${
                  selectedAddress?.isCurrentLocation
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
                } ${isGettingLocation ? 'opacity-75' : ''}`}
              >
                <Navigation className={`w-5 h-5 text-blue-600 ${isGettingLocation ? 'animate-spin' : ''}`} />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-blue-600">
                    {isGettingLocation ? 'Detecting location...' : 'Use my current location'}
                  </div>
                  {selectedAddress?.isCurrentLocation && (
                    <p className="text-xs text-gray-600 truncate">{selectedAddress.address}</p>
                  )}
                </div>
              </button>

              <div className="mt-4">
                <input
                  type="text"
                  name="address"
                  placeholder="Or enter address manually"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>

              <div className="space-y-3 mt-3">
                {isLoadingAddresses ? (
                  <p className="text-sm text-gray-400">Loading addresses...</p>
                ) : savedAddresses.length > 0 ? (
                  savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleAddressSelect(addr)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedAddress?.id === addr.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold">{addr.name}</span>
                          <p className="text-sm text-gray-700">{addr.address}</p>
                        </div>
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddress?.id === addr.id}
                          onChange={() => handleAddressSelect(addr)}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No saved addresses</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Schedule Service
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="px-4 py-3 border-2 rounded-xl text-lg w-full"
                />
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="px-4 py-3 border-2 rounded-xl text-lg w-full"
                >
                  <option value="">Choose Time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>
            </div>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border-2 rounded-xl"
              placeholder="Additional notes (optional)"
            />

            <div className="flex gap-4 border-t pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0047AB] to-[#10B981] text-white rounded-xl font-semibold hover:shadow-lg flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" /> Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payment selection is intentionally moved out of this modal to avoid duplicate checkout windows.
          The parent shows a booking confirmation card where the user can explicitly select Pay Now or Cash. */}
    </div>
  );
};

export default BookingModal;

