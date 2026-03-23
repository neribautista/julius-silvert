# Julius Silvert — MERN Stack Wholesale Portal

Full-stack recreation of the Julius Silvert wholesale food ordering site built with **MongoDB · Express · React · Node.js**.

---

## Project Structure

```
julius-silvert/
├── client/                  # React frontend (Create React App)
│   ├── public/
│   └── src/
│       ├── api.js           # Axios client + all API calls
│       ├── context/         # AuthContext, CartContext
│       ├── components/
│       │   ├── layout/      # Navbar, Footer
│       │   └── products/    # ProductCard
│       └── pages/           # HomePage, ProductsPage, ProductPage,
│                            # CartPage, CheckoutPage, LoginPage,
│                            # RegisterPage, AccountPage
├── server/                  # Express backend
│   ├── config/db.js         # MongoDB connection
│   ├── middleware/auth.js   # JWT protect + admin guard
│   ├── models/              # User, Product, Order
│   └── routes/              # auth, products, orders, cart
├── seed.js                  # Sample product seeder
└── package.json             # Root monorepo scripts
```

---

## Quick Start (Local)

### 1. Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 2. Install all dependencies
```bash
npm run install:all
```

### 3. Configure environment
```bash
cp server/.env.example server/.env
```
Edit `server/.env`:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/julius-silvert
JWT_SECRET=pick_a_long_random_string
CLIENT_URL=http://localhost:3000
```

### 4. Seed the database
```bash
node seed.js
```

### 5. Run in development
```bash
npm run dev
```
- React: http://localhost:3000  
- API:   http://localhost:5000/api

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login, returns JWT |
| GET  | /api/auth/me | ✅ | Get current user |
| PUT  | /api/auth/profile | ✅ | Update profile |
| GET  | /api/products | — | List products (filter: category, search, isNew, isFeatured) |
| GET  | /api/products/:id | — | Single product |
| POST | /api/products | Admin | Create product |
| PUT  | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |
| GET  | /api/cart | ✅ | Get cart |
| POST | /api/cart | ✅ | Add/update item |
| DELETE | /api/cart/:productId | ✅ | Remove item |
| DELETE | /api/cart | ✅ | Clear cart |
| POST | /api/orders | ✅ | Place order |
| GET  | /api/orders/mine | ✅ | User's order history |
| GET  | /api/orders/:id | ✅ | Single order |
| GET  | /api/orders | Admin | All orders |
| PUT  | /api/orders/:id/status | Admin | Update order status |

---

## GreenGeeks Deployment

> **Important:** GreenGeeks **shared hosting** runs Apache/PHP and cannot run a persistent Node.js process.  
> You have two options:

---

### Option A — GreenGeeks VPS (recommended for full MERN)

GreenGeeks VPS gives you full SSH access and supports Node.js natively.

#### 1. Build the React frontend
```bash
npm run build
# Output: client/build/
```

#### 2. Upload files via SFTP (FileZilla or similar)
Upload the entire project (excluding `node_modules`) to `/var/www/julius-silvert/`

#### 3. SSH into your VPS and install dependencies
```bash
ssh user@your-vps-ip
cd /var/www/julius-silvert
npm run install:all
```

#### 4. Set environment variables
```bash
nano /var/www/julius-silvert/server/.env
# Add your MONGO_URI, JWT_SECRET, NODE_ENV=production
```

#### 5. Install PM2 (process manager)
```bash
npm install -g pm2
pm2 start server/index.js --name julius-silvert
pm2 save
pm2 startup   # follow printed instructions to auto-start on reboot
```

#### 6. Configure Nginx reverse proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/julius-silvert/client/build;
        try_files $uri /index.html;
    }
}
```
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

### Option B — GreenGeeks Shared Hosting (frontend only)

If you only have shared hosting, deploy the React build as a static site and host the backend elsewhere (Railway, Render, or Fly.io are free).

#### Frontend (GreenGeeks shared):
```bash
npm run build
# Upload contents of client/build/ to public_html/ via cPanel File Manager
```

#### Backend (free tier on Railway.app):
1. Push the `server/` folder to a GitHub repo
2. Connect to [railway.app](https://railway.app), deploy from repo
3. Add environment variables in Railway dashboard
4. Copy the Railway URL (e.g. `https://julius-silvert.up.railway.app`)
5. In `client/src/api.js`, update baseURL:
   ```js
   const api = axios.create({ baseURL: 'https://julius-silvert.up.railway.app/api' });
   ```
6. Rebuild: `npm run build` and re-upload to GreenGeeks

---

## Making a User an Admin

Via MongoDB Atlas Data Explorer or `mongosh`:
```js
db.users.updateOne(
  { email: "admin@yourdomain.com" },
  { $set: { role: "admin" } }
)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, TanStack Query, Axios |
| Styling | Plain CSS with CSS custom properties (no UI framework) |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| Dev tools | nodemon, concurrently |
