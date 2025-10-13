import React, { useState } from 'react';
import { User, Mail, Lock, Footprints, Weight, Ruler, ChevronDown } from 'lucide-react';

// --- Data for dropdowns ---
const positions = [
  "Goalkeeper", "Centre-Back", "Right-Back", "Left-Back", 
  "Defensive Midfielder", "Central Midfielder", "Attacking Midfielder",
  "Right Winger", "Left Winger", "Striker"
];

const preferredFootOptions = ["Right", "Left"];

// --- Reusable Input Component ---
const InputField = ({ icon: Icon, type, placeholder, value, onChange, name }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="text-gray-400" size={20} />
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      required
    />
  </div>
);

// --- Reusable Select Component ---
const SelectField = ({ icon: Icon, value, onChange, name, options, placeholder }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="text-gray-400" size={20} />
        </div>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
        >
            <option value="" disabled>{placeholder}</option>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="text-gray-400" size={20} />
        </div>
    </div>
);


// --- Main Signup Page Component ---
export default function PlayerSignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    height: '',
    weight: '',
    preferredFoot: '',
    position: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend API
    console.log('Form Submitted:', formData);
    // Here you would typically make an API call:
    // axios.post('/api/players/signup', formData)
    //   .then(response => { ... })
    //   .catch(error => { ... });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">
              Join <span className="text-blue-600">TactAIQ</span>
            </h1>
            <p className="text-gray-500 mt-2">Create your player profile to get started.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField icon={User} type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
              <InputField icon={Mail} type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
            </div>
            
            <InputField icon={Lock} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />

            <div className="border-t border-gray-200 pt-6">
                 <h2 className="text-xl font-semibold text-gray-700 mb-4">Player Details</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField icon={Ruler} type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} />
                    <InputField icon={Weight} type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} />
                    <SelectField icon={Footprints} name="preferredFoot" placeholder="Preferred Foot" value={formData.preferredFoot} onChange={handleChange} options={preferredFootOptions} />
                    <SelectField icon={User} name="position" placeholder="Position" value={formData.position} onChange={handleChange} options={positions} />
                 </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
