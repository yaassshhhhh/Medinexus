import fetch from 'node-fetch';

export const getNearbyDoctors = async (req, res) => {
    try {
        const { city, specialty } = req.body;

        if (!city) {
            return res.json({ success: false, message: 'City is required' });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            return res.json({ success: false, message: 'Maps API key missing' });
        }

        // Step 1: Geocode city to lat/lng
        const geoRes = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`
        );
        const geoData = await geoRes.json();

        if (!geoData.results?.length) {
            return res.json({ success: false, message: 'City not found' });
        }

        const { lat, lng } = geoData.results[0].geometry.location;

        // Step 2: Nearby search for doctors
        const query = specialty ? `${specialty} doctor` : 'doctor clinic hospital';
        const placesRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=doctor&keyword=${encodeURIComponent(query)}&key=${apiKey}`
        );
        const placesData = await placesRes.json();

        if (!placesData.results?.length) {
            return res.json({ success: false, doctors: [] });
        }

        // Step 3: Format top 5 results
        const doctors = placesData.results.slice(0, 5).map(place => ({
            name: place.name,
            address: place.vicinity,
            rating: place.rating || 'N/A',
            totalRatings: place.user_ratings_total || 0,
            isOpen: place.opening_hours?.open_now ?? null,
            placeId: place.place_id,
            mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            location: place.geometry?.location
        }));

        return res.json({ success: true, doctors });

    } catch (error) {
        console.error('Maps error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch nearby doctors' });
    }
};
