import Player from '../models/player.model.js';
import Team from '../models/team.model.js';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

// @desc    Create a new player and add them to a team
// @route   POST /api/players
export const createPlayer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { teamId, firstName, lastName, position, number, email } = req.body;
    const coachId = req.user._id; // Assumes 'protect' middleware sets req.user

    // Validate input
    if (!teamId || !firstName || !lastName || !position || !email) {
      return res.status(400).json({ message: 'Team ID, first name, last name, position, and email are required.' });
    }

    // Check if the team exists and belongs to the coach
    const team = await Team.findOne({ _id: teamId, coach: coachId });
    if (!team) {
      return res.status(404).json({ message: 'Team not found or you are not authorized to manage it.' });
    }

    // Check if a user with this email already exists
    let user = await User.findOne({ email: email.toLowerCase() }).session(session);
    if (user) {
      // If user exists, check if they already have a player profile
      const existingPlayer = await Player.findOne({ user: user._id }).session(session);
      if (existingPlayer) {
        return res.status(400).json({ message: 'A player profile for this user already exists.' });
      }
    } else {
      // If user does not exist, create a new one
      user = new User({
        name: `${firstName} ${lastName}`,
        email: email.toLowerCase(),
        password: 'defaultPassword123', // A temporary default password
        role: 'player',
      });
      await user.save({ session });
    }

    // Create the new player
    const player = new Player({
      team: teamId,
      user: user._id,
      firstName,
      lastName,
      position,
      number,
    });
    await player.save({ session });

    // Add the new player's ID to the team's roster
    team.players.push(player._id);
    await team.save({ session });

    await session.commitTransaction();

    res.status(201).json({ message: 'Player created and added to the team successfully.', player });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Server Error: Could not create player.', error: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Get all players for a specific team
// @route   GET /api/players/team/:teamId
export const getPlayersForTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const players = await Player.find({ team: teamId });
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch players.', error: error.message });
  }
};

// @desc    Get a single player by their ID
// @route   GET /api/players/:id
export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found.' });
    }
    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch player.', error: error.message });
  }
};

// @desc    Update a player's details
// @route   PUT /api/players/:id
export const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const coachId = req.user._id;

    // Find the player and verify the coach's authorization
    const playerToUpdate = await Player.findById(id);
    if (!playerToUpdate) {
      return res.status(404).json({ message: 'Player not found.' });
    }
    const team = await Team.findOne({ _id: playerToUpdate.team, coach: coachId });
    if (!team) {
      return res.status(403).json({ message: 'User not authorized to update this player.' });
    }

    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true,
    });

    if (!player) {
      return res.status(404).json({ message: 'Player not found.' });
    }
    res.status(200).json({ message: 'Player updated successfully.', player });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not update player.', error: error.message });
  }
};

// @desc    Delete a player from a team
// @route   DELETE /api/players/:id
export const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const coachId = req.user._id;

    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({ message: 'Player not found.' });
    }

    // Verify the coach owns the team this player belongs to
    const team = await Team.findOne({ _id: player.team, coach: coachId });
    if (!team) {
      return res.status(403).json({ message: 'User not authorized to delete this player.' });
    }

    const teamId = player.team;

    // Remove the player from the database
    await player.deleteOne();

    // Remove the player's reference from the team's roster
    await Team.findByIdAndUpdate(teamId, { $pull: { players: id } });

    // Optional: Delete the associated User account if they have no other roles/teams
    // await User.findByIdAndDelete(player.user);

    res.status(200).json({ message: 'Player deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not delete player.', error: error.message });
  }
};