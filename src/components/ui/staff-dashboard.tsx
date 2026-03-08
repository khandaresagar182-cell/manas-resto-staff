"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
    Clock,
    MapPin,
    Calendar,
    Coffee,
    Sun,
    Moon,
    Sunrise,
} from "lucide-react";
import { departmentBgColors } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { useDuty } from "@/lib/duty-context";

export function StaffDashboard() {
    const { user } = useAuth();
    const { shifts } = useDuty();

    const myShifts = useMemo(() => {
        if (!user) return [];
        return shifts
            .filter((s) => s.staffId === user.id)
            .sort((a, b) => {
                const dateCompare = a.date.localeCompare(b.date);
                if (dateCompare !== 0) return dateCompare;
                return a.startTime.localeCompare(b.startTime);
            });
    }, [shifts, user]);

    const today = new Date().toISOString().split("T")[0];
    const upcomingShifts = myShifts.filter((s) => s.date >= today).slice(0, 7);

    // Stats
    const thisWeekShifts = myShifts.filter((s) => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return (
            s.date >= startOfWeek.toISOString().split("T")[0] &&
            s.date <= endOfWeek.toISOString().split("T")[0]
        );
    });

    const totalHoursWeek = thisWeekShifts.reduce((acc, s) => {
        const [sh, sm] = s.startTime.split(":").map(Number);
        const [eh, em] = s.endTime.split(":").map(Number);
        let hours = eh - sh + (em - sm) / 60;
        if (hours < 0) hours += 24;
        return acc + hours;
    }, 0);

    const getTimeIcon = (time: string) => {
        const hour = parseInt(time.split(":")[0]);
        if (hour >= 6 && hour < 12)
            return <Sunrise size={14} className="text-amber-500" />;
        if (hour >= 12 && hour < 18)
            return <Sun size={14} className="text-orange-500" />;
        if (hour >= 18 && hour < 22)
            return <Moon size={14} className="text-indigo-500" />;
        return <Moon size={14} className="text-gray-500" />;
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr + "T00:00:00");
        if (dateStr === today) return "Today";
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (dateStr === tomorrow.toISOString().split("T")[0]) return "Tomorrow";
        return d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    if (!user) return null;

    return (
        <div className="pb-4">
            {/* Header */}
            <div
                className="px-5 pt-4 pb-6 rounded-b-3xl"
                style={{
                    background: "linear-gradient(160deg, #8B0D22 0%, #B5122E 50%, #D41535 100%)",
                }}
            >
                <div className="flex items-center gap-3 mb-5">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(245,166,35,0.8), rgba(255,200,87,0.8))",
                        }}
                    >
                        {user.avatar}
                    </div>
                    <div>
                        <p className="text-sm text-blue-200">{getGreeting()}</p>
                        <h1 className="text-xl font-bold text-white">{user.name}</h1>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-3">
                    <div className="flex-1 bg-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock size={14} className="text-amber-300" />
                            <span className="text-[10px] text-blue-200">Hours This Week</span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {Math.round(totalHoursWeek)}h
                        </p>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar size={14} className="text-amber-300" />
                            <span className="text-[10px] text-blue-200">Shifts This Week</span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {thisWeekShifts.length}
                        </p>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Coffee size={14} className="text-amber-300" />
                            <span className="text-[10px] text-blue-200">Next Day Off</span>
                        </div>
                        <p className="text-lg font-bold text-white">Mon</p>
                    </div>
                </div>
            </div>

            {/* Upcoming Shifts */}
            <div className="px-4 mt-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900">Upcoming Shifts</h2>
                    <span className="text-xs text-gray-400 font-medium">
                        Next {upcomingShifts.length} shifts
                    </span>
                </div>

                {upcomingShifts.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                        <Calendar size={40} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-gray-500">No upcoming shifts</p>
                        <p className="text-xs text-gray-400 mt-1">Your schedule will appear here once duties are assigned</p>
                    </div>
                ) : (
                    <div className="relative">
                        <div
                            className="absolute left-[19px] top-6 bottom-6 w-[2px]"
                            style={{
                                background:
                                    "linear-gradient(180deg, #E5E7EB 0%, #E5E7EB 80%, transparent 100%)",
                            }}
                        />

                        <div className="space-y-4">
                            {upcomingShifts.map((shift, index) => {
                                const isToday = shift.date === today;
                                return (
                                    <motion.div
                                        key={shift.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                        className="flex gap-4"
                                    >
                                        <div className="flex flex-col items-center pt-4 z-10">
                                            <div
                                                className="w-[10px] h-[10px] rounded-full flex-shrink-0"
                                                style={{
                                                    background: isToday ? "#F5A623" : "#D1D5DB",
                                                    boxShadow: isToday
                                                        ? "0 0 0 4px rgba(245,166,35,0.2)"
                                                        : "none",
                                                }}
                                            />
                                        </div>

                                        <div
                                            className="flex-1 bg-white rounded-2xl p-4 transition-all"
                                            style={{
                                                boxShadow: isToday
                                                    ? "0 4px 20px rgba(245,166,35,0.15)"
                                                    : "0 2px 12px rgba(0,0,0,0.05)",
                                                borderLeft: isToday
                                                    ? "4px solid #F5A623"
                                                    : "4px solid transparent",
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span
                                                    className="text-xs font-semibold"
                                                    style={{
                                                        color: isToday ? "#F5A623" : "#6B7280",
                                                    }}
                                                >
                                                    {formatDate(shift.date)}
                                                </span>
                                                {isToday && (
                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                                        ACTIVE
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-baseline gap-2 mb-3">
                                                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                                    {shift.startTime}
                                                </span>
                                                <span className="text-gray-300 font-medium">—</span>
                                                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                                    {shift.endTime}
                                                </span>
                                                {getTimeIcon(shift.startTime)}
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span
                                                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${departmentBgColors[shift.department]}`}
                                                >
                                                    {shift.department}
                                                </span>
                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                    <MapPin size={11} />
                                                    <span>{shift.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
