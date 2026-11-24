import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
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
    const result = await signInWithPopup(firebaseAuth, googleProvider);
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
    if (error?.code === 'auth/popup-closed-by-user') {
      throw new Error('Google sign-in was cancelled.');
    }
    throw new Error(error?.message || 'Google sign-in failed. Please log in with your Registered ID and Password.');
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

