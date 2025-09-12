import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-white/90 backdrop-blur-xl border-t border-gray-200/50 text-gray-900 shadow-2xl">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white/50 to-gray-100/50"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-8">
        
        {/* Enhanced Logo & About */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-gray-800 to-black rounded-xl shadow-lg">
              <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">Fixify</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Your trusted partner for hassle-free home services.  
            Book plumbers, electricians, cleaners, and more with just one click.
          </p>
        </div>

        {/* Enhanced Quick Links */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h3>
          <ul className="space-y-3">
            <li><Link to="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-300 font-medium">Home</Link></li>
            <li><Link to="/services" className="text-gray-600 hover:text-gray-800 transition-colors duration-300 font-medium">Services</Link></li>
            <li><Link to="/about" className="text-gray-600 hover:text-gray-800 transition-colors duration-300 font-medium">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-600 hover:text-gray-800 transition-colors duration-300 font-medium">Contact</Link></li>
          </ul>
        </div>

        {/* Enhanced Contact Info */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Contact</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors duration-300">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Phone size={16} className="text-gray-700"/>
              </div>
              <span className="font-medium">+91 9876543210</span>
            </li>
            <li className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors duration-300">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Mail size={16} className="text-gray-700"/>
              </div>
              <span className="font-medium">support@fixify.com</span>
            </li>
            <li className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors duration-300">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MapPin size={16} className="text-gray-700"/>
              </div>
              <span className="font-medium">Lucknow, Uttar Pradesh</span>
            </li>
          </ul>
        </div>

        {/* Enhanced Socials */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-110">
              <Facebook size={20} className="text-gray-700"/>
            </a>
            <a href="#" className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-110">
              <Twitter size={20} className="text-gray-700"/>
            </a>
            <a href="#" className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-110">
              <Instagram size={20} className="text-gray-700"/>
            </a>
          </div>
          
          {/* Newsletter signup */}
          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-3">Stay updated with our latest offers</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="flex-1 px-3 py-2 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Bar */}
      <div className="relative border-t border-gray-200/50 text-center py-6">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6">
          <p className="text-gray-600 font-medium">
            © {new Date().getFullYear()} Fixify. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-600 hover:text-gray-800 transition-colors duration-300 text-sm font-medium">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-800 transition-colors duration-300 text-sm font-medium">Terms of Service</Link>
            <Link to="/cookies" className="text-gray-600 hover:text-gray-800 transition-colors duration-300 text-sm font-medium">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
