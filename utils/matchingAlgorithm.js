// utils/matchingAlgorithm.js
import Driver from '../models/Driver';
import Booking from '../models/Booking';
import dbConnect from '../lib/dbConnect';

export default async function matchingAlgorithm(booking) {
    await dbConnect();
    try {
        const drivers = await Driver.find({
            isAvailable: true,
            'vehicle.type': booking.vehicleType,
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: booking.pickupLocation.coordinates,
                    },
                    $maxDistance: 5000, // 5 km radius
                },
            },
        }).populate('user vehicle');

        if (drivers.length === 0) {
            console.log('No drivers available');
            return;
        }

        // Assign the closest driver
        const driver = drivers[0];

        booking.driver = driver._id;
        booking.status = 'accepted';
        await booking.save();

        driver.isAvailable = false;
        await driver.save();

        // Notify driver via Socket.IO
        const io = global.io;
        io.to(`driver_${driver.user._id}`).emit('newBookingRequest', booking);

        // Notify user via Socket.IO
        io.to(`booking_${booking._id}`).emit('driverAssigned', { driverId: driver._id });
    } catch (error) {
        console.error('Error in matching algorithm:', error);
    }
}
