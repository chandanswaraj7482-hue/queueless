// Centralized API Base URL configuration for local and cloud production deployment
// Uses high-speed Neon-connected Vercel API with persistent Render WebSocket connectivity
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_URL || (isLocal ? 'http://localhost:5001' : 'https://queueless-api-rho.vercel.app');

export const SOCKET_BASE_URL: string =
  (import.meta as any).env?.VITE_SOCKET_URL ||
  (typeof window !== 'undefined' && localStorage.getItem('queueless_custom_socket_url')) ||
  (isLocal ? 'http://localhost:5001' : 'https://queueless-backend.onrender.com');
