const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// GET all products
router.get('/', asyncHandler(async (req, res) => {
  const { category, search, isNew, isFeatured, page = 1, limit = 20 } = req.query;
  
  const filter = {};
  if (category) filter.category = category;
  if (isNew === 'true') filter.isNew = true;
  if (isFeatured === 'true') filter.isFeatured = true;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.json({
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
}));

// POST /api/products/seed (MUST be before /:id routes)
router.post('/seed', asyncHandler(async (req, res) => {
  try {
    await Product.deleteMany({});
    
    const products = [
      // Meat & Poultry – Compart Duroc Pork
      { name: 'Bone-In Pork Butt', brand: 'COMPART', itemNumber: '1816662', category: 'Meat & Poultry', pricePerLb: 0, caseSize: '8 x 8.75lb', packOptions: [{ type: 'CASE' }, { type: 'PC' }], isNew: true, inStock: true, tags: ['pork','compart','duroc'] },
      { name: 'Boneless Center Cut Pork Loin, Strap On', brand: 'COMPART', itemNumber: '1816663', category: 'Meat & Poultry', pricePerLb: 5.51, caseSize: '3 x 10lb', packOptions: [{ type: 'CASE' }, { type: 'PC' }], isNew: true, inStock: true, tags: ['pork','loin'] },
      { name: 'Pork Tenderloin', brand: 'COMPART', itemNumber: '1816664', category: 'Meat & Poultry', pricePerLb: 6.28, caseSize: '5 x 2lb', packOptions: [{ type: 'CASE' }], isNew: true, inStock: true, tags: ['pork','tenderloin'] },
      { name: 'Frenched Pork Rib Racks, 10 Bone', brand: 'COMPART', itemNumber: '1816665', category: 'Meat & Poultry', pricePerLb: 10.98, caseSize: '4 x 7lb', packOptions: [{ type: 'CASE' }, { type: 'PC' }], isNew: true, inStock: true, tags: ['pork','ribs'] },
      { name: 'Pork Cheeks — Frozen', brand: 'COMPART', itemNumber: '1816666', category: 'Meat & Poultry', pricePerLb: 4.77, caseSize: '2 x 5lb', packOptions: [{ type: 'CASE' }], isNew: true, inStock: true, tags: ['pork','frozen'] },
      // Featured / specials
      { name: 'USDA Choice Ribeye Steak', brand: 'SILVERT', itemNumber: '2010001', category: 'Meat & Poultry', pricePerLb: 14.99, caseSize: '10 x 14oz', packOptions: [{ type: 'CASE' }, { type: 'PC' }], isFeatured: true, inStock: true, tags: ['beef','steak','featured'] },
      { name: 'Whole Atlantic Salmon Fillet', brand: 'SILVERT', itemNumber: '3050001', category: 'Seafood', pricePerLb: 8.49, caseSize: '2 x 5lb', packOptions: [{ type: 'CASE' }, { type: 'PC' }], isFeatured: true, inStock: true, tags: ['salmon','seafood','fresh'] },
      { name: 'Fresh Chicken Breast, Boneless Skinless', brand: 'SILVERT', itemNumber: '2020001', category: 'Meat & Poultry', pricePerLb: 3.29, caseSize: '4 x 5lb', packOptions: [{ type: 'CASE' }], isFeatured: true, inStock: true, tags: ['chicken','poultry'] },
      // Dairy
      { name: 'Large Grade A Eggs', brand: 'SILVERT', itemNumber: '4010001', category: 'Dairy & Eggs', pricePerLb: 0, caseSize: '15 doz', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['eggs','dairy'] },
      { name: 'Heavy Whipping Cream', brand: 'SILVERT', itemNumber: '4020001', category: 'Dairy & Eggs', pricePerLb: 2.99, caseSize: '4 x 1qt', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['cream','dairy'] },
      // Cheese & Charcuterie
      { name: 'Parmigiano Reggiano Wheel', brand: 'SILVERT', itemNumber: '5010001', category: 'Cheese & Charcuterie', pricePerLb: 18.99, caseSize: '1 x 80lb', packOptions: [{ type: 'CASE' }, { type: 'PC' }], isFeatured: true, inStock: true, tags: ['cheese','italian'] },
      { name: 'Prosciutto di Parma', brand: 'SILVERT', itemNumber: '5020001', category: 'Cheese & Charcuterie', pricePerLb: 22.50, caseSize: '1 x 16lb', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['charcuterie','italian'] },
      // Oils & Vinegars
      { name: 'Extra Virgin Olive Oil', brand: 'SILVERT', itemNumber: '6010001', category: 'Oils & Vinegars', pricePerLb: 0, caseSize: '6 x 1L', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['olive oil','cooking'] },
      { name: 'Balsamic Vinegar of Modena', brand: 'SILVERT', itemNumber: '6020001', category: 'Oils & Vinegars', pricePerLb: 0, caseSize: '12 x 500ml', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['vinegar','italian'] },
      // Produce
      { name: 'Organic Mixed Greens', brand: 'SILVERT', itemNumber: '7010001', category: 'Produce', pricePerLb: 4.99, caseSize: '12 x 1lb', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['organic','greens','salad'] },
      // Frozen
      { name: 'French Fries, Shoestring Cut', brand: 'SILVERT', itemNumber: '8010001', category: 'Frozen', pricePerLb: 1.99, caseSize: '6 x 5lb', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['fries','frozen','potato'] },
      // Pantry
      { name: 'San Marzano Tomatoes, Whole Peeled', brand: 'SILVERT', itemNumber: '9010001', category: 'Pantry', pricePerLb: 0, caseSize: '6 x #10 can', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['tomatoes','canned','italian'] },
      // Supplies
      { name: 'Disposable Nitrile Gloves, Large', brand: 'SILVERT', itemNumber: '1010001', category: 'Supplies', pricePerLb: 0, caseSize: '10 x 100ct', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['gloves','supplies'] },
    ];
    
    await Product.insertMany(products);
    res.json({ message: 'Seeded successfully', count: products.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}));

// GET /api/products/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

// POST /api/products (admin)
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}));

// PUT /api/products/:id (admin)
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

// DELETE /api/products/:id (admin)
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product removed' });
}));

module.exports = router;
