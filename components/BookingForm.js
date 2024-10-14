// components/BookingForm.js
import { useState } from 'react';
import axios from 'axios';
import styles from './styles/BookingForm.module.css';

export default function BookingForm({ onBookingSuccess }) {
    const [pickupAddress, setPickupAddress] = useState('');
    const [dropoffAddress, setDropoffAddress] = useState('');
    const [vehicleType, setVehicleType] = useState('small');
    const [estimatedCost, setEstimatedCost] = useState(null);
    const [scheduledTime, setScheduledTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEstimate = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/api/bookings/estimate', {
                pickupAddress,
                dropoffAddress,
                vehicleType,
            });
            setEstimatedCost(response.data.estimatedCost);
        } catch (error) {
            console.error('Error getting estimate:', error.response?.data?.message);
            setError(error.response?.data?.message || 'Error getting estimate');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/api/bookings',
                {
                    pickupAddress,
                    dropoffAddress,
                    vehicleType,
                    scheduledTime: scheduledTime || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            onBookingSuccess(response.data.bookingId);
        } catch (error) {
            console.error('Error booking vehicle:', error.response?.data?.message);
            setError(error.response?.data?.message || 'Error booking vehicle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className="text-2xl mb-4">Book a Vehicle</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <label className={styles.label}>
                Pickup Address:
                <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    required
                    className={styles.input}
                />
            </label>
            <label className={styles.label}>
                Drop-off Address:
                <input
                    type="text"
                    value={dropoffAddress}
                    onChange={(e) => setDropoffAddress(e.target.value)}
                    required
                    className={styles.input}
                />
            </label>
            <label className={styles.label}>
                Vehicle Type:
                <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    required
                    className={styles.select}
                >
                    <option value="small">Small Van</option>
                    <option value="medium">Medium Truck</option>
                    <option value="large">Large Truck</option>
                </select>
            </label>
            <label className={styles.label}>
                Schedule for Later:
                <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className={styles.input}
                />
            </label>
            <button
                type="button"
                onClick={handleEstimate}
                disabled={loading}
                className={styles.button}
            >
                {loading ? 'Calculating...' : 'Get Estimate'}
            </button>
            {estimatedCost && <p className={styles.estimate}>Estimated Cost: ${estimatedCost}</p>}
            <button type="submit" disabled={loading} className={styles.button}>
                {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
        </form>
    );
}
