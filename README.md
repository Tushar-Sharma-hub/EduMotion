# StudyNotion

StudyNotion is a modern full-stack ed-tech platform built with the MERN stack that enables users to create, browse, enroll in, and review courses. It offers a smooth experience for both students and instructors, with features such as authentication, course management, payment processing, and rich media support.

## ✨ Features

- User authentication and authorization
- Student and instructor dashboards
- Course creation and management
- Course enrollment and progress tracking
- Ratings and reviews
- Contact form support
- Secure payments via Razorpay
- Media uploads through Cloudinary
- Responsive UI built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Nodemailer

### Integrations
- Cloudinary for media uploads
- Razorpay for payments
- Cookie-based session handling

## 📁 Project Structure

- client-side application in the root project folder
- server-side application in the Server folder
- reusable UI components in src/components
- API logic in src/services/operations
- backend controllers, models, routes, and middleware in Server

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v18 or above recommended)
- npm
- MongoDB

### Installation

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd EduMotion
   ```

2. Install frontend dependencies
   ```bash
   npm install
   ```

3. Install backend dependencies
   ```bash
   cd Server
   npm install
   ```

### Environment Variables

Create a .env file inside the Server folder and add the following variables:

```env
PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
MAIL_HOST=smtp.example.com
MAIL_USER=your_email
MAIL_PASS=your_email_password
```

### Run the Project

From the root folder:

```bash
npm run dev
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:4000

## 📌 Notes

The application is designed as a full-featured learning platform and can be extended with additional capabilities such as certificates, quizzes, live classes, and admin moderation tools.

## 🤝 Contributing

Contributions are welcome. Feel free to fork the repository and submit a pull request with improvements or bug fixes.