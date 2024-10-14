// pages/api/admin/vehicles/index.js
import dbConnect from '../../../../lib/dbConnect';
import Vehicle from '../../../../models/Vehicle';
import Driver from '../../../../models/Driver';
import authMiddleware from '../../../../middleware/authMiddleware';

export default async function handler(req, res) {
    await dbConnect();
    const user = await authMiddleware(req, res);

    if (!user.isAdmin) {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    switch (req.method) {
        case 'GET':
            try {
                const vehicles = await Vehicle.find().populate('driver');
                res.status(200).json({ vehicles });
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                res.status(500).json({ message: 'Server error' });
            }
            break;
        case 'POST':
            try {
                const { driverId, type, licensePlate } = req.body;

                if (!driverId || !type || !licensePlate) {
                    return res.status(400).json({ message: 'Missing required fields' });
                }

                const driver = await Driver.findById(driverId);
                if (!driver) {
                    return res.status(404).json({ message: 'Driver not found' });
                }

                const vehicle = new Vehicle({
                    driver: driverId,
                    type,
                    licensePlate,
                });

                await vehicle.save();
                res.status(201).json({ vehicle });
            } catch (error) {
                console.error('Error creating vehicle:', error);
                res.status(500).json({ message: 'Server error' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
