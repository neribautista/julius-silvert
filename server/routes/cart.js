const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const getCart = async (userId) => {
  const user = await User.findById(userId).populate('cart.product', 'name image pricePerLb caseSize packOptions inStock');
  return user.cart;
};

// GET /api/cart
router.get('/', protect, asyncHandler(async (req, res) => {
  res.json(await getCart(req.user._id));
}));

// POST /api/cart  — add / update item
router.post('/', protect, asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user._id);
  const idx = user.cart.findIndex(i => i.product.toString() === productId);
  if (idx >= 0) {
    user.cart[idx].quantity = quantity;
  } else {
    user.cart.push({ product: productId, quantity });
  }
  await user.save();
  res.json(await getCart(req.user._id));
}));

// DELETE /api/cart/:productId
router.delete('/:productId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(i => i.product.toString() !== req.params.productId);
  await user.save();
  res.json(await getCart(req.user._id));
}));

// DELETE /api/cart  — clear cart
router.delete('/', protect, asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { cart: [] });
  res.json([]);
}));

module.exports = router;
