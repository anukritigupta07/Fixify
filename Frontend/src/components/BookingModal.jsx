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

const BookingSuccessModal = ({ onClose, onProceedToPayment }) => {
  // Removed the useEffect with setTimeout to allow manual control
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     onProceedToPayment();
  //   }, 5000); // 5 seconds
  //   return () => clearTimeout(timer);
  // }, [onProceedToPayment]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-scaleIn">
        <div className="bg-gradient-to-r from-[#0047AB] to-[#10B981] p-5 flex justify-between items-center">
          <h2 className="text-white font-bold text-xl">Booking Confirmation</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <p className="text-lg text-gray-700 font-medium">Booking created successfully!</p>
          <button
            onClick={onProceedToPayment}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0047AB] to-[#10B981] hover:from-[#003B9A] hover:to-[#0E9A6F] transition-all"
          >
            OK
          </button>
        </div>
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
  const [savedAddresses, setSavedAddresses] = useState([]); // This will be removed or refactored
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true); // This will be removed or refactored
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBookingSuccessModal, setShowBookingSuccessModal] = useState(false);
  const [showManualAddressInput, setShowManualAddressInput] = useState(false);

  // New state for manual address form
  const [newAddressForm, setNewAddressForm] = useState({
    fullName: '',
    mobileNumber: '',
    pincode: '',
    locality: '',
    areaAndStreet: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    // Removed fetchUserAddresses as saved addresses are no longer displayed in this UI
    setIsLoadingAddresses(false); // Set to false directly as no fetching is done
  }, [userId]);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `/maps/reverse-geocode?lat=${latitude}&lon=${longitude}`
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
          setShowManualAddressInput(false); // Hide manual input if current location is selected
          setNewAddressForm({
            fullName: '',
            mobileNumber: '',
            pincode: '',
            locality: '',
            areaAndStreet: '',
            city: '',
            state: '',
          }); // Clear new address form
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
    onConfirm({ ...formData, paymentMethod: null });
    setShowBookingSuccessModal(true);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setFormData({ ...formData, address: address.address });
    setShowManualAddressInput(false); // Hide manual input if a saved address is selected
    setNewAddressForm({
      fullName: '',
      mobileNumber: '',
      pincode: '',
      locality: '',
      areaAndStreet: '',
      city: '',
      state: '',
    }); // Clear new address form
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewAddressFormChange = (e) => {
    setNewAddressForm({ ...newAddressForm, [e.target.name]: e.target.value });
  };

  const handleSaveNewAddress = () => {
    // Implement saving new address logic here
    const fullAddress = `${
      newAddressForm.areaAndStreet
    }, ${newAddressForm.locality}, ${newAddressForm.city}, ${newAddressForm.state} - ${newAddressForm.pincode}`;
    setFormData({ ...formData, address: fullAddress });
    setSelectedAddress({ id: 'manual', name: newAddressForm.fullName, address: fullAddress });
    setShowManualAddressInput(false); // Hide the form after saving
    // You might want to persist this address to the backend or context for future use
  };

  const handleCancelNewAddress = () => {
    setShowManualAddressInput(false);
    setNewAddressForm({
      fullName: '',
      mobileNumber: '',
      pincode: '',
      locality: '',
      areaAndStreet: '',
      city: '',
      state: '',
    });
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

              {/* Use Current Location Button */}
              <button
                type="button"
                onClick={() => {
                  getCurrentLocation();
                  setShowManualAddressInput(false);
                }}
                disabled={isGettingLocation}
                className={`w-full flex items-center gap-3 p-4 border-2 border-dashed rounded-xl transition-all 
                  ${selectedAddress?.isCurrentLocation
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
                  } ${isGettingLocation ? 'opacity-75' : ''}
                `}
              >
                <Navigation className={`w-5 h-5 text-blue-600 ${isGettingLocation ? 'animate-spin' : ''}`} />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-blue-600">
                    {isGettingLocation ? 'Detecting location...' : 'Use my current location'}
                  </div>
                  <p className="text-xs text-gray-600">Using GPS</p>
                  {selectedAddress?.isCurrentLocation && (
                    <p className="text-xs text-gray-600 truncate mt-1">{selectedAddress.address}</p>
                  )}
                </div>
              </button>

              {/* Add a new address button / Manual Address Input */}
              {!showManualAddressInput && (
                <button
                  type="button"
                  onClick={() => setShowManualAddressInput(true)}
                  className="w-full flex items-center justify-center gap-2 mt-4 p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-semibold hover:border-blue-500 hover:text-blue-500 transition-all"
                >
                  + Add a new address
                </button>
              )}

              {showManualAddressInput && (
                <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-xl space-y-4">
                  <h5 className="text-lg font-semibold text-gray-800">Add New Address</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={newAddressForm.fullName}
                      onChange={handleNewAddressFormChange}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                    <input
                      type="text"
                      name="mobileNumber"
                      placeholder="Mobile Number"
                      value={newAddressForm.mobileNumber}
                      onChange={handleNewAddressFormChange}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={newAddressForm.pincode}
                      onChange={handleNewAddressFormChange}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                    <input
                      type="text"
                      name="locality"
                      placeholder="Locality"
                      value={newAddressForm.locality}
                      onChange={handleNewAddressFormChange}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                  </div>
                  <input
                    type="text"
                    name="areaAndStreet"
                    placeholder="Address (Area and Street)"
                    value={newAddressForm.areaAndStreet}
                    onChange={handleNewAddressFormChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City/District/Town"
                      value={newAddressForm.city}
                      onChange={handleNewAddressFormChange}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={newAddressForm.state}
                      onChange={handleNewAddressFormChange}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCancelNewAddress}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNewAddress}
                      className="px-6 py-3 bg-gradient-to-r from-[#0047AB] to-[#10B981] text-white rounded-xl font-semibold hover:shadow-lg"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              )}

              {/* Removed Saved Addresses Section */}
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

      {showBookingSuccessModal && (
        <BookingSuccessModal
          onClose={() => setShowBookingSuccessModal(false)}
          onProceedToPayment={() => {
            setShowBookingSuccessModal(false);
            setShowPaymentModal(true); // Assuming you want to show payment modal after success
          }}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSelectPayment={(method) => {
            console.log('Selected payment method:', method);
            setShowPaymentModal(false);
            // Here you would typically integrate with your actual payment processing
            // For now, we just close the modal
          }}
        />
      )}
    </div>
  );
};

export default BookingModal;

