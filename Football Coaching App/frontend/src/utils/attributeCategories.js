/**
 * Single source of truth for all player attribute categories.
 * Used by: PlayerStatisticsTable, AttributeEditor, AttributeSlider
 *
 * Each category maps model keys → display labels.
 * Colors are used for table headers, slider tracks, and category tabs.
 */

export const ATTRIBUTE_CATEGORIES = {
    Athleticism: {
        bgClass: 'bg-orange-100',
        textClass: 'text-orange-700',
        borderClass: 'border-orange-400',
        barColor: '#f97316',
        ringClass: 'ring-orange-400',
        attributes: {
            Speed: 'Speed',
            Acceleration: 'Acceleration',
            Agility: 'Agility',
            Jumping: 'Jump',
            Physical: 'Physical',
            Balance: 'Balance',
            Stamina: 'Stamina',
        },
    },
    Attacking: {
        bgClass: 'bg-red-100',
        textClass: 'text-red-700',
        borderClass: 'border-red-400',
        barColor: '#ef4444',
        ringClass: 'ring-red-400',
        attributes: {
            Finishing: 'Finishing',
            LongShots: 'Long Shots',
            ShotPower: 'Shot Power',
            Volleys: 'Volleys',
            Penalties: 'Penalties',
            Heading: 'Heading',
            AttackingPositioning: 'Att. Positioning',
            Composure: 'Composure',
            AttackingAwareness: 'Awareness',
        },
    },
    Passing: {
        bgClass: 'bg-green-100',
        textClass: 'text-green-700',
        borderClass: 'border-green-400',
        barColor: '#22c55e',
        ringClass: 'ring-green-400',
        attributes: {
            Vision: 'Vision',
            Crossing: 'Crossing',
            LongPasses: 'Long Pass',
            ShortPasses: 'Short Pass',
        },
    },
    Dribbling: {
        bgClass: 'bg-purple-100',
        textClass: 'text-purple-700',
        borderClass: 'border-purple-400',
        barColor: '#a855f7',
        ringClass: 'ring-purple-400',
        attributes: {
            Dribbling: 'Dribbling',
            BallControl: 'Ball Control',
            tightpossession: 'Tight Possession',
            creativity: 'Creativity',
        },
    },
    Defending: {
        bgClass: 'bg-blue-100',
        textClass: 'text-blue-700',
        borderClass: 'border-blue-400',
        barColor: '#3b82f6',
        ringClass: 'ring-blue-400',
        attributes: {
            Defendingawareness: 'Def. Awareness',
            engagment: 'Engagement',
            Aggression: 'Aggression',
            Tackling: 'Tackling',
            Marking: 'Marking',
        },
    },
    Goalkeeping: {
        bgClass: 'bg-yellow-100',
        textClass: 'text-yellow-700',
        borderClass: 'border-yellow-400',
        barColor: '#eab308',
        ringClass: 'ring-yellow-400',
        attributes: {
            Positioning: 'Positioning',
            Reflexes: 'Reflexes',
            Diving: 'Diving',
            Handling: 'Handling',
            Kicking: 'Kicking',
        },
    },
    Mental: {
        bgClass: 'bg-indigo-100',
        textClass: 'text-indigo-700',
        borderClass: 'border-indigo-400',
        barColor: '#6366f1',
        ringClass: 'ring-indigo-400',
        attributes: {
            OffTheBall: 'Off The Ball',
            Teamwork: 'Teamwork',
            WorkRate: 'Work Rate',
            Bravery: 'Bravery',
            Determination: 'Determination',
            Leadership: 'Leadership',
            Sportsmanship: 'Sportsmanship',
            Temperament: 'Temperament',
        },
    },
};

/** Flat list of all attribute keys (for iteration) */
export const ALL_ATTRIBUTE_KEYS = Object.values(ATTRIBUTE_CATEGORIES)
    .flatMap(cat => Object.keys(cat.attributes));

/** Get the category config for a given attribute key */
export const getCategoryForAttribute = (attrKey) => {
    for (const [catName, cat] of Object.entries(ATTRIBUTE_CATEGORIES)) {
        if (attrKey in cat.attributes) return { categoryName: catName, ...cat };
    }
    return null;
};
