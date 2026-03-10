import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from './models/player.model.js';
import User from './models/user.model.js';
import Team from './models/team.model.js';
import { calculateRoleFits } from './utils/tacticalEngine.js';
import bcrypt from 'bcryptjs';

dotenv.config();

// ... (imports remain same)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error("Connection Error:", err);
        process.exit(1);
    });

// Debug Schema Info
console.log("User Model DB:", User.db.name);
console.log("Player Model DB:", Player.db.name);
// ...

const samplePlayers = [
    {
        firstName: "Marcus",
        lastName: "Rashford",
        position: "LW",
        number: 10,
        attributes: {
            Pace: 92,
            Shooting: 84,
            Passing: 78,
            Dribbling: 86,
            Defending: 45,
            Physical: 75,
            Finishing: 85,
            Composure: 80,
            Vision: 75,
            Stamina: 82
        }
    },
    {
        firstName: "Bruno",
        lastName: "Fernandes",
        position: "CAM",
        number: 8,
        attributes: {
            Pace: 75,
            Shooting: 85,
            Passing: 92,
            Dribbling: 84,
            Defending: 65,
            Physical: 72,
            Vision: 94,
            Composure: 88,
            Stamina: 90
        }
    },
    {
        firstName: "Casemiro",
        lastName: "Teixeira",
        position: "CDM",
        number: 18,
        attributes: {
            Pace: 65,
            Shooting: 72,
            Passing: 80,
            Dribbling: 70,
            Defending: 90,
            Physical: 88,
            Aggression: 89,
            Tackling: 91,
            Marking: 88
        }
    },
    {
        firstName: "Lisandro",
        lastName: "Martinez",
        position: "CB",
        number: 6,
        attributes: {
            Pace: 78,
            Shooting: 55,
            Passing: 84,
            Dribbling: 76,
            Defending: 88,
            Physical: 85,
            Aggression: 92,
            Tackling: 87,
            Marking: 89
        }
    },
    {
        firstName: "Andre",
        lastName: "Onana",
        position: "GK",
        number: 24,
        attributes: {
            Pace: 50,
            Shooting: 40,
            Passing: 88,
            Dribbling: 60,
            Defending: 85,
            Physical: 82,
            Reflexes: 89,
            Diving: 85,
            Handling: 82,
            Kicking: 90
        }
    },
    {
        firstName: "Rasmus",
        lastName: "Hojlund",
        position: "ST",
        number: 11,
        attributes: {
            Pace: 89,
            Shooting: 80,
            Passing: 65,
            Dribbling: 76,
            Defending: 40,
            Physical: 85,
            Finishing: 82,
            Heading: 78,
            Strength: 86
        }
    },
    {
        firstName: "Luke",
        lastName: "Shaw",
        position: "LB",
        number: 23,
        attributes: {
            Pace: 82,
            Shooting: 65,
            Passing: 84,
            Dribbling: 80,
            Defending: 81,
            Physical: 80,
            Crossing: 85,
            Stamina: 79
        }
    },
    {
        firstName: "Diogo",
        lastName: "Dalot",
        position: "RB",
        number: 20,
        attributes: {
            Pace: 86,
            Shooting: 70,
            Passing: 79,
            Dribbling: 81,
            Defending: 78,
            Physical: 76,
            Crossing: 80,
            Stamina: 88
        }
    },
    {
        firstName: "Alejandro",
        lastName: "Garnacho",
        position: "LW",
        number: 17,
        attributes: {
            Pace: 90,
            Shooting: 77,
            Passing: 74,
            Dribbling: 85,
            Defending: 40,
            Physical: 65,
            Agility: 88,
            Finishing: 76
        }
    },
    {
        firstName: "Harry",
        lastName: "Maguire",
        position: "CB",
        number: 5,
        attributes: {
            Pace: 55,
            Shooting: 60,
            Passing: 72,
            Dribbling: 64,
            Defending: 85,
            Physical: 90,
            Heading: 92,
            Strength: 94
        }
    },
    {
        firstName: "Kobbie",
        lastName: "Mainoo",
        position: "CM",
        number: 37,
        attributes: {
            Pace: 78,
            Shooting: 72,
            Passing: 84,
            Dribbling: 86,
            Defending: 74,
            Physical: 70,
            Composure: 89,
            Vision: 82
        }
    }
];

const seedData = async () => {
    try {
        console.log("Starting seeder...");

        // Ensure connection is ready before using models
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB Connected');
        }

        // 1. Get or Create a User (Coach)
        // Note: User model uses a specific DB connection 'CoachingAppDB'
        let user = await User.findOne({ email: "coach@tactaiq.com" });
        if (!user) {
            console.log("Creating default coach user...");
            // Manually hash if pre-save hook doesn't trigger on some bulk ops, but create() should trigger it.
            // However, the model has a pre-save hook.
            user = await User.create({
                name: "Erik ten Hag",
                email: "coach@tactaiq.com",
                password: "password123", // Pre-save hook will hash this
                role: "coach"
            });
        }
        console.log(`Using User: ${user.name} (${user._id})`);

        // 2. Get or Create a Team for this User
        let team = await Team.findOne({ name: "Manchester United" });
        if (!team) {
            console.log("Creating default team...");
            team = await Team.create({
                name: "Manchester United",
                coach: user._id, // Corrected field name from coachName to coach
                players: []
            });
            // Link team to user
            user.teams.push(team._id);
            await user.save();
        }
        console.log(`Using Team: ${team.name} (${team._id})`);

        // 3. Clear existing players for this team
        await Player.deleteMany({ team: team._id });
        // Clear players array in team document
        team.players = [];
        await team.save();
        console.log("Cleared existing players for this team.");

        // 4. Create Players
        for (const p of samplePlayers) {
            try {
                // Calculate tactical role fits
                const { roleFits, bestRole, emergencyRoles } = calculateRoleFits(p.attributes);

                // Create a pseudo-user account for the player
                const playerEmail = `${p.firstName.toLowerCase()}.${p.lastName.toLowerCase()}@tactaiq.test`;

                // Check if user exists to avoid duplicate key error
                let playerUser = await User.findOne({ email: playerEmail });
                if (playerUser) {
                    console.log(`User ${playerEmail} already exists, using it.`);
                } else {
                    playerUser = await User.create({
                        name: `${p.firstName} ${p.lastName}`,
                        email: playerEmail,
                        password: "password123",
                        role: "player"
                    });
                }

                // Create the Player Profile
                const newPlayer = await Player.create({
                    firstName: p.firstName,
                    lastName: p.lastName,
                    position: p.position,
                    number: p.number,
                    user: playerUser._id,
                    team: team._id,
                    attributes: p.attributes,
                    roleFits,
                    bestRole,
                    emergencyRoles
                });

                // Add player to Team's player list
                team.players.push(newPlayer._id);

                console.log(`Created player: ${p.firstName} ${p.lastName} (${bestRole})`);
            } catch (innerErr) {
                console.error(`Failed to create player ${p.firstName}:`, innerErr.message);
            }
        }

        await team.save(); // Save the updated team with players

        console.log("✅ Database seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
