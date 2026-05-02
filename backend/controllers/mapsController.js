// Uses OpenStreetMap (Nominatim + Overpass) — completely free, no API key needed

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export const getNearbyDoctors = async (req, res) => {
    try {
        const { city, specialty } = req.body;

        if (!city) return res.json({ success: false, message: 'City is required' });

        // Step 1: Geocode city using Nominatim (OSM)
        const geoRes = await fetch(
            `${NOMINATIM_URL}/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
            { headers: { 'User-Agent': 'Medinexus AI/1.0 (medical-app)' } }
        );
        const geoData = await geoRes.json();

        if (!geoData?.length) {
            return res.json({ success: false, message: `City "${city}" not found. Try a different name.` });
        }

        const { lat, lon } = geoData[0];
        const radius = 5000; // 5km

        // Step 2: Overpass query — find doctors/clinics/hospitals near coordinates
        // amenity=doctors covers GP clinics; healthcare=* covers broader medical
        const overpassQuery = `
[out:json][timeout:15];
(
  node["amenity"="doctors"](around:${radius},${lat},${lon});
  node["amenity"="clinic"](around:${radius},${lat},${lon});
  node["amenity"="hospital"](around:${radius},${lat},${lon});
  node["healthcare"="doctor"](around:${radius},${lat},${lon});
  node["healthcare"="clinic"](around:${radius},${lat},${lon});
);
out body 10;`;

        const overpassRes = await fetch(OVERPASS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `data=${encodeURIComponent(overpassQuery)}`
        });

        const overpassData = await overpassRes.json();
        const elements = overpassData?.elements || [];

        if (!elements.length) {
            // Fallback: return a Nominatim search link so user can still find doctors
            return res.json({
                success: true,
                doctors: [],
                fallbackUrl: `https://www.openstreetmap.org/search?query=doctor+${encodeURIComponent(city)}`
            });
        }

        // Step 3: Format results — pick top 5 with a name
        const doctors = elements
            .filter(e => e.tags?.name)
            .slice(0, 5)
            .map(e => {
                const tags = e.tags;
                const distKm = getDistanceKm(parseFloat(lat), parseFloat(lon), e.lat, e.lon);
                return {
                    name: tags.name,
                    address: [tags['addr:street'], tags['addr:city'] || city]
                        .filter(Boolean).join(', ') || city,
                    specialty: tags.healthcare || tags.amenity || 'General',
                    phone: tags.phone || tags['contact:phone'] || null,
                    distance: distKm.toFixed(1) + ' km',
                    isOpen: null, // OSM doesn't reliably expose open_now
                    mapsUrl: `https://www.openstreetmap.org/?mlat=${e.lat}&mlon=${e.lon}#map=17/${e.lat}/${e.lon}`
                };
            });

        return res.json({ success: true, doctors });

    } catch (error) {
        console.error('Maps error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch nearby doctors. Please try again.' });
    }
};

// Haversine distance in km
function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function deg2rad(deg) { return deg * (Math.PI / 180); }
