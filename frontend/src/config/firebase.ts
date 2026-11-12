import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';

// Firebase configuration for Queueless OS
// Defaults to the queueless-74dbb project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'queueless-74dbb.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'queueless-74dbb',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'queueless-74dbb.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
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
    const idToken = await user.getIdToken();

    return {
      user,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || '',
      uid: user.uid,
      idToken,
    };
  } catch (error: any) {
    console.error('Firebase Google Auth error:', error);
    // Provide developer and user-friendly error messages
    if (error?.code === 'auth/popup-closed-by-user') {
      throw new Error('Google sign-in was cancelled.');
    }
    if (error?.code === 'auth/configuration-not-found' || error?.code === 'auth/operation-not-allowed') {
      throw new Error(
        'Google Sign-in is not yet enabled in Firebase Console. Please go to Firebase Console > Authentication > Sign-in method > Enable Google.'
      );
    }
    if (error?.code === 'auth/invalid-api-key') {
      throw new Error(
        'Firebase API key is invalid or missing. Please add VITE_FIREBASE_API_KEY in your environment.'
      );
    }
    throw new Error(error?.message || 'Google sign-in failed. Please try again.');
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

