// socket.js
import { io } from 'socket.io-client';

// Create a single socket connection instance
const socket = io('https://192.168.100.100:5000', {
  withCredentials: true,
});

export default socket;
