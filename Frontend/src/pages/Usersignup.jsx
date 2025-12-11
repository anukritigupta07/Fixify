import logo from '../assets/logo-png.png';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect, useRef } from 'react';
import { UserDataContext } from '../context/UserContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react';

const Usersignup = () => {
  const [Firstname, setFirstname] = useState('');
  const [Lastname, setLastname] = useState('');
  const [Password, setPassword] = useState('');
  const [Email, setMail] = useState('');
  const [Phone, setPhone] = useState('');

  const navigate = useNavigate();
  const userContext = useContext(UserDataContext);
  const setUser = userContext?.setUser ?? (() => {});

  const googleSignUpButtonRef = useRef(null);
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error("VITE_GOOGLE_CLIENT_ID is not defined");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleSignup,
    });

    if (googleSignUpButtonRef.current) {
      window.google.accounts.id.renderButton(
        googleSignUpButtonRef.current,
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

  const handleGoogleSignup = async (response) => {
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
      console.error('Google signup error:', error);
      alert('Google signup failed. Please try again.');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: Firstname,
        lastname: Lastname,
      },
      email: Email,
      password: Password,
      phone: Phone,
    };
   

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );
      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        navigate('/portal');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert(
        error.response && error.response.status === 404
          ? 'Signup endpoint not found. Please check your API URL and backend server.'
          : 'Signup failed. Please try again.'
      );
    }

    setFirstname('');
    setLastname('');
    setMail('');
    setPassword('');
    setPhone('');
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
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-[#0047AB] to-[#10B981] rounded-2xl shadow-lg">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#0047AB] to-[#10B981] bg-clip-text text-transparent mb-2">Create Account</h1>
          <p className="text-sm sm:text-base text-gray-600">Join thousands of satisfied customers</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4 sm:space-y-6">
          {/* Name Fields */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  value={Firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  type="text"
                  placeholder="First Name"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/70 border border-blue-200/50 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent font-medium transition-all duration-300 text-sm sm:text-base shadow-sm"
                  required
                />
              </div>
              <input
                value={Lastname}
                onChange={(e) => setLastname(e.target.value)}
                type="text"
                placeholder="Last name"
                className="w-full px-4 py-3 sm:py-4 bg-white/70 border border-blue-200/50 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent font-medium transition-all duration-300 text-sm sm:text-base shadow-sm"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={Email}
                onChange={(e) => setMail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full pl-12 pr-12 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium transition-all duration-300"
                required
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

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <input
                value={Phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                maxLength={10}
                placeholder="Enter your phone number"
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium transition-all duration-300"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0047AB] to-[#10B981] text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
          >
            Create Account
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </form>

        {/* Google Signup */}
        <div className="mt-6 flex justify-center">
          <div ref={googleSignUpButtonRef}></div>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0047AB] font-semibold hover:text-[#10B981] transition-colors duration-300">
            Sign in
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-500 font-medium">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <Link
          to="/utility-signup"
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
        >
          Join as Service Provider
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
};

export default Usersignup;
