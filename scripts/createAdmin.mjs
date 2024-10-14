// scripts/createAdmin.mjs
import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const admin = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpassword', // Ensure to hash this or let the pre-save hook handle it
        isAdmin: true,
    });

    await admin.save();
    console.log('Admin user created');
    mongoose.disconnect();
}

createAdmin().catch((err) => {
    console.error(err);
    mongoose.disconnect();
});
