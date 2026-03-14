# Chat Application

A full-stack real-time chat application built with the MERN stack.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + DaisyUI
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Real-time:** Socket.io
- **Authentication:** JWT + Google OAuth (Firebase)
- **Image Upload:** Cloudinary

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Firebase project (for Google Auth)
- Cloudinary account

### Installation

**Backend:**
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with:
```
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run backend:
```bash
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
```

Run frontend:
```bash
npm run dev
```

## Features

- User authentication (signup/login with email & password)
- Google OAuth authentication
- Real-time messaging with Socket.io
- Online/offline user status
- Image sharing in messages
- User profile with profile picture
- Settings with theme selection

## License

MIT
