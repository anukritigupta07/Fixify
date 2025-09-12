import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, X as XIcon } from "lucide-react";

import HomePage from './MainContent';
import NavLinkContent from './NavLinkContent';
import Footer from './Footer';

const Portal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation */}
      <NavLinkContent/>
      
      {/* Main Content with enhanced styling */}
      <main className="relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Content wrapper with glass morphism effect */}
        <div className="relative backdrop-blur-sm">
          <HomePage/>
        </div>
      </main>
      
      {/* Footer */}
      <Footer/>
    </div>
  )
}

export default Portal