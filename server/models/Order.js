const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:       { type: String, required: true },
  image:      { type: String },
  quantity:   { type: Number, required: true, min: 1 },
  packType:   { type: String, enum: ['CASE', 'PC'] },
  unitPrice:  { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  shippingAddress: {
    street:  String,
    city:    String,
    state:   String,
    zip:     String,
  },
  subtotal:    { type: Number, required: true },
  tax:         { type: Number, default: 0 },
  total:       { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paidAt:      Date,
  deliveredAt: Date,
  notes:       String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
