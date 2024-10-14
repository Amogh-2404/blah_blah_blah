import dbConnect from '../../../lib/dbConnect';
import Booking from '../../../models/Booking';
import Driver from '../../../models/Driver';
import authMiddleware from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    await dbConnect();
    const user = await authMiddleware(req, res);
    if (!user.isDriver) return res.status(403).json({ message: 'Not authorized' });

    const { bookingId } = req.body;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Booking already accepted' });
        }

        const driver = await Driver.findOne({ user: user._id });
        if (!driver) return res.status(400).json({ message: 'Driver profile not found' });

        booking.driver = driver._id;
        booking.status = 'accepted';
        await booking.save();

        driver.isAvailable = false;
        await driver.save();

        // Notify user via Socket.IO
        const io = req.io;
        io.to(`booking_${bookingId}`).emit('driverAssigned', { driverId: driver._id });

        res.json({ message: 'Booking accepted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
