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

## Algorithms Implemented

### Naive Search Algorithm
**Location:** `backend/src/controllers/message.controller.js`

This algorithm is used for message search functionality. It performs a straightforward keyword match by checking if a search query exists within message content. When a user searches for messages, the backend retrieves all user messages and uses this algorithm to return matching results.

```javascript
const naiveSearch = (text, pattern) =>
    text.toLowerCase().includes(pattern.toLowerCase());
```

**Endpoint:** `GET /api/messages/search?q=<query>`
- Searches through user's message history
- Case-insensitive text matching
- Returns matching messages sorted by newest first

---

### Merge Sort Algorithm
**Location:** `frontend/src/lib/utils.js`

This algorithm is used to sort contacts and messages efficiently. It recursively splits the array, sorts sublists, and merges them into a final sorted list based on the specified field (default: `createdAt` timestamp).

```javascript
export function mergeSort(arr, key = "createdAt") {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid), key);
    const right = mergeSort(arr.slice(mid), key);
    return merge(left, right, key);
}
```

**Usage:**
```javascript
import { mergeSort } from "../lib/utils";
const sortedMessages = mergeSort(messages, "createdAt");
```

**Time Complexity:** O(n log n) - efficient for sorting large message histories

---

### Firebase Google OAuth Algorithm
**Location:** `frontend/src/lib/firebase.js`

This algorithm handles Google OAuth authentication using Firebase Authentication services. It implements the OAuth 2.0 flow with Google's popup-based sign-in mechanism, providing secure and seamless user authentication.

```javascript
export const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
}
```

**Flow:**
1. User clicks "Sign in with Google" button
2. Firebase opens a secure popup window for Google sign-in
3. User authenticates with their Google credentials
4. Firebase returns an OAuth credential with user info
5. Backend validates and creates/updates user session

**Security Features:**
- OAuth 2.0 protocol with popup-based authentication
- Token validation through Firebase SDK
- Secure credential handling (never stored directly)
- JWT-based session management on backend

## License

MIT
