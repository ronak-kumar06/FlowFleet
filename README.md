# FlowFleet 🚚✨

> **Enterprise Logistics Intelligence Platform**

FlowFleet is a modern, end-to-end SaaS operations platform designed for manufacturing and logistics companies. It provides real-time fleet tracking, intelligent shipment allocation, and role-based access control to streamline the delivery lifecycle.

---

## 🌟 Key Features

- **Role-Based Access Control (RBAC)**: Secure access tailored for Admins, Dispatchers, Drivers, and Clients.
- **Delivery Request Workflow**: Clients can seamlessly create shipment requests for Dispatcher approval.
- **Smart Allocation Engine**: Dispatchers receive intelligent truck recommendations based on weight capacity and current availability.
- **Live Interactive Map**: Real-time GPS tracking of active fleet vehicles using Leaflet.js.
- **Real-Time Synchronization**: WebSockets (Socket.IO) integration to instantly push status updates, location changes, and dispatch alerts without page reloads.
- **Analytics Dashboard**: Comprehensive data visualizations using Recharts to track fleet utilization and delayed shipments.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS v3** (Premium dark-mode UI design)
- **Zustand** (Persistent state management)
- **Axios** (API Client with automatic JWT injection)
- **Recharts & React-Leaflet** (Data visualization & Mapping)
- **Lucide React** (Iconography)

### Backend
- **Node.js & Express.js**
- **MongoDB** (Mongoose ODM)
- **Socket.IO** (Real-time bi-directional communication)
- **JSON Web Tokens (JWT)** (Secure authentication)
- **HTTPS** (Self-signed certificates for secure dev environments)

---

## 📂 Project Structure

```text
FlowFleet/
├── backend/                  # Express API Server
│   ├── src/
│   │   ├── config/           # DB connection & HTTPS certificates
│   │   ├── controllers/      # Route business logic
│   │   ├── middleware/       # JWT Auth & Error handling
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routers
│   │   ├── sockets/          # Socket.IO configuration
│   │   └── server.js         # Entry point
│   └── package.json
└── frontend/                 # React Application
    ├── src/
    │   ├── components/       # Reusable UI components & Map
    │   ├── layouts/          # Dashboard framing & Sidebar
    │   ├── pages/            # View components (Login, Dashboard, Trucks, etc.)
    │   ├── services/         # Axios API & Socket client instances
    │   ├── store/            # Zustand stores
    │   ├── utils/            # Tailwind class merging utility
    │   ├── App.jsx           # Application Router
    │   └── main.jsx          # React Root
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas Cluster)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the server (runs on `https://localhost:5000`):
   ```bash
   npm run dev
   ```
   *Note: Since the backend uses self-signed HTTPS certificates, you may need to bypass the browser security warning when accessing the API.*

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Demo Credentials

To test the application across different user roles, you can seed your database or use the following standard credentials (ensure these are set up in your local DB):

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@flowfleet.com` | `password123` | Full system access, add trucks, manage users |
| **Dispatcher** | `dispatcher@flowfleet.com` | `password123` | Approve requests, assign trucks, view full analytics |
| **Driver** | `driver@flowfleet.com` | `password123` | View assigned shipments, update status (transit/delivered) |
| **Client** | `client@flowfleet.com` | `password123` | Create delivery requests, track own shipments |

---

## 🛡️ License
This project is proprietary and confidential. Unauthorized copying of this file, via any medium, is strictly prohibited.
