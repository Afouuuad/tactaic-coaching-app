import Activity from '../models/activity.model.js';
import User from '../models/user.model.js';
import getDataUri from '../utils/datauri.js'; // Helper for file uploads
import cloudinary from '../utils/cloudinary.js'; // Cloudinary configuration

// @desc    Create a new training activity
// @route   POST /api/activities
export const createActivity = async (req, res) => {
  try {
    const { title, description, duration, category } = req.body;
    const coachId = req.user._id; // From 'protect' middleware

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    let mediaUrl = '';
    const file = req.file;

    // If an image file is uploaded, send it to Cloudinary
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      mediaUrl = cloudResponse.secure_url;
    }

    const activity = new Activity({
      title,
      description,
      duration,
      category,
      coach: coachId,
      mediaUrl,
    });

    await activity.save();
    res.status(201).json({ message: 'Activity created successfully.', activity });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not create activity.', error: error.message });
  }
};

// @desc    Get all activities for the logged-in coach
// @route   GET /api/activities
export const getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ coach: req.user._id });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch activities.', error: error.message });
  }
};

// @desc    Get a single activity by its ID
// @route   GET /api/activities/:id
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch activity.', error: error.message });
  }
};

// @desc    Update an activity
// @route   PUT /api/activities/:id
export const updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }

    // Check if the user is the owner of the activity
    if (activity.coach.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to update this activity.' });
    }

    // Handle new file upload if present
    const file = req.file;
    if (file) {
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        req.body.mediaUrl = cloudResponse.secure_url;
    }

    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ message: 'Activity updated successfully.', activity: updatedActivity });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not update activity.', error: error.message });
  }
};

// @desc    Delete an activity
// @route   DELETE /api/activities/:id
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }

    // Check if the user is the owner of the activity
    if (activity.coach.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized to delete this activity.' });
    }

    await activity.deleteOne();
    res.status(200).json({ message: 'Activity deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not delete activity.', error: error.message });
  }
};

