import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
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
export default function CoachSignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    teamName: "", 
    role: "Coach", 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_ENDPOINT = "/api/v1/auth/register"; 
      
      // Combine firstName and lastName for submission if the backend expects a single 'fullName'
      const submissionData = {
          ...formData,
          fullName: `${formData.firstName} ${formData.lastName}`
      }
      // Remove individual first/last name if not needed by backend
      delete submissionData.firstName;
      delete submissionData.lastName;

      console.log("Submitting coach registration:", submissionData);
      toast.info("Registering your coach account...");

      const res = await axios.post(API_ENDPOINT, submissionData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/"); 
        toast.success(res.data.message || "Registration successful!");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
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
              
              <h1 className="text-3xl font-bold text-gray-7s00  -mt-4">Hi coach!</h1>
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
          
          <InputField type="text" name="teamName" placeholder="Team Name" value={formData.teamName} onChange={handleChange} />
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
        </div>
    </div>
  );
}