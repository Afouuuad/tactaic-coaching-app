import Player from '../models/player.model.js';
import Team from '../models/team.model.js';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import { calculateRoleFits } from '../utils/tacticalEngine.js';

// @desc    Create a new player and add them to a team
// @route   POST /api/players
export const createPlayer = async (req, res) => {
  try {
    const { teamId, firstName, lastName, position, number, email, attributes, dateOfBirth, age, height, weight, preferredFoot } = req.body;
    const coachId = req.user._id;

    console.log('[createPlayer] Request received:', { teamId, firstName, lastName, coachId });

    // Validate input
    if (!teamId || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: teamId, firstName, and lastName are mandatory.'
      });
    }

    // Auto-generate email if not provided
    const playerEmail = email ? email.toLowerCase() : `${firstName.toLowerCase().replace(/\s/g, '')}.${lastName.toLowerCase().replace(/\s/g, '')}.${Date.now()}@tactaiq.test`;

    // Check if the team exists and belongs to the coach
    const team = await Team.findOne({ _id: teamId, coach: coachId });
    if (!team) {
      console.warn('[createPlayer] Team not found/authorized:', { teamId, coachId });
      return res.status(404).json({ success: false, message: 'Team not found or you are not authorized to manage it.' });
    }
    console.log('[createPlayer] Team verified:', team.name);

    // Check if a user with this email already exists
    let user = await User.findOne({ email: playerEmail });
    if (user) {
      // If user exists, check if they already have a player profile
      const existingPlayer = await Player.findOne({ user: user._id });
      if (existingPlayer) {
        return res.status(400).json({ success: false, message: 'A player profile for this user already exists.' });
      }
    } else {
      // Create a new user account for the player (no session = bcrypt hook works fine)
      user = new User({
        name: `${firstName} ${lastName}`,
        email: playerEmail,
        password: 'defaultPassword123',
        role: 'player',
      });
      console.log('[createPlayer] Saving new user...');
      await user.save();
      console.log('[createPlayer] User saved:', user._id);
    }

    // Calculate Role Fits (gracefully handles empty/missing attributes)
    const { roleFits, bestRole, emergencyRoles } = calculateRoleFits(attributes || {});

    // Create the new player
    const player = new Player({
      team: teamId,
      user: user._id,
      firstName,
      lastName,
      position: position || 'Not Assigned',
      number,
      dateOfBirth,
      age,
      height,
      weight,
      preferredFoot: preferredFoot || 'Right',
      attributes,
      roleFits,
      bestRole,
      emergencyRoles,
    });
    console.log('[createPlayer] Saving new player...');
    await player.save();
    console.log('[createPlayer] Player saved:', player._id);

    // Add the new player's ID to the team's roster
    await Team.findByIdAndUpdate(teamId, { $push: { players: player._id } });

    res.status(201).json({
      success: true,
      message: 'Player created and added to the team successfully.',
      player
    });
  } catch (error) {
    // Write full error to a file for debugging
    const fs = await import('fs');
    const errorLog = `[${new Date().toISOString()}] createPlayer Error:\n${error.stack || error.message}\n\nFull error: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}\n`;
    fs.writeFileSync(new URL('../debug_error.log', import.meta.url), errorLog);
    console.error('[createPlayer] Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error: Could not create player.', error: error.message });
  }
};

// @desc    Get all players for a specific team
// @route   GET /api/players/team/:teamId
export const getPlayersForTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const players = await Player.find({ team: teamId });
    res.status(200).json({ success: true, players });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Could not fetch players.', error: error.message });
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

    let updateData = req.body;

    // Recalculate age if dateOfBirth is updated but age is not provided? 
    // Or just trust the new age if provided.
    // The model accepts both.

    // If attributes are being updated, recalculate role fits
    if (req.body.attributes) {
      const { roleFits, bestRole, emergencyRoles } = calculateRoleFits(req.body.attributes);
      updateData = {
        ...updateData,
        roleFits,
        bestRole,
        emergencyRoles
      };
    }

    const player = await Player.findByIdAndUpdate(req.params.id, updateData, {
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