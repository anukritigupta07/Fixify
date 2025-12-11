import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UtilityDataContext } from "../context/UtilityContext";
import { Mail, Lock, Briefcase, Eye, EyeOff, ArrowRight } from 'lucide-react';

const UtilityLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const googleSignInButtonRef = useRef(null);
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error("VITE_GOOGLE_CLIENT_ID is not defined");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });

    if (googleSignInButtonRef.current) {
      window.google.accounts.id.renderButton(
        googleSignInButtonRef.current,
        {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: '300',
        }
      );
    }
  }, [GOOGLE_CLIENT_ID]);

  const handleGoogleLogin = async (response) => {
    const idToken = response.credential;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/google`,
        { idToken, role: 'provider' } // Send role as 'provider'
      );

      if (res.status === 200) {
        const data = res.data;
        localStorage.removeItem('userData');
        setUtility(data.user); // Backend sends 'user' key for both user and provider
        localStorage.setItem('token', data.token);
        localStorage.setItem('utilityData', JSON.stringify(data.user));
        navigate('/provider-landing');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setMessage('Google login failed. Please try again.');
    }
  };

  // Check if provider is already logged in
  useEffect(() => {
    const utilityData = localStorage.getItem('utilityData');
    const token = localStorage.getItem('token');
    if (utilityData && token) {
      navigate('/provider-landing');
    }
  }, [navigate]);
  const userContext = useContext(UtilityDataContext);
  const setUtility = userContext?.setUtility ?? (() => {});

  const loginHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const userData = { email, password };

    setEmail('');
    setPassword('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/utilities/login`,
        userData
      );

      if (response.status === 200) {
        const data = response.data;
        // Clear any user data
        localStorage.removeItem('userData');
        setUtility(data.utility);
        localStorage.setItem('token', data.token);
        localStorage.setItem('utilityData', JSON.stringify(data.utility));
        navigate('/provider-landing');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 401) {
        setMessage('Invalid email or password. Please try again.');
      } else if (error.response) {
        setMessage(`Login failed. Server responded with status ${error.response.status}.`);
      } else {
        setMessage('Login failed. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  }


  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-emerald-500/20 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-indigo-500/20 rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-600/10 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700/50 max-w-md w-full p-6 sm:p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
            <Briefcase className="h-10 w-10 text-white" />
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Provider Portal</h1>
          <p className="text-sm sm:text-base text-gray-300">Sign in to manage your services</p>
        </div>

        {message && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm mb-6 animate-fade-in-down">
            {message}
          </div>
        )}

        <form onSubmit={loginHandler} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-gray-200 font-semibold mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-700/70 border border-slate-600/50 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium transition-all duration-300 text-sm sm:text-base text-white placeholder-gray-400 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-200 font-semibold mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3 sm:py-4 bg-slate-700/70 border border-slate-600/50 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium transition-all duration-300 text-sm sm:text-base text-white placeholder-gray-400 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </form>

        {/* Google Login */}
        <div className="mt-6 flex justify-center">
          <div ref={googleSignInButtonRef}></div>
        </div>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-slate-600"></div>
          <span className="mx-4 text-gray-400 font-medium">OR</span>
          <div className="flex-grow border-t border-slate-600"></div>
        </div>

        <Link
          to="/login"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
        >
          Sign in as Customer
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
};

export default UtilityLogin;