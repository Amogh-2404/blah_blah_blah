// pages/api/socket.js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Booking from '../../models/Booking';
import Driver from '../../models/Driver';
import dbConnect from '../../lib/dbConnect';

export default async function handler(req, res) {
    if (!res.socket.server.io) {
        await dbConnect();
        const io = new Server(res.socket.server);

        io.on('connection', (socket) => {
            console.log('Client connected', socket.id);

            socket.on('joinBooking', (bookingId) => {
                socket.join(`booking_${bookingId}`);
            });

            socket.on('joinDriver', (token) => {
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    socket.join(`driver_${decoded.userId}`);
                } catch (error) {
                    console.error('Invalid token for driver', error);
                }
            });

            socket.on('driverLocationUpdate', async ({ bookingId, location }) => {
                // Update driver's location in the database
                try {
                    const booking = await Booking.findById(bookingId);
                    if (booking) {
                        const driver = await Driver.findById(booking.driver);
                        if (driver) {
                            driver.location.coordinates = [location.longitude, location.latitude];
                            await driver.save();

                            // Broadcast location to user
                            io.to(`booking_${bookingId}`).emit('driverLocation', driver.location);
                        }
                    }
                } catch (error) {
                    console.error('Error updating driver location:', error);
                }
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected', socket.id);
            });
        });

        res.socket.server.io = io;
        global.io = io; // Make io accessible globally
    }
    res.end();
}
