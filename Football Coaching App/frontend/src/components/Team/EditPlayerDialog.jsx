import React, { useState } from 'react';
import axios from 'axios';

const UpdateProfileDialog = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    surname: user.surname || '',
    phoneNumber: user.phoneNumber || '',
    country: user.location?.country || '',
    city: user.location?.city || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/auth/update-profile', {
        ...formData,
      }, { headers: { Authorization: `Bearer ${token}` } });
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dialog">
      <h3>Update Profile</h3>
      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
      <input type="text" name="surname" value={formData.surname} onChange={handleChange} />
      <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
      <input type="text" name="country" value={formData.country} onChange={handleChange} />
      <input type="text" name="city" value={formData.city} onChange={handleChange} />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default UpdateProfileDialog;
