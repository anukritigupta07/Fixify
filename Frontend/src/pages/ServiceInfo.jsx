// ServiceInfo.jsx
import React, { useState, useEffect, useContext } from 'react';
import ServiceCard from './ServiceCard';
import NavLinkContent from './NavLinkContent';
import { UserDataContext } from '../context/UserContext'; // get logged-in user
import { Search, Filter, MapPin, Grid, List, Star, TrendingUp } from 'lucide-react';

const ServiceInfo = ({ location, profession }) => {
  const { user } = useContext(UserDataContext); // logged-in user
  const loggedInUserId = user?._id || null;

  const mockServices = [
    { id: 1, name: 'Emergency Plumbing', category: 'plumber', description: '24/7 emergency plumbing services for leaks and bursts.', price: 150, rating: 4.8, location: 'Lucknow', image: 'https://cdn.pixabay.com/photo/2018/03/19/15/04/faucet-3240211_1280.jpg' },
    { id: 2, name: 'Switchboard Repair', category: 'electrician', description: 'Repair and replacement of faulty switchboards.', price: 120, rating: 4.9, location: 'Lucknow', image: 'https://media.istockphoto.com/id/1906119315/photo/electrician-engineer-tests-electrical-installations-and-wires-on-relay-protection-system.jpg?s=612x612&w=0&k=20&c=-edZvXq52hctr8wL676r30sAUy965lpzaM78jn42qY8=' },
    { id: 3, name: 'AC Installation', category: 'HVAC', description: 'Professional installation for all types of air conditioners.', price: 250, rating: 4.7, location: 'Kanpur', image: 'https://as2.ftcdn.net/v2/jpg/03/05/25/87/1000_F_305258776_wnt00VidOI3uVag9pS86hBJmGr1szW6m.jpg' },
    { id: 4, name: 'General Carpentry', category: 'Carpentry', description: 'Custom furniture, repairs, and installations.', price: 100, rating: 4.9, location: 'Lucknow', image: 'https://t4.ftcdn.net/jpg/14/41/56/43/240_F_1441564356_PIfTdnWuKHfxQjmuEKXPuEqHT3Q9Rm6L.jpg' },
    { id: 5, name: 'Interior Painting', category: 'Painting', description: 'High-quality interior painting for homes and offices.', price: 300, rating: 4.6, location: 'Varanasi', image: 'https://as1.ftcdn.net/v2/jpg/05/93/63/26/1000_F_593632696_54yJb7X4QjHmPOTlWjpw9fblrw5k4V13.jpg' },
    { id: 6, name: 'Vehicle Mechanic', category: 'Mechanic', description: 'Fast and best service at anytime and everywhere', price: 500, rating: 4.7, location: 'Lucknow', image: 'https://t3.ftcdn.net/jpg/09/66/01/20/240_F_966012078_ARw28Ks61EmU5jSOZbKWXAT1UlVPJnor.jpg' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...new Set(mockServices.map(s => s.category))];

  // Auto-filter if provider has profession
  useEffect(() => {
    if (profession && categories.includes(profession)) {
      setCategory(profession);
    }
  }, [profession]);

  const filteredServices = mockServices.filter(
    service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === 'All' || service.category === category)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NavLinkContent />
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-br from-gray-800 to-black rounded-2xl shadow-lg mr-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                  Available Services
                </h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-xl font-semibold">{location}</span>
                </div>
              </div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find and book the best professionals in your area. Quality guaranteed, hassle-free booking.
            </p>
          </div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search services, professionals, or keywords..."
                className="w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent font-medium transition-all duration-300"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-12 pr-8 py-4 bg-white/80 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent font-medium transition-all duration-300 appearance-none cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="font-medium">
                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            {/* Category Pills */}
            <div className="hidden md:flex items-center space-x-2">
              {categories.slice(0, 4).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    category === cat
                      ? 'bg-gradient-to-r from-gray-800 to-black text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'All' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Service Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ServiceCard
                  service={service}
                  userId={user?._id} // Pass user ID for booking
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center border border-gray-300/50">
                <Search className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No services found</h3>
              <p className="text-gray-600 mb-8">
                We couldn't find any services matching your criteria. Try adjusting your search or category filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategory('All');
                }}
                className="px-8 py-4 bg-gradient-to-r from-gray-800 to-black text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceInfo;
