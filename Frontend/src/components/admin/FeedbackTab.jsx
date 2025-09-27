import React from 'react';
import { MessageSquare, Star } from 'lucide-react';

const FeedbackTab = ({ feedback }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
          User Feedback ({feedback.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {feedback.map((fb) => (
          <div key={fb._id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center mb-2">
                    <div className="text-lg font-semibold text-gray-900">
                      {fb.userId?.fullname?.firstname} {fb.userId?.fullname?.lastname}
                    </div>
                    <div className="ml-3 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < fb.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({fb.rating}/5)</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Service: <span className="font-medium capitalize">{fb.serviceCategory}</span> • 
                    Provider: <span className="font-medium">{fb.providerId?.fullname?.firstname} {fb.providerId?.fullname?.lastname}</span>
                  </div>
                  <div className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                    "{fb.comment}"
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {new Date(fb.createdAt).toLocaleDateString()} at {new Date(fb.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {feedback.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No feedback received yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackTab;