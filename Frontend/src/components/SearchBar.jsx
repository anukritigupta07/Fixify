import React, { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';

const SearchBar = ({ onSearch, onLocationChange, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, location });
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-gray-600/50 shadow-2xl">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
          />
        </div>

        {/* Location Input */}
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full md:w-48 pl-12 pr-4 py-4 bg-white/10 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
          />
        </div>

        {/* Filter Button */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-4 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-2xl border border-gray-600/50 transition-all duration-300 flex items-center justify-center"
        >
          <Filter className="w-5 h-5" />
        </button>

        {/* Search Button */}
        <button
          type="submit"
          className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
        >
          Search
        </button>
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-600/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select className="px-4 py-3 bg-white/10 border border-gray-600/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/50">
              <option value="">Price Range</option>
              <option value="0-100">$0 - $100</option>
              <option value="100-300">$100 - $300</option>
              <option value="300+">$300+</option>
            </select>
            <select className="px-4 py-3 bg-white/10 border border-gray-600/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/50">
              <option value="">Rating</option>
              <option value="4+">4+ Stars</option>
              <option value="4.5+">4.5+ Stars</option>
            </select>
            <select className="px-4 py-3 bg-white/10 border border-gray-600/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/50">
              <option value="">Availability</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
            </select>
            <button className="px-4 py-3 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-2xl border border-gray-600/50 transition-all duration-300">
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;