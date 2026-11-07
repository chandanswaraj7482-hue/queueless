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
    const raw = localStorage.getItem(`queueless_session_${role.toLowerCase()}`);
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
  localStorage.setItem(`queueless_session_${role.toLowerCase()}`, JSON.stringify(session));
};

export const clearAuthSession = (role: 'ADMIN' | 'RECEPTION' | 'DOCTOR') => {
  localStorage.removeItem(`queueless_session_${role.toLowerCase()}`);
};

