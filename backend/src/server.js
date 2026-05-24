require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const socketConfig = require('./sockets/socket');

// Routes
const authRoutes = require('./routes/authRoutes');
const truckRoutes = require('./routes/truckRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

let server;

if (process.env.NODE_ENV === 'production') {
  // In production (like Render), SSL termination is handled by the platform.
  // We just need to bind to a plain HTTP server.
  server = http.createServer(app);
} else {
  // Local development uses self-signed certificates
  try {
    const options = {
      key: fs.readFileSync(path.join(__dirname, 'config', 'certs', 'server.key')),
      cert: fs.readFileSync(path.join(__dirname, 'config', 'certs', 'server.cert'))
    };
    server = https.createServer(options, app);
  } catch (err) {
    console.warn("⚠️ SSL Certs not found, falling back to HTTP for development.");
    server = http.createServer(app);
  }
}

// Initialize DB and Socket.IO
connectDB();
socketConfig.init(server);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('FlowFleet API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
