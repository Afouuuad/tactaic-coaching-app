import axios from 'axios';

// In-memory cache to store API responses
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // Cache data for 1 hour

// @desc    Get tournament standings for a specific season
// @route   GET /api/external/standings/:tournamentId/:seasonId
export const getStandings = async (req, res) => {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'API key is not configured.' });
  }

  const { tournamentId, seasonId } = req.params;
  const cacheKey = `standings-${tournamentId}-${seasonId}`;

  // Check cache for fresh data
  if (cache.has(cacheKey) && (Date.now() - cache.get(cacheKey).lastFetch < CACHE_TTL)) {
    console.log(`Serving standings for ${cacheKey} from cache.`);
    return res.json(cache.get(cacheKey).data);
  }

  const options = {
    method: 'GET',
    url: `https://sportapi7.p.rapidapi.com/api/v1/tournament/${tournamentId}/season/${seasonId}/standings/total`,
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'sportapi7.p.rapidapi.com'
    }
  };

  try {
    console.log(`Fetching standings for ${cacheKey} from API...`);
    const response = await axios.request(options);
    cache.set(cacheKey, { data: response.data, lastFetch: Date.now() });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching standings:', error.message);
    if (error.response) {
      res.status(error.response.status).json({ message: error.response.data });
    } else {
      res.status(500).json({ message: 'Error fetching standings from API.' });
    }
  }
};
