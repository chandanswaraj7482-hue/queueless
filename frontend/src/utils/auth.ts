// Role-based local session management for Queueless Clinic OS

export interface AuthSession {
  role: 'ADMIN' | 'RECEPTION' | 'DOCTOR';
  clinicId?: string;
  doctorId?: string;
  doctorName?: string;
  name?: string;
  authenticatedAt: number;
}

export const getAuthSession = (role: 'ADMIN' | 'RECEPTION' | 'DOCTOR'): AuthSession | null => {
  try {
    // For ADMIN role: strictly require session-based authentication (sessionStorage)
    // so closing or reopening a browser tab never leaves sensitive hospital revenue unlocked
    const raw = role === 'ADMIN'
      ? sessionStorage.getItem(`queueless_session_${role.toLowerCase()}`)
      : localStorage.getItem(`queueless_session_${role.toLowerCase()}`);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    // 24 hour session expiration
    if (Date.now() - session.authenticatedAt > 24 * 60 * 60 * 1000) {
      clearAuthSession(role);
      return null;
    }
    return session;
  } catch (e) {
    return null;
  }
};

export const setAuthSession = (role: 'ADMIN' | 'RECEPTION' | 'DOCTOR', data: Partial<AuthSession>) => {
  const session: AuthSession = {
    role,
    clinicId: data.clinicId,
    doctorId: data.doctorId,
    doctorName: data.doctorName,
    name: data.name,
    authenticatedAt: Date.now(),
  };
  if (role === 'ADMIN') {
    sessionStorage.setItem(`queueless_session_${role.toLowerCase()}`, JSON.stringify(session));
    localStorage.removeItem(`queueless_session_${role.toLowerCase()}`); // Clear any legacy persistent storage
  } else {
    localStorage.setItem(`queueless_session_${role.toLowerCase()}`, JSON.stringify(session));
  }
};

export const clearAuthSession = (role: 'ADMIN' | 'RECEPTION' | 'DOCTOR') => {
  sessionStorage.removeItem(`queueless_session_${role.toLowerCase()}`);
  localStorage.removeItem(`queueless_session_${role.toLowerCase()}`);
};

