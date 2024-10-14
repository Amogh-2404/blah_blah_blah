// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dbConnect from '../lib/dbConnect';

export default async function authMiddleware(req, res) {
    await dbConnect();

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Not authorized' });
        throw new Error('Not authorized');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ message: 'Not authorized' });
            throw new Error('Not authorized');
        }
        return user;
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
        throw new Error('Not authorized');
    }
}
