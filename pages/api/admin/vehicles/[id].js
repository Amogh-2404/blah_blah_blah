// pages/api/admin/vehicles/[id].js
import dbConnect from '../../../../lib/dbConnect';
import Vehicle from '../../../../models/Vehicle';
import authMiddleware from '../../../../middleware/authMiddleware';

export default async function handler(req, res) {
    await dbConnect();
    const user = await authMiddleware(req, res);

    if (!user.isAdmin) {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const {
        query: { id },
        method,
    } = req;

    switch (method) {
        case 'GET':
            try {
                const vehicle = await Vehicle.findById(id).populate('driver');
                if (!vehicle) {
                    return res.status(404).json({ message: 'Vehicle not found' });
                }
                res.status(200).json({ vehicle });
            } catch (error) {
                console.error('Error fetching vehicle:', error);
                res.status(500).json({ message: 'Server error' });
            }
            break;
        case 'PUT':
            try {
                const { type, licensePlate } = req.body;

                const vehicle = await Vehicle.findById(id);
                if (!vehicle) {
                    return res.status(404).json({ message: 'Vehicle not found' });
                }

                vehicle.type = type || vehicle.type;
                vehicle.licensePlate = licensePlate || vehicle.licensePlate;

                await vehicle.save();
                res.status(200).json({ vehicle });
            } catch (error) {
                console.error('Error updating vehicle:', error);
                res.status(500).json({ message: 'Server error' });
            }
            break;
        case 'DELETE':
            try {
                const vehicle = await Vehicle.findById(id);
                if (!vehicle) {
                    return res.status(404).json({ message: 'Vehicle not found' });
                }

                await vehicle.remove();
                res.status(200).json({ message: 'Vehicle deleted' });
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                res.status(500).json({ message: 'Server error' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
