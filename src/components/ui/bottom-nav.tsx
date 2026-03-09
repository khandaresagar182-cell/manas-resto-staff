"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, CalendarDays, Bell, User, Camera } from "lucide-react";

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    unreadCount: number;
}

const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "schedule", label: "Schedule", icon: CalendarDays },
    { id: "attendance", label: "Check-In", icon: Camera },
    { id: "notifications", label: "Alerts", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
];

export function BottomNav({ activeTab, onTabChange, unreadCount }: BottomNavProps) {
    return (
        <nav
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
            style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(229,231,235,0.6)",
            }}
        >
            <div className="flex items-center justify-around px-2 py-1">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className="relative flex flex-col items-center justify-center gap-0.5 py-2 px-4 rounded-2xl transition-all duration-300"
                            style={{
                                background: isActive ? "rgba(181,18,46,0.08)" : "transparent",
                            }}
                        >
                            <div className="relative">
                                <Icon
                                    size={22}
                                    strokeWidth={isActive ? 2.5 : 1.8}
                                    className="transition-all duration-300"
                                    style={{
                                        color: isActive ? "#B5122E" : "#9CA3AF",
                                    }}
                                />
                                {tab.id === "notifications" && unreadCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1.5 -right-2 flex items-center justify-center rounded-full text-white font-bold"
                                        style={{
                                            background: "#EF4444",
                                            fontSize: "9px",
                                            minWidth: "16px",
                                            height: "16px",
                                            padding: "0 4px",
                                        }}
                                    >
                                        {unreadCount}
                                    </motion.span>
                                )}
                            </div>
                            <span
                                className="text-[10px] font-semibold transition-all duration-300"
                                style={{
                                    color: isActive ? "#B5122E" : "#9CA3AF",
                                }}
                            >
                                {tab.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute -bottom-1 w-5 h-0.5 rounded-full"
                                    style={{ background: "#B5122E" }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Safe area spacer for notched phones */}
            <div className="h-[env(safe-area-inset-bottom,0px)]" />
        </nav>
    );
}
