# Chat App

A modern real-time chat application built with **Bun**, **Elysia**, **React**, **Vite**, and **Drizzle ORM** using **NeonDB** for database storage. This app supports authentication, user management, and real-time chat using WebSockets.

---

## 🛠️ Tech Stack

- **Backend:** Bun, Elysia, Drizzle ORM, NeonDB
- **Frontend:** React, Vite
- **Authentication & Security:** JWT (using jose), bcryptjs
- **Real-time Communication:** WebSocket
- **UI Feedback:** react-hot-toast
- **Environment:** Node.js runtime via Bun

---

## ⚡ Features

- User registration, login, logout, and token refresh
- Fetch individual user data or all users
- Real-time chat with multiple users
- WebSocket-based messaging system
- Typing indicators and instant message updates
- Secure password hashing with bcrypt
- JWT-based access and refresh tokens

---

## 🌐 Endpoints

### Auth

- `POST /api/auth/register` – Register a new user  
- `POST /api/auth/login` – Login with credentials  
- `POST /api/auth/refresh` – Refresh access token  
- `POST /api/auth/logout` – Logout user

### Users

- `GET /api/user/get/:id` – Get user by ID  
- `GET /api/user/get/all` – Get all users

### WebSocket

- `ws://localhost:64000/ws` – Real-time messaging endpoint

---

## 🏗️ Server Configuration

Environment variables in `.env`:

```env
PORT=64000
DATABASE_URL='pos'
NODE_ENV='production'

REFRESH_TOKEN=you_are_aware_just_simple_as_that
ACCESS_TOKEN=scratching_wounds_will_only_hurt
JWT_SECRET=you_are_not_allowed_have_revenge

CLIENT_URL=http://localhost:5173
```

---

## 🚀 Running the Project

### Backend

```bash
# Install dependencies
bun install

# Run the server in dev mode
bun run dev
```

The backend will run on `http://localhost:64000`.

### Frontend

```bash
# Go to client directory
cd client

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The frontend will run on `http://localhost:5173`.

---

## 🔑 Authentication Flow

1. User registers via `/api/auth/register`.
2. User logs in via `/api/auth/login` → receives `access_token` and `refresh_token`.
3. `access_token` is sent with API requests via cookies.
4. Refresh tokens are managed via `/api/auth/refresh`.

---

## 💬 Real-Time Chat

* Connect to the WebSocket endpoint `/ws`.
* Send JSON messages in the following format:

**Join a user room:**

```json
{
  "type": "join",
  "userId": 1
}
```

**Send a chat message:**

```json
{
  "type": "chat",
  "sender_id": 1,
  "receiver_id": 2,
  "content": "Hello!"
}
```

**Typing indicator:**

```json
{
  "type": "typing",
  "userId": 1,
  "receiverId": 2,
  "isTyping": true
}
```

---

## 🔒 Security

* Passwords hashed with `bcryptjs`
* JWT authentication for secure API access
* Refresh and access tokens stored as HTTP-only cookies

---

## 🌟 Notes

* Ensure the `CLIENT_URL` in `.env` matches your frontend URL for CORS.
* WebSocket server and HTTP server are both running on the same port (`64000`).
* Use `react-hot-toast` for toast notifications in the frontend.

---

Developed with ❤️ using Bun and Elysia for a modern backend experience, and React + Vite for a fast frontend.

By **Shivendra Bhaginath Devadhe**

---