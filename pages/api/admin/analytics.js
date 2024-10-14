// pages/api/admin/analytics.js
import dbConnect from '../../../lib/dbConnect';
import Booking from '../../../models/Booking';
import Driver from '../../../models/Driver';
import authMiddleware from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
    await dbConnect();
    const user = await authMiddleware(req, res);

    if (!user.isAdmin) {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Total Completed Trips
        const totalTrips = await Booking.countDocuments({ status: 'completed' });

        // Average Trip Time (assuming 'scheduledTime' is the drop-off time and 'createdAt' is the booking time)
        const averageTripTimeData = await Booking.aggregate([
            { $match: { status: 'completed', scheduledTime: { $exists: true }, createdAt: { $exists: true } } },
            {
                $project: {
                    tripTime: {
                        $divide: [
                            { $subtract: ['$scheduledTime', '$createdAt'] },
                            1000 * 60 * 60, // Convert milliseconds to hours
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    avgTripTime: { $avg: '$tripTime' },
                },
            },
        ]);

        const averageTripTime = averageTripTimeData[0]?.avgTripTime || 0;

        // Driver Performance
        const driverPerformance = await Booking.aggregate([
            {
                $match: { status: 'completed' },
            },
            {
                $group: {
                    _id: '$driver',
                    totalCompleted: { $sum: 1 },
                    totalCost: { $sum: '$estimatedCost' },
                },
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'driverDetails',
                },
            },
            {
                $unwind: '$driverDetails',
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'driverDetails.user',
                    foreignField: '_id',
                    as: 'driverDetails.user',
                },
            },
            {
                $unwind: '$driverDetails.user',
            },
            {
                $project: {
                    driverId: '$_id',
                    name: '$driverDetails.user.name',
                    totalCompleted: 1,
                    totalCost: 1,
                    averageEarnings: { $divide: ['$totalCost', '$totalCompleted'] },
                },
            },
            {
                $sort: { totalCompleted: -1 },
            },
        ]);

        res.status(200).json({
            totalTrips,
            averageTripTime: averageTripTime.toFixed(2),
            driverPerformance,
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
