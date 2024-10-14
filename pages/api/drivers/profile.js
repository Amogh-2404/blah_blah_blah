// pages/api/drivers/profile.js
import dbConnect from '../../../lib/dbConnect';
import Driver from '../../../models/Driver';
import authMiddleware from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
    await dbConnect();
    const user = await authMiddleware(req, res);

    if (!user.isDriver) {
        return res.status(403).json({ message: 'Forbidden: Drivers only' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const driver = await Driver.findOne({ user: user._id }).populate('vehicle');
        if (!driver) {
            return res.status(404).json({ message: 'Driver profile not found' });
        }
        res.status(200).json({ driver });
    } catch (error) {
        console.error('Error fetching driver profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
