// pages/api/bookings/[id].js
import dbConnect from '../../../lib/dbConnect';
import Booking from '../../../models/Booking';
import authMiddleware from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    await dbConnect();
    const user = await authMiddleware(req, res);
    const { id } = req.query;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: 'Missing status' });

    try {
        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.driver && booking.driver.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

        // Notify user via Socket.IO
        const io = global.io;
        io.to(`booking_${id}`).emit('statusUpdate', { status });

        res.json({ message: 'Status updated' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
