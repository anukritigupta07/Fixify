import React from 'react';
import { Star, Clock, MapPin, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceRecommendations = ({ userLocation = 'Your Area' }) => {
  const recommendations = [
    {
      id: 1,
      name: 'Emergency Plumbing',
      category: 'Plumbing',
      rating: 4.9,
      price: '$150',
      responseTime: '30 min',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      trending: true
    },
    {
      id: 2,
      name: 'AC Repair & Service',
      category: 'HVAC',
      rating: 4.8,
      price: '$120',
      responseTime: '45 min',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop',
      trending: false
    },
    {
      id: 3,
      name: 'Electrical Repairs',
      category: 'Electrical',
      rating: 4.7,
      price: '$100',
      responseTime: '1 hour',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop',
      trending: true
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-white">Recommended for You</h3>
        <Link 
          to="/serviceInfo" 
          className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
        >
          View All →
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {recommendations.map((service) => (
          <div
            key={service.id}
            className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-600/50 hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 transform hover:scale-105 group"
          >
            {/* Image */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
              
              {/* Trending Badge */}
              {service.trending && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                  <TrendingUp className="w-3 h-3 text-black mr-1" />
                  <span className="text-xs font-bold text-black">Trending</span>
                </div>
              )}

              {/* Rating */}
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                <span className="text-xs font-bold text-white">{service.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="text-lg font-bold text-white mb-2">{service.name}</h4>
              <p className="text-gray-300 text-sm mb-3">{service.category}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{service.responseTime}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{userLocation}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-white">{service.price}</span>
                <Link
                  to="/serviceInfo"
                  className="px-4 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceRecommendations;