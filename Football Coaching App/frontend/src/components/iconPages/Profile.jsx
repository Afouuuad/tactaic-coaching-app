import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateProfileDialog from '../Team/EditPlayerDialog';
import { USER_API_END_POINT } from '@/utils/constant';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${USER_API_END_POINT}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setUser(res.data.user || res.data))
      .catch((err) => {
        console.error(err);
        setError("Unable to fetch profile.");
      });
  }, []);

  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (!user) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-lg shadow-md mt-10">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.profilePic || "https://ui-avatars.com/api/?name=User"}
          alt="User"
          className="w-20 h-20 rounded-full border"
        />
        <div>
          <h2 className="text-2xl font-semibold text-[#003366]">{user.firstName} {user.surname}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="text-[#003366] space-y-2">
        <p><strong>Role:</strong> {user.role || "N/A"}</p>
        <p><strong>Location:</strong> {user.location?.city || "—"}, {user.location?.country || "—"}</p>
        {/* Add more profile fields if needed */}
      </div>

      <button
        onClick={() => setShowDialog(true)}
        className="mt-6 px-4 py-2 bg-[#003366] text-white rounded hover:bg-[#002244]"
      >
        Update Profile
      </button>

      {showDialog && (
        <UpdateProfileDialog user={user} onClose={() => setShowDialog(false)} />
      )}
    </div>
  );
};

export default Profile;
