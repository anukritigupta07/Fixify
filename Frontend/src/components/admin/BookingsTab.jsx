import React from 'react';
import { Calendar } from 'lucide-react';

const BookingsTab = ({ bookings }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-purple-600" />
          Bookings ({bookings.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {bookings.map((booking) => (
          <div key={booking._id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <div className="text-lg font-semibold text-gray-900 capitalize">
                    {booking.category}
                  </div>
                  <div className="text-sm text-gray-600">
                    User: {booking.userId?.fullname?.firstname} {booking.userId?.fullname?.lastname}
                  </div>
                  <div className="text-sm text-gray-600">
                    Provider: {booking.providerId?.fullname?.firstname} {booking.providerId?.fullname?.lastname}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 text-sm font-semibold rounded-full ${
                booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {booking.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsTab;