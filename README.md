# 🏠 MessFinder — MERN Stack Project

Find the perfect mess near your college. Compare rooms, facilities, and book — all in one place.

---

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB (Mongoose), Socket.io, Cloudinary, Multer, JWT

**Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Socket.io-client, Axios

---

## Project Structure

```
MessFinder/
├── backend/
│   ├── config/          # DB & Cloudinary config
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models (User, Mess, Booking, Notification)
│   ├── routes/          # Express routes
│   ├── utils/           # createAdmin seed script
│   └── server.js        # Entry point
└── frontend/
    └── src/
        ├── components/  # Navbar, Footer, MessCard
        ├── context/     # AuthContext (user state + socket)
        ├── pages/       # All pages
        │   ├── admin/
        │   ├── owner/
        │   └── student/
        └── utils/       # Axios API helpers
```

---

## Setup Instructions

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Backend `.env`

Create `backend/.env` (see `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/messfinder
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Create Admin User (run once)

```bash
cd backend
node utils/createAdmin.js
```

Admin credentials:
- Email: `admin@messfinder.com`
- Password: `Admin@123`

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000

---

## User Roles

| Role    | Capabilities |
|---------|-------------|
| Student | Browse mess, save favourites, book rooms |
| Owner   | List mess, manage rooms, handle bookings (requires admin approval) |
| Admin   | Approve/reject owners, manage all users, view all listings & bookings |

---

## Key Features

- ✅ Role-based auth (Student / Owner / Admin)
- ✅ Owner registration with admin approval flow
- ✅ Real-time notifications via Socket.io
- ✅ Multiple photo uploads via Cloudinary + Multer
- ✅ Mess listing with rooms, facilities, bills info
- ✅ Search & filter (city, rent range, gender, college)
- ✅ Student favourites system
- ✅ Booking flow with owner confirm/decline + notes
- ✅ Admin dashboard with stats & controls
- ✅ Responsive UI with Tailwind CSS

---

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/mess` | Public |
| GET | `/api/mess/:id` | Public |
| POST | `/api/mess` | Owner |
| PUT | `/api/mess/:id` | Owner/Admin |
| DELETE | `/api/mess/:id` | Owner/Admin |
| POST | `/api/bookings` | Student |
| GET | `/api/bookings/my` | Student |
| GET | `/api/bookings/owner` | Owner |
| PATCH | `/api/bookings/:id/status` | Owner |
| GET | `/api/admin/stats` | Admin |
| PATCH | `/api/admin/owners/:id/approval` | Admin |
| GET | `/api/notifications` | Auth |
