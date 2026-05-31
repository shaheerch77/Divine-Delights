# 🎂 Divine Delights — Online Bakery Platform

A full-stack bakery e-commerce web application built with **Next.js 14**, **MongoDB**, and **Tailwind CSS**. Customers can browse products, add items to cart, place orders, and submit custom cake requests. Admins can view all orders and registered users.

---

## ✨ Features

- 🛍️ **Product Catalog** — Browse bakery items with category filters and sort options
- 🛒 **Shopping Cart** — Add/remove items, adjust quantities, real-time totals
- 📦 **Order Placement** — Checkout flow with order number generation and confetti celebration
- 🎂 **Custom Cake Orders** — Request a custom cake with flavor, size, occasion, and design details
- 🔐 **Authentication** — Register and login with JWT-based auth, bcrypt password hashing
- 👤 **Admin Panel** — View all orders and registered users at `/admin/orders` and `/admin/users`
- 📱 **Responsive Design** — Mobile-friendly UI with smooth animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | MongoDB (native driver) |
| Auth | JSON Web Tokens + bcryptjs |
| Styling | Tailwind CSS v4 |
| State Management | React Context API |
| Animations | react-confetti |

---

## 📋 Prerequisites

Make sure you have the following installed before running the project:

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (local installation)
- npm or yarn

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/divine-delights.git
cd divine-delights
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project:

```env
MONGODB_URI=mongodb://localhost:27017/divine-delights
JWT_SECRET=your-super-secret-key-here
```

### 4. Start MongoDB

Make sure your MongoDB service is running. On Windows:

```bash
net start MongoDB
```

Or start it manually:

```bash
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db"
```

### 5. Seed the database

Populate the database with sample products:

```bash
node scripts/seedData.ts
```

You should see:
```
Inserted 10 products
```

### 6. Create an admin account (optional)

```bash
npx ts-node --skip-project scripts/seedAdmin.ts
```

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage with featured products
│   ├── catalog/page.tsx          # Full product catalog with filters
│   ├── cart/page.tsx             # Shopping cart and checkout
│   ├── custom-order/page.tsx     # Custom cake request form
│   ├── login/page.tsx            # Login page
│   ├── register/page.tsx         # Registration page
│   ├── thank-you/page.tsx        # Order confirmation page
│   ├── admin/
│   │   ├── orders/page.tsx       # Admin — view all orders
│   │   └── users/page.tsx        # Admin — view all users
│   └── api/
│       ├── auth/login/           # POST — login
│       ├── auth/register/        # POST — register
│       ├── catalog/              # GET — fetch products
│       ├── orders/               # GET / POST — orders
│       ├── orders/[id]/          # GET / PUT — single order
│       ├── cart/save/            # POST — persist cart
│       ├── cart/load/            # GET — load cart
│       ├── custom-request/       # POST — custom cake request
│       ├── admin/orders/         # GET — all orders (admin)
│       └── admin/users/          # GET — all users (admin)
├── components/
│   └── Navbar.tsx                # Navigation bar with cart count
├── context/
│   └── CartContext.tsx           # Cart state management
├── lib/
│   ├── CartContext.tsx           # Cart provider (used by layout)
│   ├── cartUtils.ts              # Cart calculation helpers
│   ├── mongodb.ts                # MongoDB client connection
│   └── orderUtils.ts             # Order number generation + totals
├── types/
│   ├── product.ts                # Product interface
│   ├── user.ts                   # User interface
│   ├── order.ts                  # Order & CustomCakeRequest interfaces
│   └── cart.ts                   # Cart & CartItem interfaces
scripts/
├── seedData.ts                   # Seeds 20 sample products
└── seedAdmin.ts                  # Creates an admin user
```

---

## 🗄️ Database Collections

| Collection | Description |
|---|---|
| `users` | Registered users with hashed passwords and roles |
| `products` | Bakery catalog items |
| `orders` | Customer orders with items, totals, and status |
| `carts` | Session-based cart persistence |
| `custom-requests` | Custom cake order submissions |

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |

---

## 👥 Authors

- **Faizan** (FA23-BCS-043)
- **Lailmah** (FA23-BCS-073)

---

## 📄 License

This project was developed as a university assignment. All rights reserved.