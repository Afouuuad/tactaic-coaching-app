import User from '../models/user.model.js';
import Team from '../models/team.model.js';
import Player from '../models/player.model.js';
import Event from '../models/event.model.js';
import Activity from '../models/activity.model.js';

// @desc    Get all users (coaches and players)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users and exclude their passwords for security
    const users = await User.find({}, '-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error: Could not fetch users.', error: err.message });
  }
};

// @desc    Update a user's account details (e.g., role, isSuspended)
// @route   PUT /api/admin/users/:id
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // e.g., { role: 'coach', isSuspended: true }

    // Find the user by ID and update them with the new data
    // { new: true } ensures the updated document is returned
    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User updated successfully.', user });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: Could not update user.', error: err.message });
  }
};

// @desc    Delete a user account
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    // Optional: Add logic here to also delete associated players, teams etc.
    
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: Could not delete user.', error: err.message });
  }
};

// @desc    Get system reports (counts of all major data models)
// @route   GET /api/admin/reports
export const generateReports = async (req, res) => {
  try {
    // Run all count queries in parallel for efficiency
    const [userCount, teamCount, playerCount, eventCount, activityCount] = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Player.countDocuments(),
      Event.countDocuments(),
      Activity.countDocuments()
    ]);
    
    res.status(200).json({
      users: userCount,
      teams: teamCount,
      players: playerCount,
      events: eventCount,
      activities: activityCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: Could not generate reports.', error: err.message });
  }
};

