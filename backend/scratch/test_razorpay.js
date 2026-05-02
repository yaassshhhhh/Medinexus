import Razorpay from 'razorpay';
import 'dotenv/config';

console.log('Razorpay import type:', typeof Razorpay);
try {
    const rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || 'test',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'test'
    });
    console.log('Successfully instantiated Razorpay');
    console.log('Orders object exists:', typeof rzp.orders);
} catch (err) {
    console.error('Failed to instantiate Razorpay:', err);
}
