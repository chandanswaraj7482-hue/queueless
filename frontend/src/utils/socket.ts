import { io } from 'socket.io-client';
import { SOCKET_BASE_URL } from '../config/api';

export const socket = io(SOCKET_BASE_URL, {
  autoConnect: true,
  reconnection: true,
});

