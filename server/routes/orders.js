const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

// POST /api/orders  — place order
router.post('/', protect, asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, notes } = req.body;
  if (!orderItems?.length) return res.status(400).json({ message: 'No order items' });

  const subtotal = orderItems.reduce((sum, i) => sum + i.totalPrice, 0);
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const order = await Order.create({
    user: req.user._id, orderItems, shippingAddress,
    subtotal, tax, total, notes,
  });
  res.status(201).json(order);
}));

// GET /api/orders/mine  — user's orders
router.get('/mine', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('orderItems.product', 'name image')
    .sort({ createdAt: -1 });
  res.json(orders);
}));

// GET /api/orders/:id
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized' });
  res.json(order);
}));

// GET /api/orders  (admin — all orders)
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
}));

// PUT /api/orders/:id/status  (admin)
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id, { status: req.body.status }, { new: true }
  );
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}));

module.exports = router;
