import React, { useState } from 'react';
import { Search } from 'lucide-react'; // No need for Volume2 since it's commented out
import { Link } from 'react-router-dom';
import NavLinkContent from './NavLinkContent';
// import NavLinkContent from './NavLinkContent';

const BookServiceContent = ({ activeTab }) => {
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState(null);

  const handleSearch = () => {
    console.log('Searching for:', { service, location });
    setSearchQuery({ service, location });
  };

  return (
    <div className="bg-white   space-y-6 w-full rounded-xl shadow-md  relative">
     <NavLinkContent/>
     
      <main className="flex-1 md:ml-64 min-h-screen overflow-y-auto p-4 sm:p-6 md:p-3">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl mt-5  font-bold text-gray-800">
            {activeTab
              ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
              : "Book a Service"}
          </h1>
        </div>
         
    
      <div >
       {/* / <h2 className="text-2xl font-bold text-gray-800 mb-4">Book a Service</h2> */}
        <p className="text-gray-600 mb-6 text-center sm:text-left">
          Search for services and find trusted professionals in your area.
        </p>
      </div>  

      {/* The grid layout is now fully responsive.
          On small screens, it's a single column,
          and on screens larger than 'sm', it becomes a 3-column grid. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Enter Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
        />
        <input
          type="text"
          placeholder="Enter Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-md shadow hover:bg-indigo-700 flex items-center justify-center space-x-2 w-full"
        >
          <Search size={20} />
          <span>Search</span>
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Service Request Details:</h3>
        <textarea
          readOnly
          value={searchQuery ? `Service: ${searchQuery.service}\nLocation: ${searchQuery.location}` : 'Enter your search query above.'}
          className="w-full h-40 p-4 border border-gray-300 rounded-md bg-gray-50 resize-none"
        />
      </div>
      </main>
    </div>
    
  );
};

export default BookServiceContent;