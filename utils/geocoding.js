// utils/geocoding.js
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

export async function getCoordinates(address) {
    try {
        const response = await geocodingClient
            .forwardGeocode({
                query: address,
                limit: 1,
            })
            .send();

        const match = response.body.features[0];
        if (match) {
            return match.geometry.coordinates; // [longitude, latitude]
        } else {
            throw new Error('No matching location found');
        }
    } catch (error) {
        console.error('Error in getCoordinates:', error);
        throw error;
    }
}
