import mongoose from 'mongoose';

const gamePlanSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        default: 'New Game Plan'
    },
    formation: {
        type: String,
        required: true // e.g., "4-3-3_Attack"
    },
    style: {
        type: String,
        enum: ['Balanced', 'Attack', 'Defense', 'Possession'],
        default: 'Balanced'
    },
    // The Starting XI: Map of Position Key (e.g., "GK") -> Player ID
    startingXI: {
        type: Map,
        of: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }
    },
    // Bench players
    substitutes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
}, {
    timestamps: true
});

const GamePlan = mongoose.model('GamePlan', gamePlanSchema);

export default GamePlan;
