# Chat Application

A full-stack real-time chat application built with the MERN stack.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Real-time:** Socket.io
- **Authentication:** JWT
- **Image Upload:** Cloudinary

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account

### Installation

**Backend:**
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with:
```
PORT=5000
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

- User authentication (signup/login)
- Real-time messaging
- Image sharing
- User profile
- Settings

## License

MIT
