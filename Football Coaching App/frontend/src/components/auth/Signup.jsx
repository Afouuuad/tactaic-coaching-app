import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import axios from 'axios';
import { Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { AUTH_API_END_POINT } from '@/utils/constant';


// --- Reusable Input Component for the light theme ---
const InputField = ({ icon: Icon, type, placeholder, value, onChange, name }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="text-gray-400" size={20} />
      </div>
    )}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 transition-colors`}
      required
    />
  </div>
);

// --- Main Coach Signup Page Component ---
export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Coach", // Default role set here
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submissionData = {
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        role: "coach" // Backend expects lowercase 'coach'
      };

      console.log("Submitting coach registration:", submissionData);

      toast.info("Registering your coach account...", {
        style: { backgroundColor: "#007BFF", color: "#FFFFFF" },
      });

      const res = await axios.post(`${AUTH_API_END_POINT}/register`, submissionData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      // Check for success property from your backend response
      if (res.data.success || res.status === 201) {
        toast.success(res.data.message || "Welcome to TactAIQ!", {
          style: { backgroundColor: "#28a745", color: "#FFFFFF" },
        });

        if (res.data.user) {
          dispatch(setUser(res.data)); // Fix: Pass res.data to include token
        }

        // Redirect to Team Setup immediately
        navigate("/team-setup");
      }
    } catch (error) {
      // Log the specific backend reason (e.g., 'Email already exists') found in the Network > Response tab
      console.error("Registration Error Details:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Registration failed. Please check your details.";
      toast.error(errorMessage, {
        style: { backgroundColor: "#dc3545", color: "#FFFFFF" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">

        <form onSubmit={handleSubmit} className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl space-y-6">
          <div className="text-center mb-6">
            <Link to="/">
              <img src="/Logo_2.png" alt="TactAIQ Logo" className="h-[220px] w-auto mx-auto -mt-14 " />
            </Link>

            <h1 className="text-3xl font-bold text-gray-700 -mt-4">Hi coach!</h1>
            <p className="text-cyan-500 mt-2">Ready to Master the Plan?</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-1/2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">First Name</label>
              <InputField type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="w-1/2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name</label>
              <InputField type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
            </div>
          </div>

          <InputField icon={Mail} type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
          <InputField icon={Lock} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />

          <div className="pt-2">
            {loading ? (
              <button className="w-full flex justify-center items-center py-3 px-4 bg-blue-400 text-white font-semibold rounded-lg cursor-not-allowed" disabled>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Creating Account...
              </button>
            ) : (
              <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md">
                Create Account
              </button>
            )}
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:underline">Login here</Link>
          </p>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Are you a player? <Link to="/player-signup" className="text-blue-500 font-medium hover:underline">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}