# 🎓 EduMotion - Full-Stack Ed-Tech Platform

EduMotion is a modern, fully-featured, and premium educational technology platform built using the **MERN (MongoDB, Express, React, Node.js) stack**. The application serves as an interactive hub bridging the gap between instructors and students. Instructors can seamlessly curate, edit, and publish rich courses, while students can browse, enroll in, purchase, and track their progress through courses.

🌐 **Live Applications:**
- **Frontend App (Deployed on Vercel):** [https://edu-motion-umber.vercel.app/](https://edu-motion-umber.vercel.app/)
- **Backend API (Deployed on Render):** [https://edumotion-backend-v5a2.onrender.com](https://edumotion-backend-v5a2.onrender.com)

---

## ⚡ Features Matrix

### 👤 Student Features
- **OTP-Based Verification:** Secure email verification (via OTP-generator & Nodemailer) during user registration.
- **Course Catalog & Details:** Browse courses by categories, view structural course content (sections and subsections), description, ratings, and instructor profiles.
- **Shopping Cart & Checkout:** Add multiple courses to cart and purchase securely.
- **Secure Payment Integration:** Integrated with the **Razorpay Payment Gateway** for fast, reliable transaction processing and automated receipt email generation.
- **Interactive Course Player:** Access full course videos and track lectures.
- **Progress Tracking:** Interactive progress bars showing the percentage of lectures completed with automatic state updates.
- **Ratings & Reviews:** Rate courses and leave text feedback, which aggregates to create an overall average rating.

### 👨‍🏫 Instructor Features
- **Interactive Dashboard:** Dynamic analytics showing key performance indicators (KPIs) such as total courses published, total enrolled students, and total revenue.
- **Visual Analytics:** Graphical reports displaying metrics using **Chart.js** & **React-Chartjs-2**.
- **Advanced Course Builder:** Multi-step course creation workflow:
  - Phase 1: Set course name, descriptions, thumbnail uploads (Cloudinary), categories, and requirements.
  - Phase 2: Structural builder to add/edit/delete sections and subsections (video lectures).
  - Phase 3: Publish controls (Draft / Active mode).
- **Course Management:** View, edit, or delete existing courses easily.

### 🛡️ Core Infrastructure & Security
- **Role-Based Access Control (RBAC):** Middleware checks mapping permissions for `Student`, `Instructor`, and `Admin` users.
- **JWT Authentication:** Secure JSON Web Token auth using cookie-based token validation.
- **Nodemailer SMTP Templates:** Pre-designed, custom HTML templates for OTPs, contact forms, and payment successes.
- **Cloudinary CDN Integration:** Direct upload pipeline for image thumbnails and video lectures to Cloudinary.

---

## 🛠️ Tech Stack & Dependencies

### Frontend
- **Core Library:** React 18
- **State Management:** Redux Toolkit (`@reduxjs/toolkit` & `react-redux`) for global authentication, cart, and profile states.
- **Routing:** React Router DOM (v6)
- **Styling:** Tailwind CSS (v3) for dynamic, responsive utilities.
- **Charts:** Chart.js & React-Chartjs-2 for instructor metrics.
- **Custom UI Features:**
  - `@ramonak/react-progress-bar` for progress tracking.
  - `swiper` for sliding course lists.
  - `video-react` for customized, responsive media playback.
  - `react-hook-form` for validated forms.
  - `react-hot-toast` for rich toast notifications.
  - `react-type-animation` for engaging landing page banners.

### Backend
- **Framework:** Node.js & Express.js (v5)
- **Database:** MongoDB & Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcrypt for password hashing.
- **File Upload & Media Management:** Express-fileupload & Cloudinary.
- **Email Service:** Nodemailer SMTP configuration.
- **Payments:** Razorpay Node SDK.
- **Session Utilities:** Cookie-parser & CORS.

---

## 📁 Workspace Architecture

```
EduMotion/
├── public/                 # Static assets
├── src/                    # Frontend source files
│   ├── assets/             # Images, logos, and illustrations
│   ├── components/         # Modular and reusable UI components
│   │   ├── common/         # Navbar, Footer, Modal, Rating stars
│   │   ├── core/           # Pages-specific structured components
│   │   │   ├── AboutPage/  # About page sections
│   │   │   ├── Auth/       # Forms, templates, and routes
│   │   │   ├── Catalog/    # Dynamic catalog sliders and cards
│   │   │   ├── Course/     # Details and payment modules
│   │   │   ├── Dashboard/  # Student/Instructor views, cart, and profile settings
│   │   │   ├── HomePage/   # Core interactive widgets
│   │   │   └── ViewCourse/ # Video sidebar and course progress panel
│   │   └── ContactPage/    # Contact form elements
│   ├── data/               # Constants and config data
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Top-level page views (Home, About, Dashboard, etc.)
│   ├── reducer/            # Root Redux reducer
│   ├── services/           # API endpoints configuration and integrations
│   │   └── operations/     # Axios API requests for auth, profile, and course
│   ├── slices/             # Redux slices (auth, profile, cart, course)
│   └── utils/              # Helper functions
├── Server/                 # Backend codebase
│   ├── config/             # DB connectivity and Cloudinary connection setup
│   ├── controllers/        # Core business logic handlers
│   ├── mail/               # HTML email templates
│   ├── middlewares/        # Authentication and authorization guards
│   ├── models/             # Mongoose schemas (User, Course, Profile, Category, Rating)
│   ├── routes/             # Express routes grouped by entity (User, Course, Profile, Payment)
│   ├── util/               # Mail sender and validation functions
│   └── index.js            # Server entry point
```

---

## 🚀 Local Setup & Configuration

### Prerequisites
- Node.js installed (v18.x or higher)
- MongoDB account or local installation
- Cloudinary developer credentials
- Razorpay API credentials
- Mail server (SMTP client) for nodemailer

### 1. Repository Setup & Dependencies
```bash
# Clone the repository
git clone https://github.com/Tushar-Sharma-hub/EduMotion.git
cd EduMotion

# Install Frontend dependencies
npm install

# Install Backend dependencies
cd Server
npm install
```

### 2. Environment Variables Configuration

Create a `.env` file inside the `Server/` directory and populate the variables:

```env
# Server details
PORT=4000
ALLOWED_ORIGINS="http://localhost:3000"

# Database
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/edumotion

# JWT Authentication
JWT_SECRET=your_jwt_signing_secret

# Cloudinary Storage
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Razorpay Integration
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_key_secret

# Nodemailer Setup
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
```

Create a `.env` file in the root directory (Frontend) if you want to override default API urls:
```env
REACT_APP_BASE_URL=http://localhost:4000/api/v1
```

### 3. Run the Project
To run both client and server concurrently, execute the following from the root directory:
```bash
npm run dev
```
- **Frontend** will start at: `http://localhost:3000`
- **Backend API** will run at: `http://localhost:4000`

---

## 📡 API Endpoints Reference

| Category | Endpoint | HTTP Method | Auth Required | Access Level | Description |
|---|---|---|---|---|---|
| **Auth** | `/api/v1/auth/signup` | POST | ❌ | Public | Register new user account |
| **Auth** | `/api/v1/auth/login` | POST | ❌ | Public | Log in and return cookie token |
| **Auth** | `/api/v1/auth/sendotp` | POST | ❌ | Public | Request verification OTP email |
| **Auth** | `/api/v1/auth/changepassword` | POST | ✔️ | Enrolled | Change authenticated password |
| **Auth** | `/api/v1/auth/reset-password-token` | POST | ❌ | Public | Send recovery token via email |
| **Auth** | `/api/v1/auth/reset-password` | POST | ❌ | Public | Apply password reset using token |
| **Profile**| `/api/v1/profile/updateProfile` | PUT | ✔️ | Owner | Edit profile fields (bio, gender, contact) |
| **Profile**| `/api/v1/profile/getUserDetails` | GET | ✔️ | Owner | Get authenticated profile data |
| **Profile**| `/api/v1/profile/deleteProfile` | DELETE | ✔️ | Owner | Permenantly delete account |
| **Profile**| `/api/v1/profile/instructorDashboard` | GET | ✔️ | Instructor | Stats & metrics for courses |
| **Course** | `/api/v1/course/createCourse` | POST | ✔️ | Instructor | Upload and construct a course draft |
| **Course** | `/api/v1/course/addSection` | POST | ✔️ | Instructor | Add modules inside a course |
| **Course** | `/api/v1/course/addSubSection` | POST | ✔️ | Instructor | Add video items to section module |
| **Course** | `/api/v1/course/getAllCourses` | GET | ❌ | Public | List all active courses |
| **Course** | `/api/v1/course/getCourseDetails` | POST | ❌ | Public | Get information of specific course |
| **Payment**| `/api/v1/payment/capturePayment` | POST | ✔️ | Student | Initiate Razorpay checkout order |
| **Payment**| `/api/v1/payment/verifyPayment` | POST | ✔️ | Student | Verify payment signature and enroll |
| **Reach**  | `/api/v1/reach/contact` | POST | ❌ | Public | Handle contact inquiry submissions |

---

## 🤝 Contributing & License
Distributed under the ISC License. Contributions are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request