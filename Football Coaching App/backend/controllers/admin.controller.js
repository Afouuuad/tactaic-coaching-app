import User from '../models/user.model.js';
import Job from '../models/job.model.js';
import Application from '../models/application.model.js';

// Get all users (customers and applicants)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a user account (e.g., role update, suspension, verification)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // e.g., { role: 'customer', isSuspended: true }
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a user account
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get system reports (dummy example: counts of users, jobs, applications)
export const getReports = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();
    res.json({ userCount, jobCount, applicationCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
