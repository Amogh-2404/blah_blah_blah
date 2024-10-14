// pages/login.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isAdmin', response.data.user.isAdmin);
            localStorage.setItem('isDriver', response.data.user.isDriver);
            if (response.data.user.isAdmin) {
                router.push('/admin-dashboard');
            } else if (response.data.user.isDriver) {
                router.push('/driver-dashboard');
            } else {
                router.push('/user-dashboard');
            }
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message);
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <label className="block mb-4">
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="block w-full mt-1 p-2 border rounded"
                    />
                </label>
                <label className="block mb-6">
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full mt-1 p-2 border rounded"
                    />
                </label>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
                <p className="mt-4 text-center">
                    Don&#39;t have an account?{' '}
                    <a href="/register" className="text-blue-500">
                        Register
                    </a>
                </p>
            </form>
        </div>
    );
}
