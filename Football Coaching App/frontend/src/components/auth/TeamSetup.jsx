import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

export default function TeamSetup() {
  const [formData, setFormData] = useState({
    teamName: '',
    teamLogo: null,
    profilePicture: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('teamName', formData.teamName);
    formDataToSend.append('teamLogo', formData.teamLogo);
    formDataToSend.append('profilePicture', formData.profilePicture);

    try {
      const res = await axios.post('/api/team/setup', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Team setup completed successfully!');
        navigate('/coach-dashboard');
      }
    } catch (error) {
      console.error('Team Setup Error:', error);
      toast.error(error.response?.data?.message || 'Failed to set up the team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl space-y-6">
          <h1 className="text-2xl font-bold text-center">Set Up Your Team</h1>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Team Name</label>
            <input
              type="text"
              name="teamName"
              placeholder="Enter your team name"
              value={formData.teamName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Team Logo</label>
            <input
              type="file"
              name="teamLogo"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              required
            />
          </div>

          <div className="pt-2">
            {loading ? (
              <button
                className="w-full flex justify-center items-center py-3 px-4 bg-blue-400 text-white font-semibold rounded-lg cursor-not-allowed"
                disabled
              >
                Setting Up Team...
              </button>
            ) : (
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
              >
                Complete Setup
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}