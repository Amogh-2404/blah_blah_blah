// utils/geolocation.js
import haversine from 'haversine-distance';

export default {
    getDistance: async (coords1, coords2) => {
        try {
            const [lng1, lat1] = coords1;
            const [lng2, lat2] = coords2;

            const distanceInMeters = haversine({ lat: lat1, lng: lng1 }, { lat: lat2, lng: lng2 });
            const distanceInKm = distanceInMeters / 1000;

            return distanceInKm;
        } catch (error) {
            console.error('Error calculating distance:', error);
            return null;
        }
    },
};
