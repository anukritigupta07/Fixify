import React from "react";
import { MapPin, Wrench, Plug, Snowflake, Hammer, Paintbrush } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ChatSupport from "../components/ChatSupport";
const HomePage = ({ setPage, location }) => {
  const categories = [
    {
      name: "Plumbing",
      icon: <Wrench className="w-10 h-10" />,
      color: "text-blue-500",
      bg: "bg-blue-50",
      hover: "hover:bg-blue-100",
    },
    {
      name: "Electrical",
      icon: <Plug className="w-10 h-10" />,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
      hover: "hover:bg-yellow-100",
    },
    {
      name: "HVAC",
      icon: <Snowflake className="w-10 h-10" />,
      color: "text-green-500",
      bg: "bg-green-50",
      hover: "hover:bg-green-100",
    },
    {
      name: "Carpentry",
      icon: <Hammer className="w-10 h-10" />,
      color: "text-purple-500",
      bg: "bg-purple-50",
      hover: "hover:bg-purple-100",
    },
    {
      name: "Painting",
      icon: <Paintbrush className="w-10 h-10" />,
      color: "text-pink-500",
      bg: "bg-pink-50",
      hover: "hover:bg-pink-100",
    },
  ];

  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div
            className="absolute top-0 right-1/4 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 pt-32 pb-32 text-center">
          {/* Hero content */}
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50 mb-8 animate-fade-in-down">
              <span className="text-sm font-medium text-gray-700">
                🚀 Trusted by 10,000+ customers
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight animate-fade-in-down tracking-tight">
              Expert Home Services,{" "}
              <span className="bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
                Delivered
              </span>
            </h1>

            <p
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto animate-fade-in-down leading-relaxed"
              style={{ animationDelay: "0.2s" }}
            >
              Connect with verified professionals for plumbing, electrical,
              HVAC, and more.{" "}
              <span className="font-semibold text-gray-800">
                Quality guaranteed, hassle-free booking.
              </span>
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Link to="/serviceinfo" className="group relative px-8 py-4 bg-gradient-to-r from-gray-800 to-black text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 transform hover:scale-105">
                <span className="relative z-10">Book Service Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <button className="px-8 py-4 bg-white/90 backdrop-blur-sm text-gray-800 font-bold rounded-2xl border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="relative py-24">
        {/* Section background */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

        <div className="relative container mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our most requested home services, all backed by our
              quality guarantee
            </p>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {categories.map((cat, index) => (
              <div
                key={cat.name}
                className={`group relative flex flex-col items-center justify-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200/50 cursor-pointer transition-all duration-500 transform hover:scale-110 hover:shadow-2xl animate-fade-in-up shadow-lg`}
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                onClick={() => setPage("services")}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 ${cat.bg} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                {/* Icon */}
                <div
                  className={`relative z-10 ${cat.color} mb-4 p-3 rounded-2xl bg-white/50 group-hover:bg-white/80 transition-all duration-300`}
                >
                  {cat.icon}
                </div>

                {/* Name */}
                <span className="relative z-10 text-lg font-bold text-gray-800 text-center group-hover:text-gray-900 transition-colors duration-300">
                  {cat.name}
                </span>

                {/* Hover indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full group-hover:w-12 transition-all duration-300"></div>
              </div>
            ))}
          </div>

          {/* View all services button */}
          <div className="text-center mt-16">
            <button className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              View All Services →
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose FIXIFY?</h2>
            <p className="text-lg text-gray-600">Experience the difference with our premium service platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature Card 1 */}
            <div className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Verified Professionals</h3>
              <p className="text-gray-600 leading-relaxed">All service providers are thoroughly vetted, licensed, and insured for your peace of mind.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 Availability</h3>
              <p className="text-gray-600 leading-relaxed">Emergency services available around the clock. Book instantly or schedule for later.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fair Pricing</h3>
              <p className="text-gray-600 leading-relaxed">Transparent pricing with no hidden fees. Get quotes upfront and pay securely online.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-16 bg-gradient-to-r from-gray-800 to-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">10K+</div>
              <div className="text-gray-300 font-medium">Happy Customers</div>
            </div>
            <div className="group">
              <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
              <div className="text-gray-300 font-medium">Verified Pros</div>
            </div>
            <div className="group">
              <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
              <div className="text-gray-300 font-medium">Service Types</div>
            </div>
            <div className="group">
              <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">4.9★</div>
              <div className="text-gray-300 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Section */}
      {/* <div className="relative py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">
              Find Your Perfect <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Service</span>
            </h2>
            <p className="text-xl text-gray-300">Search by service type, location, or specific needs</p>
          </div>
          <SearchBar 
            onSearch={(data) => console.log('Search:', data)}
            onLocationChange={(loc) => console.log('Location:', loc)}
            onFilterChange={(filters) => console.log('Filters:', filters)}
          />
        </div>
      </div> */}

      {/* Chat Support */}
      <ChatSupport />
    </div>
  );
};

export default HomePage;
