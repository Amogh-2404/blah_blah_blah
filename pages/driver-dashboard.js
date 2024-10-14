import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import DriverDashboard from '../components/DriverDashboard';

export default function DriverDashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isDriver = localStorage.getItem('isDriver');
        if (!token || isDriver !== 'true') router.push('/login');
    }, [router]);

    return (
        <Layout>
            <DriverDashboard />
        </Layout>
    );
}
