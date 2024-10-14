// components/AdminDashboard.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles/AdminDashboard.module.css';

export default function AdminDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loadingVehicles, setLoadingVehicles] = useState(true);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);
    const [newVehicle, setNewVehicle] = useState({
        driverId: '',
        type: 'small',
        licensePlate: '',
    });

    useEffect(() => {
        fetchVehicles();
        fetchAnalytics();
    }, []);

    const fetchVehicles = async () => {
        setLoadingVehicles(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/admin/vehicles', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVehicles(response.data.vehicles);
        } catch (error) {
            console.error('Error fetching vehicles:', error.response.data.message);
        } finally {
            setLoadingVehicles(false);
        }
    };

    const fetchAnalytics = async () => {
        setLoadingAnalytics(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/admin/analytics', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error.response.data.message);
        } finally {
            setLoadingAnalytics(false);
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/api/admin/vehicles',
                newVehicle,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewVehicle({ driverId: '', type: 'small', licensePlate: '' });
            fetchVehicles();
        } catch (error) {
            console.error('Error adding vehicle:', error.response.data.message);
        }
    };

    const handleDeleteVehicle = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/vehicles/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchVehicles();
        } catch (error) {
            console.error('Error deleting vehicle:', error.response.data.message);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className="text-2xl mb-4">Admin Dashboard</h2>

            <section className={styles.section}>
                <h3 className="text-xl mb-2">Fleet Management</h3>
                {loadingVehicles ? (
                    <p>Loading vehicles...</p>
                ) : (
                    <>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Driver ID</th>
                                <th>Vehicle Type</th>
                                <th>License Plate</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle._id}>
                                    <td>{vehicle.driver}</td>
                                    <td>{vehicle.type}</td>
                                    <td>{vehicle.licensePlate}</td>
                                    <td>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteVehicle(vehicle._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <form onSubmit={handleAddVehicle} className={styles.form}>
                            <h4 className="text-lg mb-2">Add New Vehicle</h4>
                            <label className={styles.label}>
                                Driver ID:
                                <input
                                    type="text"
                                    value={newVehicle.driverId}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, driverId: e.target.value })}
                                    required
                                    className={styles.input}
                                />
                            </label>
                            <label className={styles.label}>
                                Vehicle Type:
                                <select
                                    value={newVehicle.type}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                                    required
                                    className={styles.select}
                                >
                                    <option value="small">Small Van</option>
                                    <option value="medium">Medium Truck</option>
                                    <option value="large">Large Truck</option>
                                </select>
                            </label>
                            <label className={styles.label}>
                                License Plate:
                                <input
                                    type="text"
                                    value={newVehicle.licensePlate}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                                    required
                                    className={styles.input}
                                />
                            </label>
                            <button type="submit" className={styles.button}>
                                Add Vehicle
                            </button>
                        </form>
                    </>
                )}
            </section>

            <section className={styles.section}>
                <h3 className="text-xl mb-2">Data Analytics</h3>
                {loadingAnalytics ? (
                    <p>Loading analytics...</p>
                ) : analytics ? (
                    <div className={styles.analytics}>
                        <p>Total Completed Trips: {analytics.totalTrips}</p>
                        <p>Average Trip Time: {analytics.averageTripTime} hours</p>
                        <h4 className="text-lg mt-4">Driver Performance</h4>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Driver ID</th>
                                <th>Name</th>
                                <th>Total Completed Trips</th>
                                <th>Total Earnings ($)</th>
                                <th>Average Earnings per Trip ($)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {analytics.driverPerformance.map((driver) => (
                                <tr key={driver.driverId}>
                                    <td>{driver.driverId}</td>
                                    <td>{driver.name}</td>
                                    <td>{driver.totalCompleted}</td>
                                    <td>{driver.totalCost.toFixed(2)}</td>
                                    <td>{driver.averageEarnings.toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No analytics data available.</p>
                )}
            </section>
        </div>
    );
}
