import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isDriver, setIsDriver] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/register', {
                name,
                email,
                password,
                isDriver,
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isDriver', response.data.user.isDriver);
            router.push(response.data.user.isDriver ? '/driver-dashboard' : '/user-dashboard');
        } catch (error) {
            console.error('Registration failed:', error.response.data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl mb-6">Register</h2>
                <label className="block mb-4">
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="block w-full mt-1 p-2 border rounded"
                    />
                </label>
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
                <label className="block mb-4">
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full mt-1 p-2 border rounded"
                    />
                </label>
                <label className="block mb-6">
                    <input
                        type="checkbox"
                        checked={isDriver}
                        onChange={(e) => setIsDriver(e.target.checked)}
                        className="mr-2"
                    />
                    Register as Driver
                </label>
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
                    Register
                </button>
                <p className="mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-500">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
}
