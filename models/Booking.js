// models/Booking.js
import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    vehicleType: { type: String, enum: ['small', 'medium', 'large'], required: true },
    pickupLocation: {
        address: { type: String, required: true },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    dropoffLocation: {
        address: { type: String, required: true },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'en route to pickup', 'goods collected', 'delivered', 'completed', 'canceled'],
        default: 'pending',
    },
    estimatedCost: { type: Number, required: true },
    scheduledTime: { type: Date }, // For future bookings
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
