// Centralized API Base URL configuration for local and cloud production deployment
export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001';
export const SOCKET_BASE_URL: string =
  (import.meta as any).env?.VITE_SOCKET_URL || API_BASE_URL;
