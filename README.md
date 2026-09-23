# Shahi Angaar — Full-Stack Website

A restaurant ordering website with:
- **Frontend:** Angular 18 (standalone components, signals)
- **Backend:** PHP 8 REST API
- **Database:** MongoDB
- **Admin panel:** add/edit/delete menu items, upload photos
- **Ordering:** cart → WhatsApp checkout (no payment gateway needed)

```
project/
├── frontend/     Angular app (what customers and the admin see)
└── backend/      PHP API + MongoDB (menu data, admin login, image uploads)
```

This was built and syntax-checked in a sandbox, but it has **not** been
run end-to-end against a real MongoDB server — you'll do that on your own
machine or server, following the steps below. Everything is standard,
well-documented tooling (Angular CLI, Composer, MongoDB), so a developer
familiar with any of these can also pick it up easily.

---

## 1. Install prerequisites (once)

On your computer or server, install:
- **Node.js** 18+ and npm — https://nodejs.org
- **PHP** 8.1+ with the **MongoDB extension**:
  - Ubuntu/Debian: `sudo apt install php php-cli php-mbstring php-xml php-mongodb`
  - If `php-mongodb` isn't available as a package, install it via PECL: `sudo pecl install mongodb` then add `extension=mongodb.so` to your `php.ini`
- **Composer** (PHP package manager) — https://getcomposer.org/download/
- **MongoDB** — either:
  - Install locally: https://www.mongodb.com/docs/manual/installation/, or
  - Use a free **MongoDB Atlas** cluster (easier, no install): https://www.mongodb.com/cloud/atlas — create a free cluster and copy its connection string

---

## 2. Backend setup (PHP + MongoDB)

```bash
cd backend
composer install
cp .env.example .env
```

Open `.env` and set:
- `MONGODB_URI` — your local MongoDB URL (default is usually fine) or your Atlas connection string
- `JWT_SECRET` — replace with any long random string (this signs admin login sessions)
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — the admin account that `seed.php` will create

Then load your starting menu (all 107 items) and create the admin account:

```bash
php seed.php
```

Start the API (for local development):

```bash
php -S localhost:8000 -t public
```

Your API is now running at `http://localhost:8000/api/menu`.

**Admin login credentials** (from `.env`, defaults shown — **change the password
after your first login in a real deployment**):
- Username: `admin`
- Password: `Angaar@2026`

> There's no "change password" screen yet — to change it, generate a new hash
> with `php -r "echo password_hash('YourNewPassword', PASSWORD_BCRYPT);"` and
> update the `passwordHash` field on the `admin` document in the `users`
> collection (MongoDB Compass or `mongosh` works well for this).

### Deploying the backend for real

Any host that gives you PHP 8.1+ and lets you install Composer packages works
(a VPS, or PHP-friendly shared hosting). Point your web server's document
root at `backend/public`, upload `.env` (with production values), run
`composer install` and `php seed.php` once on the server, and the API is live.
Uploaded images are saved under `backend/public/uploads/`.

---

## 3. Frontend setup (Angular)

```bash
cd frontend
npm install
```

Open `src/app/config.ts` and set `API_BASE_URL` to wherever your backend
lives:
- Local development: `http://localhost:8000/api` (already the default)
- After deploying: `https://your-domain.com/api`

Run it locally:

```bash
npm start
```

This opens the site at `http://localhost:4200`. The homepage, `/menu`, and
`/admin/login` → `/admin` (using the credentials above) should all work as
long as the backend from step 2 is running.

### Building for production

```bash
npm run build
```

This outputs static files to `frontend/dist/frontend/browser`. Upload that
folder's contents to any static host (Netlify, Vercel, a VPS, or the same
server as the backend under a subfolder) — it's plain HTML/CSS/JS, no Node
server required to serve it.

---

## 4. Adding photos to menu items

Real dish photos were intentionally left out of the starting data — scraping
photos from the internet risks copyright issues, and there was no photo set
to import. Once the admin panel is running:

1. Log in at `/admin/login`
2. Click **Edit** on any item (or **+ Add item** for a new one)
3. Choose a photo under **Photo** and hit **Save**

The image uploads to the backend and is stored under `backend/public/uploads/`;
its path is saved on the menu item and shown automatically on the menu page.
Items with no photo fall back to a category icon, so the menu never looks
broken while you're adding photos gradually.

---

## 5. What's included vs. what you'll still want to add

**Included:** full menu CRUD, image upload, JWT-protected admin routes,
WhatsApp checkout, all 107 starting menu items pre-loaded by `seed.php`,
**menu search**, **star ratings & reviews** (customers rate/review any dish,
no login needed), **order tracking** (an order is saved when a customer
checks out, and they can look it up later by phone at `/track-order`), and
an **admin analytics dashboard** (`/admin/analytics` — total orders, revenue,
orders today, average order value, top-selling dishes, orders by status).

No extra setup is needed for these — `reviews` and `orders` are new MongoDB
collections that get created automatically the first time someone submits a
review or places an order.

**New pages/routes:**
- `/track-order` — public, customer enters their phone number to see order status
- `/admin/orders` — admin only, see every order and change its status (pending → preparing → ready → completed/cancelled)
- `/admin/analytics` — admin only, sales dashboard

**Not included (intentionally, to keep this deployable as-is):** online
payments, customer accounts/login, multi-admin roles, and automated tests.
If you want any of these next, they build cleanly on top of what's here —
just ask.
