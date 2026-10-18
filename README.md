# 🚗 Vista Tour & Travels (MERN Monorepo)

5.0★ Google Verified Tour Operator & Chauffeur Luxury Cab Service in Mohali, Chandigarh & Himachal Pradesh.

---

## 🏗️ Repository Architecture

This repository is organized as a clean, decoupled MERN monorepo:

```text
vista-tour-travel/
├── api/
│   └── index.js                      # Vercel Serverless Function adapter bridge
├── client/                           # React frontend (Vite + Tailwind CSS)
│   ├── public/                       # Favicon, logo emblem, robots.txt, sitemap.xml
│   ├── src/                          # Pages, components, hooks, services, contexts
│   ├── .env.example                  # Client environment variable template
│   ├── .gitignore                    # Client-specific Git ignore rules
│   ├── package.json                  # Client dependencies & scripts
│   ├── vercel.json                   # Client SPA rewrite rules (for decoupled deploy)
│   └── vite.config.js                # Vite build & local proxy settings
├── server/                           # Express REST API & MongoDB backend
│   ├── config/                       # DB connection & startup environment validation
│   ├── controllers/                  # Route handlers & business logic
│   ├── middleware/                   # Auth guards, upload filter, centralized error handling
│   ├── models/                       # Mongoose schemas (Packages, Cars, Bookings, etc.)
│   ├── routes/                       # Express API route declarations
│   ├── scripts/                      # DB utilities (upsertAdmin, seedProduction, seedCars)
│   ├── seed/                         # Initial seed dataset
│   ├── services/                     # Cloudinary & cloud media storage
│   ├── uploads/                      # Local fallback upload directory (.gitkeep)
│   ├── utils/                        # Token generation, slugify, booking IDs
│   ├── .env.example                  # Server environment variable template
│   ├── .gitignore                    # Server-specific Git ignore rules
│   ├── package.json                  # Server dependencies & scripts
│   └── server.js                     # Canonical Express application entry point
├── scripts/
│   └── install-all.js                # Cross-platform dependency installer
├── .env.example                      # Root environment reference
├── .gitignore                        # Hardened root Git ignore rules
├── package.json                      # Monorepo orchestration scripts
└── vercel.json                       # Full-stack Vercel rewrite configuration
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster URI

### 2. Install All Dependencies
Run the cross-platform installer from the repository root:
```bash
npm run install:all
```
*(Or install each tier manually: `cd server && npm install`, `cd client && npm install --legacy-peer-deps`)*

### 3. Configure Environment Variables
Copy the `.env.example` templates to `.env` in both `server/` and `client/`:

#### A. Backend (`server/.env`)
```bash
cp server/.env.example server/.env
```
Key configuration:
- `PORT=5000`
- `NODE_ENV=development`
- `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vista-tour-travel?retryWrites=true&w=majority`
- `JWT_SECRET=your_cryptographically_secure_jwt_secret_min_32_chars`
- `CLIENT_URL=http://localhost:5173`
- `ADMIN_EMAIL=admin@vistatourtravels.com`
- `ADMIN_PASSWORD=Vista@Admin2026!`

#### B. Frontend (`client/.env`)
```bash
cp client/.env.example client/.env
```
Key configuration:
- `VITE_API_URL=http://localhost:5000/api`
- `VITE_APP_TITLE="Vista Tour and Travels"`
- `VITE_APP_PHONE="+91 98765 43210"`
- `VITE_APP_EMAIL="info@vistatourtravels.com"`

---

## 💻 Development Commands

| Task | Root Command | Directory Specific |
|---|---|---|
| **Start Frontend** | `npm run dev:client` | `cd client && npm run dev` |
| **Start Backend** | `npm run dev:server` | `cd server && npm run dev` |
| **Production Build** | `npm run build:client` | `cd client && npm run build` |
| **Start Server** | `npm start` | `cd server && npm start` |
| **Seed Database** | `npm run seed` | `cd server && npm run seed` |
| **Upsert Admin** | `npm run admin:upsert` | `cd server && npm run admin:upsert` |

- **Frontend App**: `http://localhost:5173/`
- **Backend API**: `http://localhost:5000/api/health`
- **Admin Portal**: `http://localhost:5173/admin/login`

---

## 🚀 Production Deployment Guide

### Option 1: Decoupled Deployment (Recommended Architecture)
- **Frontend (Client)**: Deploy `client/` to **Vercel**
  - **Framework Preset**: Vite
  - **Root Directory**: `client`
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
  - **Environment Variables**: `VITE_API_URL=https://your-backend-api.com/api`
- **Backend (Server)**: Deploy `server/` to **Render / Railway / Fly.io / VPS**
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Environment Variables**: Configure `PORT`, `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, etc.

### Option 2: Full-Stack Monorepo Deployment on Vercel
Deploy the entire repository root to Vercel:
- **Root Directory**: `.`
- **Build Command**: `npm run build`
- **Output Directory**: Automatically handled by root `vercel.json` and `api/index.js`
- **Note**: Ensure Cloudinary credentials are provided in Vercel environment variables, as serverless functions have an ephemeral, read-only filesystem.

---

## 🔒 DevSecOps & Security Hardening
- **Secret Protection**: Root and scoped `.gitignore` files prevent accidental commits of real `.env` files, certificates, and keys.
- **Environment Validation**: `server/config/validateEnv.js` validates all mandatory production secrets at startup without printing values.
- **Upload Sanitization**: `server/middleware/uploadMiddleware.js` strictly verifies both file extension and MIME type, rejecting malicious files and spoofed headers.
- **Authentication**: Salted Bcrypt (10 rounds) password hashing, protected JWT tokens with `httpOnly` secure cookies, and role-based route middleware.
