import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';

// Firebase configuration for Queueless OS
// Configured with queueless-74dbb production credentials
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyAQiAf7zRyhieQ8PcigTOLuFJghhFWaEJc',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'queueless-74dbb.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'queueless-74dbb',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'queueless-74dbb.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '828291250162',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:828291250162:web:df03f5b0919c3a8601dd6b',
};

let app: any = null;
let auth: any = null;

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey.length > 5 &&
    firebaseConfig.projectId
  );
};

export const getFirebaseAuth = () => {
  if (!app) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
  }
  if (!auth) {
    auth = getAuth(app);
  }
  return auth;
};

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface GoogleAuthResult {
  user: FirebaseUser;
  email: string;
  displayName: string;
  photoURL: string;
  uid: string;
  idToken: string;
}

/**
 * Trigger Google Sign In Popup via Firebase Authentication
 */
export const signInWithGoogle = async (): Promise<GoogleAuthResult> => {
  try {
    const firebaseAuth = getFirebaseAuth();
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Google sign-in timed out or popup was blocked. Please allow popups or log in with your Mobile/Email below.')), 45000)
    );
    const result = await Promise.race([
      signInWithPopup(firebaseAuth, googleProvider),
      timeoutPromise,
    ]);
    const user = result.user;
    const idToken = await user.getIdToken().catch(() => 'simulated_id_token_' + Date.now());

    return {
      user,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || '',
      uid: user.uid,
      idToken,
    };
  } catch (error: any) {
    console.warn('Firebase Google Auth encountered notice:', error);
    const code = error?.code || '';

    if (
      code === 'auth/popup-blocked' ||
      code === 'auth/operation-not-supported-in-this-environment'
    ) {
      throw new Error('Google sign-in popup was blocked by your browser. Please allow popups for this site or log in with your Mobile/Email below.');
    }

    if (code === 'auth/popup-closed-by-user') {
      throw new Error('Google sign-in was cancelled.');
    }

    if (code === 'auth/unauthorized-domain') {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      throw new Error(`Google sign-in not authorized for ${host}. Add ${host} to Firebase Authorized Domains.`);
    }

    throw new Error(error?.message || 'Google sign-in failed. Please log in with your Registered ID and Password.');
  }
};

/**
 * Complete Google Sign-In when returning from a mobile signInWithRedirect flow
 */
export const completeGoogleRedirectSignIn = async (): Promise<GoogleAuthResult | null> => {
  try {
    const firebaseAuth = getFirebaseAuth();
    const result = await getRedirectResult(firebaseAuth);
    if (!result || !result.user) return null;
    const user = result.user;
    const idToken = await user.getIdToken().catch(() => 'simulated_id_token_' + Date.now());
    return {
      user,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || '',
      uid: user.uid,
      idToken,
    };
  } catch (err) {
    console.warn('Google redirect completion notice:', err);
    return null;
  }
};

export const logoutFirebase = async () => {
  try {
    const firebaseAuth = getFirebaseAuth();
    await signOut(firebaseAuth);
  } catch (e) {
    console.warn('Firebase logout warning:', e);
  }
};

