// Geocoding service using Nominatim (OpenStreetMap)
// Includes caching to localStorage and rate limiting

const CACHE_KEY = 'trip_planner_geo_cache';
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

// Load cache from localStorage
const getCache = () => {
    try {
        const cache = localStorage.getItem(CACHE_KEY);
        return cache ? JSON.parse(cache) : {};
    } catch (e) {
        console.error('Failed to parse geo cache', e);
        return {};
    }
};

// Save cache to localStorage
const saveCache = (cache) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.error('Failed to save geo cache', e);
    }
};

// Simple delay function for rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Queue for rate limiting requests
let requestQueue = Promise.resolve();

export const geocodeLocation = async (locationName) => {
    if (!locationName) return null;

    // Clean up location name (remove emoji, extra spaces)
    // eslint-disable-next-line no-misleading-character-class
    const cleanName = locationName.replace(/^[🗺️📍\s]+/u, '').trim();
    if (!cleanName) return null;

    // Check cache first
    const cache = getCache();
    if (cache[cleanName]) {
        return cache[cleanName];
    }

    // Chain requests to ensure we don't hit rate limits (1 req/sec for Nominatim)
    requestQueue = requestQueue.then(async () => {
        await delay(1000); // 1 second delay between requests

        try {
            const params = new URLSearchParams({
                q: cleanName,
                format: 'json',
                limit: 1
            });

            const response = await fetch(`${NOMINATIM_BASE_URL}?${params}`);
            if (!response.ok) throw new Error('Geocoding failed');

            const data = await response.json();

            if (data && data.length > 0) {
                const result = {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon),
                    display_name: data[0].display_name
                };

                // Update cache
                const currentCache = getCache();
                currentCache[cleanName] = result;
                saveCache(currentCache);

                return result;
            }
        } catch (error) {
            console.warn(`Failed to geocode: ${cleanName}`, error);
        }
        return null;
    });

    return requestQueue;
};

// Batch geocode a list of events
export const geocodeEvents = async (events, onProgress) => {
    const results = [];
    let completed = 0;
    const total = events.filter(e => e.location).length;

    for (const event of events) {
        if (event.location) {
            const coords = await geocodeLocation(event.location);
            if (coords) {
                results.push({
                    ...event,
                    coordinates: coords
                });
            }
            completed++;
            if (onProgress) onProgress(completed, total);
        }
    }
    return results;
};
