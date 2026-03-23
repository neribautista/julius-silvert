/**
 * Seed script — run with: node server/seed.js
 * Requires MONGO_URI in server/.env
 */
require('dotenv').config({ path: __dirname + '/server/.env' });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('No MONGO_URI in server/.env'); process.exit(1); }

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 30000,
}).then(() => console.log('DB connected'));

const Product = require('./server/models/Product');

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
  // Cheese
  { name: 'Parmigiano Reggiano DOP', brand: 'IMPORTED', itemNumber: '5010001', category: 'Cheese & Charcuterie', pricePerLb: 12.49, caseSize: '1 x 10lb', packOptions: [{ type: 'CASE' }, { type: 'PC' }], inStock: true, tags: ['cheese','italian','parm'] },
  { name: 'Prosciutto di Parma 24mo', brand: 'IMPORTED', itemNumber: '5020001', category: 'Cheese & Charcuterie', pricePerLb: 18.99, caseSize: '1 x 17lb', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['charcuterie','prosciutto','italian'] },
  // Produce
  { name: 'Roma Tomatoes', brand: '', itemNumber: '6010001', category: 'Produce', pricePerLb: 1.29, caseSize: '25lb case', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['tomatoes','produce','fresh'] },
  { name: 'Baby Arugula', brand: '', itemNumber: '6020001', category: 'Produce', pricePerLb: 3.49, caseSize: '4 x 1lb', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['arugula','salad','produce'] },
  // Seafood
  { name: 'Gulf Shrimp 16/20, Peeled & Deveined', brand: 'SILVERT', itemNumber: '3010001', category: 'Seafood', pricePerLb: 9.99, caseSize: '4 x 5lb', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['shrimp','seafood','frozen'] },
  { name: 'Sea Scallops U10', brand: 'SILVERT', itemNumber: '3020001', category: 'Seafood', pricePerLb: 22.99, caseSize: '5lb', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['scallops','seafood'] },
  // Pantry
  { name: 'Extra Virgin Olive Oil', brand: 'SILVERT', itemNumber: '7010001', category: 'Oils & Vinegars', pricePerLb: 0, caseSize: '6 x 1L', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['olive oil','pantry'] },
  { name: 'All-Purpose Flour', brand: 'SILVERT', itemNumber: '8010001', category: 'Baking & Pastry', pricePerLb: 0.49, caseSize: '50lb bag', packOptions: [{ type: 'CASE' }], inStock: true, tags: ['flour','baking'] },
];

async function seed() {
  try {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅  Seeded ${products.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
