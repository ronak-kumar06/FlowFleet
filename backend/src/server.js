require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const socketConfig = require('./sockets/socket');

// Routes
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);

// Initialize DB and Socket.IO
connectDB();
socketConfig.init(server);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('FlowFleet API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
