import React, { useState, useContext } from "react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-lg w-full p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
            <Briefcase className="h-10 w-10 text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Join as Provider</h1>
          <p className="text-gray-600">Start your journey as a service professional</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Name Fields */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
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
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium transition-all duration-300"
                  required
                />
              </div>
              <input
                value={Lastname}
                onChange={(e) => setLastname(e.target.value)}
                type="text"
                placeholder="Last name"
                className="w-full px-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium transition-all duration-300"
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
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium transition-all duration-300"
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
                className="w-full pl-12 pr-12 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium transition-all duration-300"
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
            <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
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
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Profession & Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Profession</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium transition-all duration-300 appearance-none cursor-pointer"
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
              <label className="block text-gray-700 font-semibold mb-2">Experience</label>
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
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium transition-all duration-300"
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

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/utility-login" className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UtilitySignup;
