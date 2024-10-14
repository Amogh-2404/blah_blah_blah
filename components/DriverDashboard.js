import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import styles from './styles/DriverDashboard.module.css';

export default function DriverDashboard() {
    const [currentBooking, setCurrentBooking] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const socket = io();

        socket.emit('joinDriver', token);

        socket.on('newBookingRequest', (booking) => {
            setCurrentBooking(booking);
            setStatus(booking.status);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const updateStatus = async (newStatus) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `/api/bookings/${currentBooking._id}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setStatus(newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentBooking) {
        return <p>No current bookings.</p>;
    }

    return (
        <div className={styles.dashboard}>
            <h2>Current Booking</h2>
            <p>Pickup Location: {currentBooking.pickupLocation.address}</p>
            <p>Drop-off Location: {currentBooking.dropoffLocation.address}</p>
            <p>Status: {status}</p>
            <div className={styles.buttons}>
                {status !== 'en route to pickup' && (
                    <button onClick={() => updateStatus('en route to pickup')} disabled={loading}>
                        En Route to Pickup
                    </button>
                )}
                {status !== 'goods collected' && (
                    <button onClick={() => updateStatus('goods collected')} disabled={loading}>
                        Goods Collected
                    </button>
                )}
                {status !== 'delivered' && (
                    <button onClick={() => updateStatus('delivered')} disabled={loading}>
                        Delivered
                    </button>
                )}
            </div>
        </div>
    );
}
