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
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch teams.', error: error.message });
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
  } catch (error)
 {
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