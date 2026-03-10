import Team from '../models/team.model.js';
import User from '../models/user.model.js';
import Player from '../models/player.model.js';
import mongoose from 'mongoose';

// @desc    Create a new team
// @route   POST /api/team
export const createTeam = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name } = req.body;
    const coachId = req.user._id; // Assumes 'protect' middleware sets req.user

    if (!name) {
      return res.status(400).json({ message: 'Team name is required.' });
    }

    // Create the new team and assign the current user as the coach
    const team = new Team({
      name,
      coach: coachId,
    });

    await team.save({ session });

    // Add this team to the user's list of teams
    await User.findByIdAndUpdate(coachId, { $push: { teams: team._id } }, { session });

    await session.commitTransaction();

    res.status(201).json({ message: 'Team created successfully.', team });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Server Error: Could not create team.', error: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Get all teams for the currently logged-in coach
// @route   GET /api/team/myteams
export const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ coach: req.user._id });
    res.status(200).json({
      success: true,
      teams
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Could not fetch teams.', error: error.message });
  }
};

// @desc    Get a single team by its ID, populating its player roster
// @route   GET /api/team/:id
export const getTeamById = async (req, res) => {
  try {
    // Populate the 'players' field with details from the Player collection
    const team = await Team.findById(req.params.id).populate('players', 'firstName lastName position number');

    if (!team) {
      return res.status(404).json({ message: 'Team not found.' });
    }

    // Optional: Check if the requesting user is the coach of the team
    if (team.coach.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to view this team.' });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch team.', error: error.message });
  }
};

// @desc    Update a team's details (e.g., name)
// @route   PUT /api/team/:id
export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found.' });
    }

    // Ensure the user updating the team is the coach
    if (team.coach.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to update this team.' });
    }

    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: 'Team updated successfully.', team: updatedTeam });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not update team.', error: error.message });
  }
};

// @desc    Delete a team
// @route   DELETE /api/team/:id
export const deleteTeam = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found.' });
    }

    // Ensure the user deleting the team is the coach
    if (team.coach.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this team.' });
    }

    const teamId = req.params.id;
    const coachId = req.user._id;

    // Optional: Also delete all players associated with this team
    await Player.deleteMany({ team: teamId }).session(session);

    // Remove the team's reference from the coach's 'teams' array
    await User.findByIdAndUpdate(coachId, { $pull: { teams: teamId } }).session(session);

    // Remove the team
    await team.deleteOne({ session });

    await session.commitTransaction();

    res.status(200).json({ message: 'Team and all associated players deleted successfully.' });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Server Error: Could not delete team.', error: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Handle team setup for a coach
// @route   POST /api/team/setup
// @access  Private
export const setupTeam = async (req, res) => {
  try {
    // Frontend sends 'name' for club name
    const {
      name,
      ageGroup,
      division,
      philosophy,
      homeGround,
      teamFormat,
      yearsOfExperience,
      coachingLicense,
      specialization,
      bio
    } = req.body;
    const teamLogo = req.files?.teamLogo?.[0]?.filename;
    const profilePicture = req.files?.profilePicture?.[0]?.filename;

    if (!name) {
      return res.status(400).json({ message: 'Team name is required.' });
    }

    const coachId = req.user._id;

    console.log('--- Team Setup Request (Safe Mode) ---');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('User:', req.user?._id);

    // 1. Create the Team document
    const team = new Team({
      name,
      coach: coachId,
      ageGroup,
      division,
      philosophy,
      homeGround,
      teamFormat,
      teamLogo
    });
    console.log('Saving team...');
    await team.save();

    // 2. Update the User's profile and push team ID
    const updateData = {
      teamName: name,
      yearsOfExperience: parseInt(yearsOfExperience) || 0,
      coachingLicense,
      specialization,
      bio,
      $push: { teams: team._id }
    };
    if (teamLogo) updateData.teamLogo = teamLogo;
    if (profilePicture) updateData.profilePicture = profilePicture;

    console.log('Updating user with data:', JSON.stringify(updateData, null, 2));
    const user = await User.findByIdAndUpdate(
      coachId,
      updateData,
      { new: true }
    );

    if (!user) {
      console.error('User not found during update:', coachId);
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    console.log('Setup completed successfully (Non-Transactional)');

    res.status(200).json({
      success: true,
      message: 'Team setup completed successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        teams: user.teams,
        teamName: user.teamName,
        teamLogo: user.teamLogo,
        profilePicture: user.profilePicture,
        yearsOfExperience: user.yearsOfExperience,
        coachingLicense: user.coachingLicense,
        specialization: user.specialization,
        bio: user.bio
      },
      team
    });
  } catch (error) {
    console.error('CRITICAL ERROR during team setup:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error: error.message });
  }
};