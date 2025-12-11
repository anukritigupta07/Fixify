import React, { useState, useContext, useEffect, useRef } from "react";
import logo from "../assets/logo-png.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UtilityDataContext } from "../context/UtilityContext";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Briefcase, Phone, Award } from 'lucide-react';

const UtilitySignup = () => {
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setMail] = useState("");
  const [contact, setContact] = useState("");
  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState("");

  const navigate = useNavigate();
  const userContext = useContext(UtilityDataContext);
  const setUtility = userContext?.setUtility ?? (() => {});

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
        { idToken, role: 'provider' } // Send role as 'provider'
      );

      if (res.status === 200) {
        const data = res.data;
        localStorage.removeItem('userData');
        setUtility(data.user); // Backend sends 'user' key for both user and provider
        localStorage.setItem('token', data.token);
        localStorage.setItem('utilityData', JSON.stringify(data.user));
        navigate('/provider-landing'); // Assuming this is the correct redirect for providers
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
      contact: contact,
      profession: profession,
      experience: experience,
    };
    console.log(newUser);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/utilities/register`,
        newUser
        
      );
      console.log(response);

      if (response.status === 201) {
        const data = response.data;
        setUtility(data.utility);
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(
        error.response && error.response.status === 404
          ? "Signup endpoint not found. Please check your API URL and backend server."
          : "Signup failed. Please try again."
      );
    }

    // Reset form
    setFirstname("");
    setLastname("");
    setMail("");
    setPassword("");
    setContact("");
    setProfession("");
    setExperience("");
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-600/10 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 max-w-lg w-full p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
            <Briefcase className="h-10 w-10 text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Join as Provider</h1>
          <p className="text-gray-300">Start your journey as a service professional</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Name Fields */}
          <div>
            <label className="block text-gray-200 font-semibold mb-2">Full Name</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  value={Firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  type="text"
                  placeholder="First name"
                  className="w-full pl-12 pr-4 py-4 bg-slate-700/70 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                  required
                />
              </div>
              <input
                value={Lastname}
                onChange={(e) => setLastname(e.target.value)}
                type="text"
                placeholder="Last name"
                className="w-full px-4 py-4 bg-slate-700/70 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-200 font-semibold mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={Email}
                onChange={(e) => setMail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 bg-slate-700/70 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-200 font-semibold mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full pl-12 pr-12 py-4 bg-slate-700/70 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
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

          {/* Contact */}
          <div>
            <label className="block text-gray-200 font-semibold mb-2">Contact Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                maxLength={10}
                type="text"
                placeholder="Enter contact number"
                className="w-full pl-12 pr-4 py-4 bg-slate-700/70 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                required
              />
            </div>
          </div>

          {/* Profession & Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-200 font-semibold mb-2">Profession</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-700/70 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium transition-all duration-300 appearance-none cursor-pointer text-white"
                  required
                >
                  <option value="">Select</option>
                  <option value="plumber">Plumber</option>
                  <option value="electrician">Electrician</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="technician">Technician</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-200 font-semibold mb-2">Experience</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Award className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  type="number"
                  min="0"
                  placeholder="Years"
                  className="w-full pl-12 pr-4 py-4 bg-slate-700/70 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
          >
            Create Provider Account
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </form>

        {/* Google Signup */}
        <div className="mt-6 flex justify-center">
          <div ref={googleSignUpButtonRef}></div>
        </div>

        <p className="text-center text-gray-300 mt-6">
          Already have an account?{' '}
          <Link to="/utility-login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors duration-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UtilitySignup;
