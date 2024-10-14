// models/Driver.js
import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
    },
    isAvailable: { type: Boolean, default: true },
});

DriverSchema.index({ location: '2dsphere' });

export default mongoose.models.Driver || mongoose.model('Driver', DriverSchema);
