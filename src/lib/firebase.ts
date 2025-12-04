// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, type CollectionReference } from "firebase/firestore";
import { ENV } from "./env";
import type { ContactMessage } from "../types/contact";

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
};

// Prevent re-initialization if app already exists
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firestore instance for saving contact messages
export const db = getFirestore(app);

export const contactMessagesRef = collection(
  db,
  "contactMessages"
) as CollectionReference<ContactMessage>;
