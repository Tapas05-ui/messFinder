# 🏠 MessFinder

> **Find your perfect mess near college — without stepping outside.**

MessFinder is a full-stack web platform that solves a real problem faced by every new college student: finding affordable, suitable mess accommodation near their college. Instead of physically visiting 5–6 mess houses and comparing them mentally, students can now browse, compare, and book mess rooms online — all from their phone or laptop.

---

## 🎯 The Problem We Solve

When a new student arrives at college and wants to stay in a mess instead of a hostel, they face these challenges:

- They don't know **which mess houses exist** near their college
- They have **no information about facilities** — WiFi, water, electricity, AC, etc.
- They don't know **which floors rooms are on**, how many people share a room, or what the rent covers
- They have to **physically visit 5–6 mess houses** just to compare prices and availability
- They **waste days** finding accommodation when they should be settling into college life

MessFinder eliminates all of this.

---

## ✅ Our Services

### 🎓 For Students

| Service                   | Description                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| **Browse Mess Listings**  | Explore all available mess houses near your college with photos, prices, and full details    |
| **Search & Filter**       | Filter by city, college, rent range, and gender-allowed policy to find exactly what you need |
| **Detailed Room Info**    | See room number, floor, capacity, and rent per person for every room before visiting         |
| **Facility Transparency** | Know upfront if WiFi, AC, TV, laundry, parking, security, and kitchen are available          |
| **Bills Clarity**         | See whether electricity and water bills are included in the rent or charged separately       |
| **Photo Gallery**         | View multiple real photos of the mess before making any decision                             |
| **Save Favourites**       | Bookmark mess listings you like and compare them later                                       |
| **Online Booking**        | Send a booking request with your preferred move-in date and a message to the owner           |
| **Booking Tracking**      | Track the status of your booking — pending, confirmed, or cancelled — in real time           |
| **Instant Notifications** | Get notified the moment your booking is confirmed or updated by the owner                    |

---

### 🏢 For Mess Owners

| Service                   | Description                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------- |
| **List Your Mess**        | Register and list your mess with complete details to reach thousands of students    |
| **Multiple Photo Upload** | Upload up to 10 photos per listing so students can see your mess before visiting    |
| **Room Management**       | Add individual rooms with floor, capacity, and rent per person details              |
| **Facility Listing**      | Highlight all the facilities you offer to attract the right tenants                 |
| **Availability Control**  | Mark your entire mess as available or unavailable with one click when rooms fill up |
| **Edit Anytime**          | Update your listing details, photos, and room information at any time               |
| **Booking Dashboard**     | See all incoming booking requests from students in one place                        |
| **Confirm or Decline**    | Accept or decline booking requests with an optional note to the student             |
| **Real-time Alerts**      | Get notified instantly on your dashboard when a student sends a booking request     |

---

### 🛡️ For Administrators

| Service                 | Description                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| **Owner Verification**  | Review and approve or reject mess owner registrations before they go live    |
| **Platform Overview**   | Monitor all students, owners, mess listings, and bookings from one dashboard |
| **User Management**     | Activate, deactivate, or delete any user account on the platform             |
| **Content Control**     | View and remove any mess listing that violates platform policies             |
| **Booking Oversight**   | Track all booking activity across the entire platform                        |
| **Notification System** | Receive alerts for every new owner registration and booking on the platform  |

---

## 🚀 Key Features

- 🔐 **Role-based authentication** — separate flows for Student, Owner, and Admin
- ✅ **Owner approval system** — admins verify owners before listings go live
- 🔔 **Real-time notifications** — powered by Socket.io for instant alerts
- 📸 **Cloud photo storage** — photos stored securely on Cloudinary
- 📱 **Fully responsive** — works on mobile, tablet, and desktop
- 🔍 **Smart filtering** — find mess by city, college, budget, and gender policy
- ❤️ **Favourites system** — save and revisit listings you're interested in
- 💬 **Booking messages** — students can introduce themselves when sending a request
- 📊 **Admin dashboard** — complete platform stats and management tools

---

## 🛠️ Tech Stack

| Layer              | Technology                                           |
| ------------------ | ---------------------------------------------------- |
| **Frontend**       | React 18, Vite, Tailwind CSS, React Router v6        |
| **Backend**        | Node.js, Express.js                                  |
| **Database**       | MongoDB with Mongoose                                |
| **Authentication** | JWT (JSON Web Tokens)                                |
| **Real-time**      | Socket.io                                            |
| **File Storage**   | Cloudinary + Multer                                  |
| **HTTP Client**    | Axios                                                |
| **Deployment**     | Vercel (frontend) + Render (backend) + MongoDB Atlas |

---

## 👥 User Roles

### Student

- Registers instantly with email and password
- Can browse all listings without logging in
- Must be logged in to book or save favourites

### Mess Owner

- Registers with details and waits for admin approval
- Once approved, can log in and manage listings
- Receives real-time booking notifications

### Admin

- Created via setup script (not public registration)
- Has full control over the platform
- Approves owners, monitors activity, manages users

---

## 🔮 Future Plans

- 🗺️ **Map view** — show mess locations on an interactive map
- ⭐ **Reviews & ratings** — students rate mess after staying
- 💬 **In-app chat** — direct messaging between student and owner
- 📧 **Email notifications** — confirmation emails for bookings
- 📱 **Mobile app** — React Native version
- 💳 **Online payment** — pay advance rent through the platform
- 🔍 **Geo search** — find mess within X km of a specific college

---

<p align="center">Built with ❤️ to make student life easier</p>
