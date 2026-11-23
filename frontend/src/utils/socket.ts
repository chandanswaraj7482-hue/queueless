import { io } from 'socket.io-client';
import { SOCKET_BASE_URL } from '../config/api';

// Cross-tab zero-latency local clinical sync bus
export const clinicalSyncChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('queueless_clinical_sync')
    : null;

export const broadcastLocalSync = (type: string, data?: any) => {
  try {
    clinicalSyncChannel?.postMessage({ type, data, timestamp: Date.now() });
  } catch (e) {}
};

export const socket = io(SOCKET_BASE_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 2000,
  timeout: 8000,
});
