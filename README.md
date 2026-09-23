# 🍢 Shahi Angaar

A full-stack restaurant ordering website for **Shahi Angaar** — Karachi's charcoal-grilled BBQ, karahi and biryani kitchen. Customers browse the menu, search dishes, leave ratings, add items to a cart and check out straight to WhatsApp. A password-protected admin panel manages the menu, tracks orders and shows sales analytics.

**Stack:** Angular (frontend) · PHP (REST API) · MongoDB (database)

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend setup](#1-backend-setup)
  - [2. Frontend setup](#2-frontend-setup)
- [Default admin login](#default-admin-login)
- [API reference](#api-reference)
- [Environment variables](#environment-variables)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

**Customer-facing**
- 🍽️ Full menu — 100+ dishes across 14 categories (BBQ, Karahi, Biryani, Fast Food, Chinese, Desserts, and more)
- 🔍 Live search across the whole menu
- 🔥 "Hot Selling" quick filter alongside category tabs
- ⭐ Star ratings & reviews on every dish — no login required
- 🛒 Cart with quantity controls, persisted in the browser
- 💬 One-tap checkout — order summary is sent straight to WhatsApp
- 📦 Order tracking by phone number (`/track-order`)

**Admin panel** (`/admin/login`)
- 🔐 JWT-protected login
- 🍢 Menu management — add, edit, delete dishes; upload a photo per dish
- 📋 Orders dashboard — see every order, update status (pending → preparing → ready → completed/cancelled)
- 📊 Analytics — total orders, revenue, orders today, average order value, top-selling dishes, orders by status

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Angular 18 (standalone components, signals), TypeScript |
| Backend | PHP 8+ (plain REST API, no framework) |
| Database | MongoDB (via `mongodb/mongodb` PHP library) |
| Auth | JWT (`firebase/php-jwt`) |
| Fonts | Playfair Display, Inter, Noto Nastaliq Urdu (Google Fonts) |

No frontend framework dependencies beyond Angular itself — no UI kit, no CSS framework. Styling is hand-written CSS using a small set of design tokens (CSS custom properties) for easy re-theming.

---

## Project structure

```
shahi-angaar/
├── frontend/                      Angular app
│   ├── src/app/
│   │   ├── components/            Shared UI: cart drawer, star rating, review modal, admin nav
│   │   ├── guards/                Route guard for /admin
│   │   ├── pages/                 home, menu, track-order, admin-login, admin-dashboard, admin-orders, admin-analytics
│   │   ├── services/              menu, cart, auth, order, review, analytics
│   │   ├── app.component.*        App shell: header, footer, cart drawer
│   │   └── app.routes.ts
│   └── package.json
│
├── backend/                       PHP REST API
│   ├── public/
│   │   ├── index.php              Front controller / router
│   │   └── uploads/               Uploaded dish photos
│   ├── src/
│   │   ├── Controllers/           Menu, Auth, Upload, Review, Order, Analytics
│   │   ├── Auth.php               JWT issue/verify
│   │   └── Database.php           MongoDB connection
│   ├── seed_data/menu.json        Starting menu (100+ dishes)
│   ├── seed.php                   Creates admin user + imports the starting menu
│   ├── composer.json
│   └── .env.example
│
└── README.md
```

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 18+ and npm
- [PHP](https://www.php.net/) 8.1+ with the **MongoDB extension** (`php-mongodb`)
- [Composer](https://getcomposer.org/)
- A MongoDB instance — either installed locally or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Backend setup

```bash
cd backend
composer install
cp .env.example .env
```

Edit `.env`:

| Variable | Description |
|---|---|
| `MONGODB_URI` | Your MongoDB connection string |
| `MONGODB_DB` | Database name (default `shahi_angaar`) |
| `JWT_SECRET` | Any long random string — signs admin login sessions |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin account created by `seed.php` |
| `CORS_ORIGIN` | The frontend's URL (default `http://localhost:4200`) |

Load the starting menu and create the admin account:

```bash
php seed.php
```

Start the API:

```bash
php -S localhost:8000 -t public
```

The API is now live at `http://localhost:8000/api`.

### 2. Frontend setup

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`. If your backend isn't running on `localhost:8000`, update `API_BASE_URL` in `src/app/config.ts`.

Build for production:

```bash
npm run build
```

