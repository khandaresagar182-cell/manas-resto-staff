"use client";

// ── localStorage helpers for persistent data ──────────────────

const STORAGE_KEYS = {
    REGISTERED_USERS: "manas_resto_users",
    CURRENT_SESSION: "manas_resto_session",
    SHIFTS: "manas_resto_shifts",
    STAFF_MEMBERS: "manas_resto_staff",
    NOTIFICATIONS: "manas_resto_notifications",
    ATTENDANCE: "manas_resto_attendance",
} as const;

export function getStoredUsers(): StoredUser[] {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function saveStoredUsers(users: StoredUser[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
}

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

export function getStoredAttendance(): import("./types").AttendanceRecord[] {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function saveStoredAttendance(records: import("./types").AttendanceRecord[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
}
