import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isDriver', response.data.user.isDriver);
            router.push(response.data.user.isDriver ? '/driver-dashboard' : '/user-dashboard');
        } catch (error) {
            console.error('Login failed:', error.response.data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl mb-6">Login</h2>
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
                <p className="mt-4">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-500">
                        Register
                    </a>
                </p>
            </form>
        </div>
    );
}
