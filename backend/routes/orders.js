const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
    userId: String,
    orderNumber: String,
    items: Array,
    total: Number,
    paymentMethod: String,
    address: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    orderDate: String,
    orderTime: String
}));

// Place order
router.post('/', async(req, res) => {
    try {
        const orderNumber = 'MT' + Date.now();
        const now = new Date();
        const orderDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const orderTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        await Order.create({...req.body, orderNumber, orderDate, orderTime });
        res.json({ message: 'Order placed!', orderNumber, orderDate, orderTime });
    } catch (err) {
        console.log('Order error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Track order by order number
router.get('/number/:orderNumber', async(req, res) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get orders by user
router.get('/user/:userId', async(req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── ADMIN ROUTES (added below — existing routes above are unchanged) ──

// GET all orders
router.get('/', async(req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single order by ID
router.get('/:id', async(req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH update order status
router.patch('/:id', async(req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id, { status: req.body.status }, { new: true }
        );
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE order
router.delete('/:id', async(req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;