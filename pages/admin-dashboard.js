// pages/admin-dashboard.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import AdminDashboard from '../components/AdminDashboard';

export default function AdminDashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isAdmin = localStorage.getItem('isAdmin');
        if (!token || isAdmin !== 'true') {
            router.push('/login');
        }
    }, [router]);

    return (
        <Layout>
            <AdminDashboard />
        </Layout>
    );
}
