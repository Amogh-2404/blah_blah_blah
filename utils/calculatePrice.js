// utils/calculatePrice.js
import geolocation from './geolocation';

export default async function calculatePrice(pickupLocation, dropoffLocation, vehicleType) {
    try {
        const distance = await geolocation.getDistance(
            pickupLocation.coordinates,
            dropoffLocation.coordinates
        );

        if (distance === null) throw new Error('Unable to calculate distance');

        const baseRate = 5;
        const perKmRate = {
            small: 1,
            medium: 1.5,
            large: 2,
        }[vehicleType];

        let estimatedCost = baseRate + distance * perKmRate;

        // Apply surge pricing based on demand (placeholder logic)
        const demandMultiplier = 1; // Adjust based on real-time demand data
        estimatedCost *= demandMultiplier;

        return Math.round(estimatedCost * 100) / 100; // Round to 2 decimal places
    } catch (error) {
        console.error('Error in calculatePrice:', error);
        throw error;
    }
}
