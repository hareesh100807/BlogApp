# BlogApp — Full-Stack Blog Application

A full-stack blog platform built with **React** (Vite) on the frontend and **Express.js + MongoDB** on the backend. Features user authentication (JWT), role-based access (user, author, admin), article management, and Cloudinary image uploads.

## 📁 Structure

```
BLOGAPP/
├── backend/
│   ├── server.js              # Express entry point, CORS, DB connection
│   ├── APIs/
│   │   ├── userAPI.js         # User-related routes
│   │   ├── authorAPI.js       # Author & article CRUD routes
│   │   ├── adminAPI.js        # Admin management routes
│   │   └── commonAPI.js       # Authentication (login/register)
│   ├── models/
│   │   ├── userModel.js       # Mongoose User schema
│   │   └── articleModel.js    # Mongoose Article schema
│   ├── middlewares/
│   │   └── verifyToken.js     # JWT verification middleware
│   ├── config/
│   │   ├── cloudinary.js      # Cloudinary SDK config
│   │   ├── cloudinaryUpload.js # Upload helper
│   │   └── multer.js          # Multer file upload config
│   ├── .env                   # Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx            # Root component with routing
    │   ├── main.jsx           # Entry point & providers
    │   ├── components/        # UI components
    │   ├── store/             # State management
    │   └── styles/            # CSS modules
    ├── vite.config.js         # Vite configuration
    └── package.json
```

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | Express.js, Node.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens) |
| File Upload | Multer + Cloudinary |
| Styling | CSS / Tailwind |

## ▶️ How to Run

```bash
# Backend
cd BLOGAPP/backend
npm install
npm start          # Starts Express on port 5000

# Frontend
cd BLOGAPP/frontend
npm install
npm run dev        # Starts Vite dev server
```

## 🔗 API Endpoints

| Prefix | Router | Description |
|---|---|---|
| `/user-api` | userAPI.js | User profile operations |
| `/author-api` | authorAPI.js | Author & article CRUD |
| `/admin-api` | adminAPI.js | Admin management |
| `/auth` | commonAPI.js | Login / Register |