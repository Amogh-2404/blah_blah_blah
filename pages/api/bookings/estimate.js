// pages/api/bookings/estimate.js
import calculatePrice from '../../../utils/calculatePrice';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { pickupAddress, dropoffAddress, vehicleType } = req.body;

    if (!pickupAddress || !dropoffAddress || !vehicleType) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const { estimatedCost } = await calculatePrice(pickupAddress, dropoffAddress, vehicleType);
        res.status(200).json({ estimatedCost });
    } catch (error) {
        console.error('Error calculating estimate:', error);
        res.status(500).json({ message: 'Could not calculate estimate' });
    }
}
