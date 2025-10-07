import React, { useState, useEffect } from "react";
import { MapPin, Wrench, Plug, Snowflake, Hammer, Paintbrush, Star, CheckCircle, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import logo from '../assets/logo-png.png';

const MainContent = () => {
  const heroImages = [
    'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952)',
    'url(https://images.unsplash.com/photo-1621905251189-08b45d6a269e)',
    'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64)',
    'url(https://images.unsplash.com/photo-1581244277943-fe4a9c777189)',
    'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd)'
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const services = [
    { icon: Wrench, title: "Plumbing", desc: "Professional plumbing services", color: "text-blue-500" },
    { icon: Plug, title: "Electrical", desc: "Expert electrical repairs", color: "text-yellow-500" },
    { icon: Snowflake, title: "HVAC", desc: "Heating and cooling solutions", color: "text-cyan-500" },
    { icon: Hammer, title: "Carpentry", desc: "Custom woodwork and repairs", color: "text-orange-500" },
    { icon: Paintbrush, title: "Painting", desc: "Interior and exterior painting", color: "text-purple-500" },
    { icon: MapPin, title: "Location Services", desc: "Find services near you", color: "text-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-particle absolute top-0 left-1/4 w-2 h-2 bg-blue-400 rounded-full"></div>
        <div className="animate-particle animation-delay-2000 absolute top-0 left-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>
        <div className="animate-particle animation-delay-4000 absolute top-0 left-3/4 w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: heroImages[currentImage] }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in-down">
            <img src={logo} alt="Logo" className="mx-auto mb-8 w-32 h-32 animate-float" />
            <h1 className="text-6xl font-bold text-white mb-6 animate-gradient-xy">
              Welcome to Our Service Portal
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Discover and book the best local services in your area. From plumbing to painting, we've got you covered.
            </p>
            <Link to="/services" className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 animate-glow">
              Explore Services
            </Link>
          </div>
        </div>
        {/* Blob animation */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 animate-fade-in-up">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 glass animate-slide-in-left"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <service.icon className={`w-16 h-16 ${service.color} mb-6 animate-float`} />
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.desc}</p>
                <Link to={`/services/${service.title.toLowerCase()}`} className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-100 to-purple-100">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 animate-fade-in-up">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-slide-in-left">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-semibold mb-4">Quality Guaranteed</h3>
              <p className="text-gray-600">All our services come with a satisfaction guarantee.</p>
            </div>
            <div className="text-center animate-slide-in-right animation-delay-2000">
              <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-semibold mb-4">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support for all your needs.</p>
            </div>
            <div className="text-center animate-slide-in-left animation-delay-4000">
              <Shield className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-2xl font-semibold mb-4">Secure & Safe</h3>
              <p className="text-gray-600">Your data and transactions are fully protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 animate-fade-in-up">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 0.3}s` }}>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-gray-600 mb-4">"Excellent service! Highly recommend to everyone."</p>
                <p className="font-semibold text-gray-800">- Happy Customer {i}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 animate-fade-in-down">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers today.</p>
          <Link to="/signup" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 animate-glow">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MainContent;
