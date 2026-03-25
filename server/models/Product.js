const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, trim: true },
  itemNumber: { type: String, unique: true },
  category: {
    type: String,
    enum: ['Meat & Poultry', 'Dairy & Eggs', 'Cheese & Charcuterie',
           'Oils & Vinegars', 'Baking & Pastry', 'Produce',
           'Frozen', 'Seafood', 'Pantry', 'Supplies'],
    required: true,
  },
  description: { type: String },
  image:      { type: String, default: '/images/placeholder.jpg' },
  imageHover: { type: String, default: '' },
  pricePerLb: { type: Number },
  caseSize: { type: String },
  packOptions: [{
    type: { type: String, enum: ['CASE', 'PC'] },
    price: Number,
  }],
  isNew:      { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  inStock:    { type: Boolean, default: true },
  tags: [String],
}, { 
  timestamps: true,
  suppressReservedKeysWarning: true
});

productSchema.index({ name: 'text', brand: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);