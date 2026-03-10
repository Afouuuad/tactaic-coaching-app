import GamePlan from '../models/gamePlan.model.js';
import Player from '../models/player.model.js';
import Team from '../models/team.model.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const formations = require('../data/formations.json');

// @desc    Generate a suggested Starting XI based on formation
// @route   POST /api/gameplans/generate
export const generateGamePlan = async (req, res) => {
    try {
        const { teamId, formation } = req.body;

        // Validate inputs
        if (!teamId || !formation) {
            return res.status(400).json({ message: 'Team ID and Formation are required.' });
        }

        const formationRoles = formations[formation];
        if (!formationRoles) {
            return res.status(400).json({ message: 'Invalid formation selected.' });
        }

        // Fetch available players
        const players = await Player.find({
            team: teamId,
            availabilityStatus: 'Available'
        });

        if (players.length < 11) {
            // Allow generation but warn? Or just proceed with what we have.
            // For now, proceed.
        }

        const startingXI = {};
        const usedPlayerIds = new Set();
        const assignedPlayers = [];

        // Iterate through positions in the formation
        // Note: Order matters for greedy assignment. Key implementations might optimize this.
        // For now, we follow the order defined in json.
        for (const [position, roleKey] of Object.entries(formationRoles)) {

            // Filter and sort players for this role
            // Criteria: 
            // 1. Not already used
            // 2. Score for this role (Descending)

            let candidates = players.filter(p => !usedPlayerIds.has(p._id.toString()));

            candidates.sort((a, b) => {
                const scoreA = (a.roleFits && a.roleFits.get(roleKey)) || 0;
                const scoreB = (b.roleFits && b.roleFits.get(roleKey)) || 0;
                return scoreB - scoreA; // Descending
            });

            if (candidates.length > 0) {
                const bestPlayer = candidates[0];
                startingXI[position] = bestPlayer._id;
                usedPlayerIds.add(bestPlayer._id.toString());
                assignedPlayers.push({ position, name: bestPlayer.firstName + ' ' + bestPlayer.lastName, role: roleKey, score: bestPlayer.roleFits.get(roleKey) });
            } else {
                startingXI[position] = null; // No player available
            }
        }

        // Identify substitutes (remaining available players)
        const substitutes = players
            .filter(p => !usedPlayerIds.has(p._id.toString()))
            .map(p => p._id);

        // We don't save to DB yet, just return the suggestion
        res.status(200).json({
            formation,
            startingXI,
            substitutes,
            analysis: assignedPlayers
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not generate game plan.', error: error.message });
    }
};

// @desc    Save a game plan
// @route   POST /api/gameplans
export const saveGamePlan = async (req, res) => {
    try {
        const { teamId, name, formation, startingXI, substitutes, style } = req.body;

        // Check Team ownership
        const team = await Team.findOne({ _id: teamId, coach: req.user._id });
        if (!team) {
            return res.status(403).json({ message: 'Not authorized to manage this team.' });
        }

        const gamePlan = new GamePlan({
            team: teamId,
            name,
            formation,
            startingXI, // Expecting Map or Object
            substitutes,
            style
        });

        await gamePlan.save();

        // Add to Team reference
        team.gamePlans.push(gamePlan._id);
        await team.save();

        res.status(201).json(gamePlan);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not save game plan.', error: error.message });
    }
};

// @desc    Get all game plans for a team
// @route   GET /api/gameplans/team/:teamId
export const getGamePlans = async (req, res) => {
    try {
        const { teamId } = req.params;
        const gamePlans = await GamePlan.find({ team: teamId }).sort({ createdAt: -1 });
        res.status(200).json(gamePlans);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not fetch game plans.', error: error.message });
    }
};
