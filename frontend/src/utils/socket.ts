import { io } from 'socket.io-client';
import { SOCKET_BASE_URL } from '../config/api';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const socket = io(SOCKET_BASE_URL, {
  autoConnect: isLocal, // Connect automatically on local backend with WebSockets
  transports: ['websocket'], // Avoid HTTP polling fallback that triggers cross-origin CORS errors on serverless hosts
  reconnection: isLocal,
  reconnectionAttempts: 3,
  timeout: 3000,
});


