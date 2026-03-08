"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
    getStoredNotifications,
    saveStoredNotifications,
    type StoredNotification,
} from "./storage";
import type { Notification } from "./types";

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notif: Omit<StoredNotification, "id" | "timestamp" | "read">) => void;
    markRead: (id: string) => void;
    markAllRead: () => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ── Browser Push Notification ──────────────────────────────────

async function requestNotificationPermission(): Promise<boolean> {
    if (typeof window === "undefined" || !("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    const result = await Notification.requestPermission();
    return result === "granted";
}

function sendBrowserNotification(title: string, body: string, icon?: string) {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    try {
        const notif = new Notification(title, {
            body,
            icon: icon || "/logo.png",
            badge: "/logo.png",
            tag: `manas-resto-${Date.now()}`,
            requireInteraction: false,
        });

        // Auto-close after 5 seconds
        setTimeout(() => notif.close(), 5000);
    } catch {
        // Fallback for environments where Notification constructor fails
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then((reg) => {
                reg.showNotification(title, {
                    body,
                    icon: "/logo.png",
                    badge: "/logo.png",
                    tag: `manas-resto-${Date.now()}`,
                });
            });
        }
    }
}

// ── Provider ───────────────────────────────────────────────────

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load notifications from localStorage
    useEffect(() => {
        const stored = getStoredNotifications();
        setNotifications(
            stored.map((s) => ({
                id: s.id,
                title: s.title,
                message: s.message,
                timestamp: s.timestamp,
                read: s.read,
                type: s.type as Notification["type"],
                icon: s.icon,
            }))
        );

        // Request notification permission on mount
        requestNotificationPermission();
    }, []);

    // Persist whenever notifications change
    useEffect(() => {
        if (notifications.length > 0) {
            saveStoredNotifications(
                notifications.map((n) => ({
                    id: n.id,
                    title: n.title,
                    message: n.message,
                    timestamp: n.timestamp,
                    read: n.read,
                    type: n.type,
                    icon: n.icon,
                }))
            );
        }
    }, [notifications]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const addNotification = useCallback(
        (notif: Omit<StoredNotification, "id" | "timestamp" | "read">) => {
            const newNotif: Notification = {
                id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                title: notif.title,
                message: notif.message,
                timestamp: new Date().toISOString(),
                read: false,
                type: notif.type as Notification["type"],
                icon: notif.icon,
            };

            setNotifications((prev) => [newNotif, ...prev]);

            // Send browser push notification
            sendBrowserNotification(notif.title, notif.message);
        },
        []
    );

    const markRead = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
        saveStoredNotifications([]);
    }, []);

    return (
        <NotificationContext.Provider
            value={{ notifications, unreadCount, addNotification, markRead, markAllRead, clearAll }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
