// worker.js
require('dotenv').config();
const mongoose = require('mongoose');
const amqp = require('amqplib');
const Booking = require('./models/Booking');
const Driver = require('./models/Driver');
const matchingAlgorithm = require('./utils/matchingAlgorithm');
const dbConnect = require('./lib/dbConnect');

(async () => {
    await dbConnect();

    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    const queue = 'driver_matching';
    await channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    console.log('Worker is waiting for messages in', queue);

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const bookingData = JSON.parse(msg.content.toString());
            console.log('Received booking:', bookingData._id);

            try {
                const booking = await Booking.findById(bookingData._id);
                if (!booking) throw new Error('Booking not found');

                await matchingAlgorithm(booking);

                channel.ack(msg);
            } catch (error) {
                console.error('Error processing booking:', error);
                channel.nack(msg, false, false); // Do not requeue the message
            }
        }
    });
})();
