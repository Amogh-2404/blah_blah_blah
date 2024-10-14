// components/DriverDashboard.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import styles from './styles/DriverDashboard.module.css';

export default function DriverDashboard() {
    const [currentBooking, setCurrentBooking] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const socket = io();

        socket.emit('joinDriver', token);

        socket.on('newBookingRequest', (booking) => {
            setCurrentBooking(booking);
            setStatus(booking.status);
        });

        socket.on('statusUpdate', ({ status }) => {
            setStatus(status);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleUpdateStatus = async (newStatus) => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/api/drivers/status',
                { bookingId: currentBooking._id, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStatus(newStatus);
        } catch (error) {
            console.error('Error updating status:', error.response?.data?.message);
            setError(error.response?.data?.message || 'Error updating status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className="text-2xl mb-4">Driver Dashboard</h2>
            {currentBooking ? (
                <div className={styles.booking}>
                    <p><strong>Booking ID:</strong> {currentBooking._id}</p>
                    <p><strong>Pickup Location:</strong> {currentBooking.pickupLocation.address}</p>
                    <p><strong>Drop-off Location:</strong> {currentBooking.dropoffLocation.address}</p>
                    <p><strong>Status:</strong> {status}</p>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className={styles.buttons}>
                        {status === 'accepted' && (
                            <button
                                onClick={() => handleUpdateStatus('en route to pickup')}
                                disabled={loading}
                                className={styles.button}
                            >
                                {loading ? 'Updating...' : 'En Route to Pickup'}
                            </button>
                        )}
                        {status === 'en route to pickup' && (
                            <button
                                onClick={() => handleUpdateStatus('goods collected')}
                                disabled={loading}
                                className={styles.button}
                            >
                                {loading ? 'Updating...' : 'Goods Collected'}
                            </button>
                        )}
                        {status === 'goods collected' && (
                            <button
                                onClick={() => handleUpdateStatus('delivered')}
                                disabled={loading}
                                className={styles.button}
                            >
                                {loading ? 'Updating...' : 'Delivered'}
                            </button>
                        )}
                        {status === 'delivered' && (
                            <button
                                onClick={() => handleUpdateStatus('completed')}
                                disabled={loading}
                                className={styles.button}
                            >
                                {loading ? 'Updating...' : 'Complete Trip'}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <p>No current bookings.</p>
            )}
        </div>
    );
}
