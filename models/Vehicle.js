// models/Vehicle.js
import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    type: { type: String, enum: ['small', 'medium', 'large'], required: true },
    licensePlate: { type: String, required: true },
});

export default mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);
