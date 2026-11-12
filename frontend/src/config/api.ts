// Centralized API Base URL configuration for local and cloud production deployment
// Uses live working Vercel backend with automatic Render override if VITE_API_URL is provided
export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_URL || 'https://queueless-api-rho.vercel.app';
export const SOCKET_BASE_URL: string =
  (import.meta as any).env?.VITE_SOCKET_URL || 'https://queueless-96kv.onrender.com';
