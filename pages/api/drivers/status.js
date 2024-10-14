import dbConnect from '../../../lib/dbConnect';
import Driver from '../../../models/Driver';
import authMiddleware from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    await dbConnect();
    const user = await authMiddleware(req, res);
    if (!user.isDriver) return res.status(403).json({ message: 'Not authorized' });

    const { latitude, longitude } = req.body;

    try {
        const driver = await Driver.findOne({ user: user._id });
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        driver.location.coordinates = [longitude, latitude];
        await driver.save();

        res.json({ message: 'Location updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
