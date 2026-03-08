"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    Calendar,
    RefreshCw,
    Clock,
    AlertCircle,
    CheckCircle,
    Check,
    Trash2,
} from "lucide-react";
import { useNotifications } from "@/lib/notification-context";
import type { Notification } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
    calendar: <Calendar size={18} className="text-blue-500" />,
    repeat: <RefreshCw size={18} className="text-amber-500" />,
    clock: <Clock size={18} className="text-indigo-500" />,
    bell: <Bell size={18} className="text-gray-500" />,
    "check-circle": <CheckCircle size={18} className="text-green-500" />,
    "alert-circle": <AlertCircle size={18} className="text-red-500" />,
};

function timeAgo(timestamp: string): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
}

function groupByDate(
    notifs: Notification[]
): { label: string; items: Notification[] }[] {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const groups: { label: string; items: Notification[] }[] = [
        { label: "Today", items: [] },
        { label: "Yesterday", items: [] },
        { label: "Earlier", items: [] },
    ];

    notifs.forEach((n) => {
        const nDate = new Date(n.timestamp).toISOString().split("T")[0];
        if (nDate === todayStr) groups[0].items.push(n);
        else if (nDate === yesterdayStr) groups[1].items.push(n);
        else groups[2].items.push(n);
    });

    return groups.filter((g) => g.items.length > 0);
}

export function NotificationCenter() {
    const { notifications, markRead, markAllRead, clearAll, unreadCount } = useNotifications();

    const grouped = groupByDate(notifications);

    const getNotifColor = (type: Notification["type"]) => {
        switch (type) {
            case "roster_published": return "#3B82F6";
            case "shift_swap": return "#F5A623";
            case "schedule_change": return "#6366F1";
            case "reminder": return "#6B7280";
            case "shift_assigned": return "#10B981";
            case "shift_removed": return "#EF4444";
            default: return "#6B7280";
        }
    };

    return (
        <div className="pb-4">
            {/* Header */}
            <div
                className="px-5 pt-4 pb-5 rounded-b-3xl"
                style={{
                    background: "linear-gradient(160deg, #8B0D22 0%, #B5122E 50%, #D41535 100%)",
                }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Notifications</h1>
                        <p className="text-sm text-white/70 mt-0.5">
                            {unreadCount > 0
                                ? `${unreadCount} unread alert${unreadCount > 1 ? "s" : ""}`
                                : "All caught up!"}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={markAllRead}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                                style={{
                                    background: "rgba(255,255,255,0.15)",
                                    color: "white",
                                    minHeight: "36px",
                                }}
                            >
                                <Check size={14} />
                                Read All
                            </motion.button>
                        )}
                        {notifications.length > 0 && (
                            <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={clearAll}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                                style={{
                                    background: "rgba(239,68,68,0.2)",
                                    color: "#FCA5A5",
                                    minHeight: "36px",
                                }}
                            >
                                <Trash2 size={14} />
                                Clear
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            {/* Notification Groups */}
            <div className="px-4 mt-4 space-y-5">
                {grouped.map((group) => (
                    <div key={group.label}>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pl-1">
                            {group.label}
                        </h3>
                        <div className="space-y-2.5">
                            <AnimatePresence>
                                {group.items.map((notif, index) => (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: 30 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => markRead(notif.id)}
                                        className={`bg-white rounded-2xl p-4 cursor-pointer transition-all`}
                                        style={{
                                            boxShadow: !notif.read
                                                ? "0 4px 16px rgba(27,42,74,0.1)"
                                                : "0 2px 8px rgba(0,0,0,0.04)",
                                            borderLeft: !notif.read
                                                ? `4px solid ${getNotifColor(notif.type)}`
                                                : "4px solid transparent",
                                        }}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icon */}
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                style={{
                                                    background: `${getNotifColor(notif.type)}18`,
                                                }}
                                            >
                                                {iconMap[notif.icon] || (
                                                    <Bell size={18} className="text-gray-400" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4
                                                        className="text-sm text-gray-900 truncate"
                                                        style={{
                                                            fontWeight: notif.read ? 500 : 700,
                                                        }}
                                                    >
                                                        {notif.title}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">
                                                        {timeAgo(notif.timestamp)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                                                    {notif.message}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="text-center py-16">
                        <Bell size={40} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-gray-400">No notifications yet</p>
                        <p className="text-xs text-gray-300 mt-1">They'll appear here when shifts are assigned</p>
                    </div>
                )}
            </div>
        </div>
    );
}
