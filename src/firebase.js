// Firebase setup. Values come from environment variables (see .env.example).
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const env = import.meta.env;
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

// Names of any settings that are empty, so the setup screen can list them.
export const missingKeys = Object.keys(config)
  .filter((k) => !config[k] || String(config[k]).startsWith('your-'))
  .map((k) => 'VITE_FIREBASE_' + k.replace(/([A-Z])/g, '_$1').toUpperCase());

export const isConfigured = missingKeys.length === 0;

const app = isConfigured ? initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
