// pages/api/bookings/index.js
import dbConnect from '../../../lib/dbConnect';
import Booking from '../../../models/Booking';
import authMiddleware from '../../../middleware/authMiddleware';
import calculatePrice from '../../../utils/calculatePrice';
import matchingAlgorithm from '../../../utils/matchingAlgorithm';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    await dbConnect();
    const user = await authMiddleware(req, res);

    const { pickupLocation, dropoffLocation, vehicleType, scheduledTime } = req.body;

    if (!pickupLocation || !dropoffLocation || !vehicleType) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const estimatedCost = await calculatePrice(pickupLocation, dropoffLocation, vehicleType);

        const booking = new Booking({
            user: user._id,
            pickupLocation,
            dropoffLocation,
            vehicleType,
            estimatedCost,
            scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
        });
        await booking.save();

        if (!scheduledTime) {
            // Initiate driver matching for immediate bookings
            await matchingAlgorithm(booking);
        }

        res.status(201).json({ bookingId: booking._id });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
