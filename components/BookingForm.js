// components/BookingForm.js
import { useState } from 'react';
import axios from 'axios';
import styles from './styles/BookingForm.module.css';

export default function BookingForm({ onBookingSuccess }) {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [vehicleType, setVehicleType] = useState('small');
    const [estimatedCost, setEstimatedCost] = useState(null);
    const [scheduledTime, setScheduledTime] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEstimate = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/bookings/estimate', {
                pickupLocation: { address: pickupLocation, coordinates: [-0.1276, 51.5074] }, // Placeholder coordinates
                dropoffLocation: { address: dropoffLocation, coordinates: [-0.1276, 51.5074] },
                vehicleType,
            });
            setEstimatedCost(response.data.estimatedCost);
        } catch (error) {
            console.error('Error getting estimate:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/api/bookings',
                {
                    pickupLocation: { address: pickupLocation, coordinates: [-0.1276, 51.5074] }, // Replace with actual coordinates
                    dropoffLocation: { address: dropoffLocation, coordinates: [-0.1276, 51.5074] }, // Replace with actual coordinates
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
            console.error('Error booking vehicle:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className="text-2xl mb-4">Book a Vehicle</h2>
            <label className={styles.label}>
                Pickup Location:
                <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    required
                    className={styles.input}
                />
            </label>
            <label className={styles.label}>
                Drop-off Location:
                <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    required
                    className={styles.input}
                />
            </label>
            <label className={styles.label}>
                Vehicle Type:
                <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
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
