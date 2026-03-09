"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "./bottom-nav";
import { ChiefDashboard } from "./chief-dashboard";
import { StaffDashboard } from "./staff-dashboard";
import { NotificationCenter } from "./notification-center";
import { ProfileScreen } from "./profile-screen";
import { AttendanceCheckin } from "./attendance-checkin";
import { AttendanceViewer } from "./attendance-viewer";
import { useAuth } from "@/lib/auth-context";
import { useNotifications } from "@/lib/notification-context";

const pageVariants = {
    initial: (direction: number) => ({
        x: direction > 0 ? "30%" : "-30%",
        opacity: 0,
    }),
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 30,
            mass: 0.8,
        },
    },
    exit: (direction: number) => ({
        x: direction > 0 ? "-30%" : "30%",
        opacity: 0,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 30,
            mass: 0.8,
        },
    }),
};

const tabOrder = ["home", "schedule", "attendance", "notifications", "profile"];

export function DutyRosterApp() {
    const { role } = useAuth();
    const [activeTab, setActiveTab] = useState("home");
    const [direction, setDirection] = useState(0);

    const { unreadCount } = useNotifications();

    const handleTabChange = (newTab: string) => {
        const oldIndex = tabOrder.indexOf(activeTab);
        const newIndex = tabOrder.indexOf(newTab);
        setDirection(newIndex > oldIndex ? 1 : -1);
        setActiveTab(newTab);
    };

    const renderScreen = () => {
        switch (activeTab) {
            case "home":
                return role === "chef" ? <ChiefDashboard /> : <StaffDashboard />;
            case "schedule":
                return <StaffDashboard />;
            case "attendance":
                return role === "chef" ? <AttendanceViewer /> : <AttendanceCheckin />;
            case "notifications":
                return <NotificationCenter />;
            case "profile":
                return <ProfileScreen />;
            default:
                return role === "chef" ? <ChiefDashboard /> : <StaffDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="w-full max-w-[430px] relative min-h-screen bg-gray-50">
                <div className="pb-24">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={activeTab}
                            custom={direction}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            {renderScreen()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <BottomNav
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    unreadCount={unreadCount}
                />
            </div>
        </div>
    );
}
