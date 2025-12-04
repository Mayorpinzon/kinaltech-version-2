// src/types/contact.ts
// Type definitions for Firestore contactMessages collection

import type { Timestamp } from "firebase/firestore";

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  ts: number; // Original timestamp from the client
  createdAt: Timestamp; // Firestore serverTimestamp
  lang: string; // i18n language code: "es", "en", "ja"
}

export type ContactMessageInput = Omit<ContactMessage, "createdAt"> & {
  createdAt: ReturnType<typeof import("firebase/firestore").serverTimestamp>;
};

