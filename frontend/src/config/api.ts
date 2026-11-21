// Centralized API Base URL configuration for local and cloud production deployment
// Uses live working Vercel backend with automatic Render override if VITE_API_URL is provided
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_URL || (isLocal ? 'http://localhost:5001' : 'https://queueless-api-rho.vercel.app');

export const SOCKET_BASE_URL: string =
  (import.meta as any).env?.VITE_SOCKET_URL || (isLocal ? 'http://localhost:5001' : 'https://queueless-96kv.onrender.com');
