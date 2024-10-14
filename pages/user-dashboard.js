// pages/user-dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import BookingForm from '../components/BookingForm';
import TrackingMap from '../components/TrackingMap';

export default function UserDashboard() {
    const [bookingId, setBookingId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isDriver = localStorage.getItem('isDriver');
        if (!token || isDriver === 'true') {
            router.push('/login');
        }
    }, [router]);

    const handleBookingSuccess = (id) => {
        setBookingId(id);
    };

    return (
        <Layout>
            {bookingId ? (
                <>
                    <h2 className="text-2xl mb-4">Your Booking ID: {bookingId}</h2>
                    <TrackingMap bookingId={bookingId} />
                </>
            ) : (
                <BookingForm onBookingSuccess={handleBookingSuccess} />
            )}
        </Layout>
    );
}
