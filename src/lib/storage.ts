"use client";

import { collection, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

// ── localStorage helpers for persistent data ──────────────────

const STORAGE_KEYS = {
    CURRENT_SESSION: "manas_resto_session",
    SHIFTS: "manas_resto_shifts",
    NOTIFICATIONS: "manas_resto_notifications",
} as const;

// Read users from Firestore
export async function getStoredUsersAsync(): Promise<StoredUser[]> {
    if (typeof window === "undefined") return [];
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        return querySnapshot.docs.map(doc => doc.data() as StoredUser);
    } catch (e) {
        console.error("Error reading users:", e);
        return [];
    }
}

// Write a single user to Firestore
export async function saveUserAsync(user: StoredUser) {
    if (typeof window === "undefined") return;
    try {
        await setDoc(doc(db, "users", user.id), user);
    } catch (e) {
        console.error("Error saving user:", e);
    }
}

// Listen for users in real-time
export function subscribeToUsers(callback: (users: StoredUser[]) => void) {
    if (typeof window === "undefined") return () => { };
    return onSnapshot(collection(db, "users"), (snapshot) => {
        const users = snapshot.docs.map(doc => doc.data() as StoredUser);
        callback(users);
    });
}

// Keep session in localStorage since it's device-specific
export function getStoredSession(): StoredSession | null {
    if (typeof window === "undefined") return null;
    try {
        const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

export function saveStoredSession(session: StoredSession | null) {
    if (typeof window === "undefined") return;
    if (session) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
    } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
}

export function getStoredNotifications(): StoredNotification[] {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function saveStoredNotifications(notifications: StoredNotification[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
}

export function getStoredShifts(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.SHIFTS);
}

export function saveStoredShifts(shifts: unknown[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
}

// ── Types ─────────────────────────────────────────────────────

export interface StoredUser {
    id: string;
    name: string;
    pin: string; // hashed or plain for demo
    role: "chef" | "staff";
    staffRole: string;
    department: string;
    avatar: string;
    email: string;
    phone: string;
}

export interface StoredSession {
    userId: string;
    role: "chef" | "staff";
}

export interface StoredNotification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    type: "shift_assigned" | "shift_removed" | "roster_published" | "shift_swap" | "schedule_change" | "reminder";
    icon: string;
    targetUserId?: string; // which user this notification is for
}

// ── Attendance ───────────────────────────────────────────────

export async function getStoredAttendanceAsync(): Promise<import("./types").AttendanceRecord[]> {
    if (typeof window === "undefined") return [];
    try {
        const querySnapshot = await getDocs(collection(db, "attendance"));
        return querySnapshot.docs.map(doc => doc.data() as import("./types").AttendanceRecord);
    } catch (e) {
        console.error("Error reading attendance:", e);
        return [];
    }
}

export async function saveAttendanceRecordAsync(record: import("./types").AttendanceRecord) {
    if (typeof window === "undefined") return;
    try {
        await setDoc(doc(db, "attendance", record.id), record);
    } catch (e) {
        console.error("Error saving attendance:", e);
    }
}

export function subscribeToAttendance(callback: (records: import("./types").AttendanceRecord[]) => void) {
    if (typeof window === "undefined") return () => { };
    return onSnapshot(collection(db, "attendance"), (snapshot) => {
        const records = snapshot.docs.map(doc => doc.data() as import("./types").AttendanceRecord);
        callback(records);
    });
}

// ── Photo Compression (keeps photos small for Firestore) ─────

export function compressPhoto(photoBase64: string, maxWidth = 320, quality = 0.3): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ratio = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * ratio;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => resolve(photoBase64); // fallback
        img.src = photoBase64;
    });
}

