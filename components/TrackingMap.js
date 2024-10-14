// components/TrackingMap.js
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import io from 'socket.io-client';
import styles from './styles/TrackingMap.module.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function TrackingMap({ bookingId }) {
    const mapContainerRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        // Fetch the Socket.IO server
        fetch('/api/socket');

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-0.1276, 51.5074],
            zoom: 12,
        });

        markerRef.current = new mapboxgl.Marker().setLngLat([-0.1276, 51.5074]).addTo(map);

        const socket = io();

        socket.emit('joinBooking', bookingId);

        socket.on('driverLocation', (location) => {
            const [longitude, latitude] = location.coordinates;
            markerRef.current.setLngLat([longitude, latitude]);
            map.setCenter([longitude, latitude]);
        });

        socket.on('statusUpdate', ({ status }) => {
            console.log('Booking status updated:', status);
        });

        return () => {
            socket.disconnect();
            map.remove();
        };
    }, [bookingId]);

    return <div className={styles.mapContainer} ref={mapContainerRef} />;
}
