"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    Star,
    Settings,
    CalendarCheck,
    RefreshCw,
    Bell,
    ChevronRight,
    LogOut,
    Shield,
    HelpCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const statsItems = [
    {
        label: "Shifts This Month",
        value: "—",
        icon: Calendar,
        color: "#3B82F6",
        bg: "#EFF6FF",
    },
    {
        label: "Hours Logged",
        value: "—",
        icon: Clock,
        color: "#10B981",
        bg: "#ECFDF5",
    },
    {
        label: "Rating",
        value: "—",
        icon: Star,
        color: "#F5A623",
        bg: "#FFF7ED",
    },
];

const menuItems = [
    {
        label: "Shift Preferences",
        description: "Set preferred shift times",
        icon: Settings,
        color: "#6366F1",
    },
    {
        label: "Availability",
        description: "Update your availability",
        icon: CalendarCheck,
        color: "#10B981",
    },
    {
        label: "Swap History",
        description: "View past shift swaps",
        icon: RefreshCw,
        color: "#F5A623",
    },
    {
        label: "Notification Settings",
        description: "Manage alert preferences",
        icon: Bell,
        color: "#3B82F6",
    },
    {
        label: "Privacy & Security",
        description: "Account security settings",
        icon: Shield,
        color: "#8B5CF6",
    },
    {
        label: "Help & Support",
        description: "FAQs and contact support",
        icon: HelpCircle,
        color: "#6B7280",
    },
];

export function ProfileScreen() {
    const { user, role, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="pb-4">
            {/* Header */}
            <div
                className="px-5 pt-6 pb-8 rounded-b-3xl relative overflow-hidden"
                style={{
                    background: "linear-gradient(160deg, #8B0D22 0%, #B5122E 50%, #D41535 100%)",
                }}
            >
                <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
                    style={{ background: "rgba(245,166,35,0.1)" }}
                />
                <div
                    className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                />

                <div className="flex flex-col items-center relative z-10">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(245,166,35,0.8), rgba(255,200,87,0.8))",
                            boxShadow: "0 8px 25px rgba(245,166,35,0.3)",
                        }}
                    >
                        {user.avatar}
                    </div>
                    <h1 className="text-xl font-bold text-white">{user.name}</h1>
                    <p className="text-sm text-white/70 mt-0.5">{user.role}</p>
                    <div className="flex gap-2 mt-2">
                        <span
                            className="text-[10px] font-semibold px-3 py-1 rounded-full"
                            style={{
                                background: "rgba(255,255,255,0.15)",
                                color: "rgba(255,255,255,0.9)",
                            }}
                        >
                            {user.department}
                        </span>
                        <span
                            className="text-[10px] font-semibold px-3 py-1 rounded-full"
                            style={{
                                background: role === "chef" ? "rgba(245,166,35,0.2)" : "rgba(59,130,246,0.2)",
                                color: role === "chef" ? "#FFC857" : "#93C5FD",
                            }}
                        >
                            {role === "chef" ? "👨‍🍳 Chef" : "👤 Staff"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="px-4 -mt-5 relative z-10">
                <div className="grid grid-cols-3 gap-3">
                    {statsItems.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl p-3 text-center"
                            style={{
                                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                            }}
                        >
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
                                style={{ background: stat.bg }}
                            >
                                <stat.icon size={16} style={{ color: stat.color }} />
                            </div>
                            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Contact Info */}
            <div className="px-4 mt-5">
                <div
                    className="bg-white rounded-2xl p-4"
                    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
                >
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Contact Information
                    </h3>
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Email</span>
                            <span className="text-xs font-medium text-gray-800">
                                {user.email}
                            </span>
                        </div>
                        <div className="h-px bg-gray-50" />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Phone</span>
                            <span className="text-xs font-medium text-gray-800">
                                {user.phone}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="px-4 mt-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pl-1">
                    Settings
                </h3>
                <div
                    className="bg-white rounded-2xl overflow-hidden"
                    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
                >
                    {menuItems.map((item, i) => (
                        <motion.button
                            key={item.label}
                            whileTap={{ scale: 0.98, backgroundColor: "rgba(0,0,0,0.02)" }}
                            className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                            style={{
                                borderBottom:
                                    i < menuItems.length - 1
                                        ? "1px solid rgba(229,231,235,0.5)"
                                        : "none",
                            }}
                        >
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: `${item.color}12` }}
                            >
                                <item.icon size={16} style={{ color: item.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800">
                                    {item.label}
                                </p>
                                <p className="text-[10px] text-gray-400">{item.description}</p>
                            </div>
                            <ChevronRight size={16} className="text-gray-300" />
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Logout */}
            <div className="px-4 mt-5">
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-100 text-sm font-semibold text-red-500"
                    style={{ background: "rgba(239,68,68,0.04)" }}
                >
                    <LogOut size={16} />
                    Sign Out
                </motion.button>
            </div>
        </div>
    );
}
