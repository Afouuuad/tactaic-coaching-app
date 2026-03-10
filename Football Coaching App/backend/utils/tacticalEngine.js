import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const positionTypes = require('../data/positionTypes.json');

/**
 * Normalizes an attribute value (0-100) to a 0-1 scale.
 * @param {number} value
 * @returns {number}
 */
const normalize = (value) => {
    return Math.min(Math.max(value, 0), 100) / 100;
};

/**
 * Calculates part of the fit score for a specific role.
 * @param {Object} playerAttributes - Object containing player's attribute scores (0-100).
 * @param {Object} roleWeights - Object containing attribute weights (1-5) for a role.
 * @returns {number} - Weighted average score (0-100) representing the fit.
 */
const calculateScoreForRole = (playerAttributes, roleWeights) => {
    let totalWeightedScore = 0;
    let totalMaxWeight = 0;

    for (const [attribute, weight] of Object.entries(roleWeights)) {
        const playerVal = playerAttributes[attribute] || 0;
        const normalizedVal = normalize(playerVal);

        // Add to total score: (Normalized Value * Weight)
        totalWeightedScore += normalizedVal * weight;

        // Add to max possible score divisor
        totalMaxWeight += weight;
    }

    if (totalMaxWeight === 0) return 0;

    // Convert back to percentage
    return (totalWeightedScore / totalMaxWeight) * 100;
};

/**
 * Calculates fit scores for all defined roles.
 * @param {Object} attributes - Player attributes object.
 * @returns {Object} - Contains roleFits (all), bestRole, and emergencyRoles.
 */
export const calculateRoleFits = (attributes) => {
    if (!attributes || Object.keys(attributes).length === 0) {
        return { roleFits: {}, bestRole: null, emergencyRoles: [] };
    }

    const roleFits = {};
    const emergencyRoles = [];
    let bestRole = { role: null, score: -1 };

    for (const [role, weights] of Object.entries(positionTypes)) {
        const score = calculateScoreForRole(attributes, weights);

        // Store score formatted to 1 decimal place
        roleFits[role] = parseFloat(score.toFixed(1));

        // Update Best Role
        if (score > bestRole.score) {
            bestRole = { role, score: roleFits[role] };
        }

        // Update Emergency Roles (Threshold: 50%)
        if (score >= 50) {
            emergencyRoles.push(role);
        }
    }

    // Sort emergency roles by score descending
    emergencyRoles.sort((a, b) => roleFits[b] - roleFits[a]);

    return {
        roleFits,
        bestRole: bestRole.role,
        emergencyRoles
    };
};
