import { calculateRoleFits } from '../utils/tacticalEngine.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const positionTypes = require('../data/positionTypes.json');

const mockAttributes = {
    Pace: 85,
    Shooting: 70,
    Passing: 60,
    Dribbling: 80,
    Defending: 30,
    Physical: 65,
    // Specifics
    Finishing: 75,
    Composure: 70,
    Vision: 55,
    Stamina: 70,
    Strength: 60,
    Aggression: 40,
    Jumping: 50,
    Heading: 50,
    Tackling: 25,
    Marking: 25,
    Positioning: 80, // High positioning for Poacher
    Reflexes: 10,
    Diving: 10,
    Handling: 10,
    Kicking: 10,
    Speed: 85,
};

console.log("Testing Tactical Engine...");

const results = calculateRoleFits(mockAttributes);

console.log("\n--- Mock Player (Winger/Forward type) ---");
console.log("Attributes:", JSON.stringify(mockAttributes, null, 2));
console.log("\n--- Calculated Role Fits ---");
console.log("Best Role:", results.bestRole);
console.log("Top Fits:");
Object.entries(results.roleFits)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .forEach(([role, score]) => console.log(`  ${role}: ${score}%`));

console.log("\nEmergency Roles:", results.emergencyRoles);

// Simple Assertion
if (results.bestRole === 'W_Winger' || results.bestRole === 'ST_Poacher') {
    console.log("\nPASS: Best role identified correctly as offensive.");
} else {
    console.error("\nFAIL: Unexpected best role:", results.bestRole);
}

if (results.roleFits['GK_Goalkeeper'] < 30) {
    console.log("PASS: Goalkeeper score is low as expected.");
} else {
    console.error("FAIL: Goalkeeper score unexpectedly high:", results.roleFits['GK_Goalkeeper']);
}
