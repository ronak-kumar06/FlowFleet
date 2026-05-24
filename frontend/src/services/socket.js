import { io } from 'socket.io-client';

const URL = 'https://localhost:5000'; // Connect to backend server

export const socket = io(URL, {
  autoConnect: false, // We'll connect manually when user logs in
  secure: true,
  rejectUnauthorized: false // Required for self-signed certificates in dev
});
