// pages/driver-dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import DriverDashboard from '../components/DriverDashboard';

export default function DriverDashboardPage() {
    const router = useRouter();
    const [driverProfile, setDriverProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isDriver = localStorage.getItem('isDriver');
        if (!token || isDriver !== 'true') {
            router.push('/login');
        } else {
            fetchDriverProfile(token);
        }
    }, [router]);

    const fetchDriverProfile = async (token) => {
        try {
            const response = await axios.get('/api/drivers/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDriverProfile(response.data.driver);
        } catch (error) {
            console.error('Error fetching driver profile:', error.response?.data?.message);
            // Optionally redirect to login or show error
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <p>Loading driver dashboard...</p>
            </Layout>
        );
    }

    return (
        <Layout>
            {driverProfile ? (
                <DriverDashboard />
            ) : (
                <p>Driver profile not found. Please contact support.</p>
            )}
        </Layout>
    );
}
