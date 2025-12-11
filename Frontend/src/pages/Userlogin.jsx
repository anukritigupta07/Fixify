import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Userlogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const userContext = useContext(UserDataContext);
  const setUser = userContext?.setUser ?? (() => {});

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
        { idToken }
      );

      if (res.status === 200) {
        const data = res.data;
        localStorage.removeItem('utilityData');
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify({ ...data.user, _id: data.user.id })); // Ensure _id is present
        navigate('/portal');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setMessage('Google login failed. Please try again.');
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setMessage('');

    const userData = { email, password };

    setEmail('');
    setPassword('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData
      );

      if (response.status === 200) {
        const data = response.data;
        // Clear any provider data
        localStorage.removeItem('utilityData');
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        navigate('/portal');
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
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-blue-200/30 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-emerald-200/30 rounded-full filter blur-3xl opacity-40 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/20 rounded-full filter blur-3xl opacity-30"></div>
      </div>

      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 max-w-md w-full p-6 sm:p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-gradient-to-br from-[#0047AB] to-[#10B981] rounded-2xl shadow-lg">
            <User className="h-10 w-10 text-white" />
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#0047AB] to-[#10B981] bg-clip-text text-transparent mb-2">Welcome Back!</h1>
          <p className="text-sm sm:text-base text-gray-600">Sign in to access your account</p>
        </div>

        {message && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm mb-6 animate-fade-in-down">
            {message}
          </div>
        )}

        <form onSubmit={loginHandler} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
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
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/70 border border-blue-200/50 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent font-medium transition-all duration-300 text-sm sm:text-base shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
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
                className="w-full pl-12 pr-12 py-3 sm:py-4 bg-white/70 border border-blue-200/50 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent font-medium transition-all duration-300 text-sm sm:text-base shadow-sm"
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
            className="w-full bg-gradient-to-r from-[#0047AB] to-[#10B981] text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
          >
            Sign In
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#0047AB] font-semibold hover:text-[#10B981] transition-colors duration-300">
            Create one
          </Link>
        </p>

        {/* Google Login */}
        <div className="mt-6 flex justify-center">
          <div ref={googleSignInButtonRef}></div>
        </div>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-500 font-medium">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <Link
          to="/utility-login"
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
        >
          Sign in as Service Provider
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
};

export default Userlogin;
