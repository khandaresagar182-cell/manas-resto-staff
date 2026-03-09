"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera,
    CalendarDays,
    BarChart3,
    MapPin,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Users,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-context";
import { useAuth } from "@/lib/auth-context";
import type { AttendanceRecord } from "@/lib/types";

type ViewMode = "daily" | "monthly";

const ANNUAL_LEAVE_DAYS = 24;

export function AttendanceViewer() {
    const { getRecordsForDate, records } = useAttendance();
    const { allUsers } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>("daily");
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const n = new Date();
        return { year: n.getFullYear(), month: n.getMonth() }; // 0-indexed
    });
    const [previewPhoto, setPreviewPhoto] = useState<AttendanceRecord | null>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    // 14-day strip
    const days = useMemo(() => {
        const result = [];
        for (let i = -2; i <= 11; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split("T")[0];
            result.push({
                date: dateStr,
                dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
                dayNumber: d.getDate(),
                month: d.toLocaleDateString("en-US", { month: "short" }),
                isToday: i === 0,
            });
        }
        return result;
    }, []);

    const dailyRecords = getRecordsForDate(selectedDate);

    // ── Monthly Report ──────────────────────────────────────────────────
    const allStaff = useMemo(() => {
        return allUsers.map((u) => ({ id: u.id, name: u.name, avatar: u.avatar, department: u.department }));
    }, [allUsers]);

    const monthlyStats = useMemo(() => {
        const { year, month } = selectedMonth;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Working days = Mon-Sat (exclude Sunday)
        const workingDays = Array.from({ length: daysInMonth }, (_, i) => {
            const d = new Date(year, month, i + 1);
            return d.getDay() !== 0; // not Sunday
        }).filter(Boolean).length;

        return allStaff.map((staff) => {
            const staffRecs = records.filter((r) => {
                if (r.staffId !== staff.id) return false;
                const d = new Date(r.timestamp);
                return d.getFullYear() === year && d.getMonth() === month;
            });
            const daysWorked = new Set(staffRecs.map((r) => r.date)).size;
            const daysAbsent = Math.max(0, workingDays - daysWorked);
            const holidaysUsed = Math.min(daysAbsent, ANNUAL_LEAVE_DAYS);
            const holidaysRemaining = ANNUAL_LEAVE_DAYS - holidaysUsed;
            return { ...staff, daysWorked, daysAbsent, workingDays, holidaysUsed, holidaysRemaining };
        });
    }, [allStaff, records, selectedMonth]);

    const monthName = (m: number, y: number) =>
        new Date(y, m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const prevMonth = () =>
        setSelectedMonth((p) => {
            const d = new Date(p.year, p.month - 1, 1);
            return { year: d.getFullYear(), month: d.getMonth() };
        });
    const nextMonth = () =>
        setSelectedMonth((p) => {
            const d = new Date(p.year, p.month + 1, 1);
            return { year: d.getFullYear(), month: d.getMonth() };
        });

    return (
        <div className="pb-4">
            {/* Header */}
            <div
                className="px-5 pt-4 pb-5 rounded-b-3xl"
                style={{ background: "linear-gradient(160deg, #8B0D22 0%, #B5122E 50%, #D41535 100%)" }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-white">Attendance</h1>
                        <p className="text-sm text-white/60 mt-0.5">
                            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </p>
                    </div>
                    <Users size={28} className="text-white/40" />
                </div>

                {/* Toggle */}
                <div className="flex bg-white/10 rounded-2xl p-1 gap-1">
                    {(["daily", "monthly"] as ViewMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => setViewMode(m)}
                            className="flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200 flex items-center justify-center gap-1.5"
                            style={{
                                background: viewMode === m ? "#fff" : "transparent",
                                color: viewMode === m ? "#B5122E" : "rgba(255,255,255,0.7)",
                            }}
                        >
                            {m === "daily" ? <Camera size={13} /> : <BarChart3 size={13} />}
                            {m === "daily" ? "Daily Photos" : "Monthly Report"}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* ── DAILY VIEW ─────────────────────────── */}
                {viewMode === "daily" && (
                    <motion.div
                        key="daily"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {/* Date strip */}
                        <div className="px-4 mt-4 mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-bold text-gray-800">Select Date</h2>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => calendarRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
                                        className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center"
                                    >
                                        <ChevronLeft size={14} className="text-gray-500" />
                                    </button>
                                    <button
                                        onClick={() => calendarRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
                                        className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center"
                                    >
                                        <ChevronRight size={14} className="text-gray-500" />
                                    </button>
                                </div>
                            </div>
                            <div ref={calendarRef} className="flex gap-2 overflow-x-auto pb-2">
                                {days.map((day) => {
                                    const isSelected = selectedDate === day.date;
                                    const hasRecords = getRecordsForDate(day.date).length > 0;
                                    return (
                                        <motion.button
                                            key={day.date}
                                            onClick={() => setSelectedDate(day.date)}
                                            whileTap={{ scale: 0.92 }}
                                            className="flex flex-col items-center justify-center rounded-2xl flex-shrink-0 relative"
                                            style={{
                                                minWidth: "56px",
                                                height: "72px",
                                                background: isSelected
                                                    ? "linear-gradient(135deg, #F5A623, #FFC857)"
                                                    : day.isToday
                                                        ? "rgba(27,42,74,0.08)"
                                                        : "#FFFFFF",
                                                boxShadow: isSelected
                                                    ? "0 4px 15px rgba(245,166,35,0.35)"
                                                    : "0 1px 3px rgba(0,0,0,0.06)",
                                                border: day.isToday && !isSelected ? "2px solid #1B2A4A" : "1px solid transparent",
                                            }}
                                        >
                                            <span className="text-[10px] font-semibold uppercase" style={{ color: isSelected ? "#1A1A2E" : "#9CA3AF" }}>{day.dayName}</span>
                                            <span className="text-lg font-bold" style={{ color: isSelected ? "#1A1A2E" : "#374151" }}>{day.dayNumber}</span>
                                            <span className="text-[9px] font-medium" style={{ color: isSelected ? "#1A1A2E" : "#9CA3AF" }}>{day.month}</span>
                                            {hasRecords && (
                                                <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-green-500" />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Photo cards */}
                        <div className="px-4">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-bold text-gray-800">
                                    {dailyRecords.length} Check-In{dailyRecords.length !== 1 ? "s" : ""}
                                </h2>
                                <span className="text-xs text-gray-400">{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
                            </div>

                            {dailyRecords.length === 0 ? (
                                <div className="bg-white rounded-2xl p-10 text-center" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                                    <Camera size={40} className="text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm font-semibold text-gray-500">No check-ins</p>
                                    <p className="text-xs text-gray-400 mt-1">No staff photos recorded for this date</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {dailyRecords.map((rec, i) => (
                                        <motion.button
                                            key={rec.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.07 }}
                                            onClick={() => setPreviewPhoto(rec)}
                                            className="relative rounded-2xl overflow-hidden text-left"
                                            style={{ aspectRatio: "3/4", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={rec.photoBase64} alt={rec.staffName} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0" style={{ background: "linear-gradient(transparent 45%, rgba(0,0,0,0.75) 100%)" }} />
                                            <div className="absolute bottom-0 inset-x-0 p-3">
                                                <p className="text-white font-bold text-xs truncate">{rec.staffName}</p>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <CalendarDays size={9} className="text-amber-300" />
                                                    <span className="text-amber-300 text-[10px] font-medium">{rec.time}</span>
                                                </div>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <MapPin size={9} className="text-white/70" />
                                                    <span className="text-white/70 text-[9px] truncate">{rec.locationLabel}</span>
                                                </div>
                                            </div>
                                            {/* Late badge */}
                                            {rec.isLate && (
                                                <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg">LATE</span>
                                            )}
                                            {/* GPS badge */}
                                            {rec.latitude && (
                                                <a
                                                    href={`https://maps.google.com/?q=${rec.latitude},${rec.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="absolute top-2 right-2 bg-white/20 rounded-lg p-1 backdrop-blur-sm"
                                                >
                                                    <MapPin size={12} className="text-white" />
                                                </a>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ── MONTHLY VIEW ───────────────────────── */}
                {viewMode === "monthly" && (
                    <motion.div
                        key="monthly"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        {/* Month selector */}
                        <div className="px-4 mt-4 mb-3">
                            <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                                <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50">
                                    <ChevronLeft size={16} className="text-gray-600" />
                                </button>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-gray-900">{monthName(selectedMonth.month, selectedMonth.year)}</p>
                                    <p className="text-[10px] text-gray-400">{ANNUAL_LEAVE_DAYS} annual leave days</p>
                                </div>
                                <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50">
                                    <ChevronRight size={16} className="text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Summary legend */}
                        <div className="px-4 mb-3 flex gap-2">
                            {[
                                { color: "#22c55e", label: "Worked" },
                                { color: "#EF4444", label: "Absent" },
                                { color: "#F59E0B", label: "Leave Left" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-1">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                                    <span className="text-[10px] text-gray-500 font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Staff cards */}
                        <div className="px-4 space-y-3">
                            {allStaff.length === 0 ? (
                                <div className="bg-white rounded-2xl p-10 text-center" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                                    <Users size={36} className="text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm text-gray-400">No staff registered yet</p>
                                </div>
                            ) : (
                                monthlyStats.map((staff, i) => {
                                    const workedPct = staff.workingDays > 0 ? (staff.daysWorked / staff.workingDays) * 100 : 0;
                                    return (
                                        <motion.div
                                            key={staff.id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.07 }}
                                            className="bg-white rounded-2xl p-4"
                                            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                                    style={{ background: "linear-gradient(135deg, #1B2A4A, #2D4A7A)" }}
                                                >
                                                    {staff.avatar}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-sm text-gray-900 truncate">{staff.name}</h3>
                                                    <p className="text-[10px] text-gray-400">{staff.department}</p>
                                                </div>
                                                {staff.daysWorked >= staff.workingDays * 0.9 ? (
                                                    <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                                                ) : (
                                                    <XCircle size={18} className="text-red-400 flex-shrink-0" />
                                                )}
                                            </div>

                                            {/* Progress bar */}
                                            <div className="mb-3">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-[10px] text-gray-400">Attendance</span>
                                                    <span className="text-[10px] font-semibold text-gray-600">{Math.round(workedPct)}%</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${workedPct}%` }}
                                                        transition={{ duration: 0.8, delay: i * 0.07 }}
                                                        className="h-full rounded-full"
                                                        style={{
                                                            background: workedPct >= 90
                                                                ? "linear-gradient(90deg, #22c55e, #16a34a)"
                                                                : workedPct >= 70
                                                                    ? "linear-gradient(90deg, #F59E0B, #D97706)"
                                                                    : "linear-gradient(90deg, #EF4444, #DC2626)",
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Stats grid */}
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="bg-green-50 rounded-xl p-2 text-center">
                                                    <p className="text-base font-bold text-green-700">{staff.daysWorked}</p>
                                                    <p className="text-[9px] text-green-600 font-medium">Days On</p>
                                                </div>
                                                <div className="bg-red-50 rounded-xl p-2 text-center">
                                                    <p className="text-base font-bold text-red-600">{staff.daysAbsent}</p>
                                                    <p className="text-[9px] text-red-500 font-medium">Absent</p>
                                                </div>
                                                <div className="bg-amber-50 rounded-xl p-2 text-center">
                                                    <p className="text-base font-bold text-amber-700">{staff.holidaysRemaining}</p>
                                                    <p className="text-[9px] text-amber-600 font-medium">Leave Left</p>
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-gray-300 text-right mt-1">{staff.workingDays} working days this month</p>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Photo lightbox */}
            <AnimatePresence>
                {previewPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewPhoto(null)}
                        className="fixed inset-0 z-[80] flex items-center justify-center p-4"
                        style={{ background: "rgba(0,0,0,0.85)" }}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-[380px] rounded-3xl overflow-hidden"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewPhoto.photoBase64} alt="check-in" className="w-full" />
                            {previewPhoto.isLate && (
                                <div className="w-full py-2 text-center text-xs font-bold text-amber-900" style={{ background: "#FDE68A" }}>
                                    ⚠️ Late Check-In — Shift was at {previewPhoto.shiftStartTime}
                                </div>
                            )}
                            <button
                                onClick={() => setPreviewPhoto(null)}
                                className="w-full py-3 text-white font-semibold text-sm"
                                style={{ background: "rgba(255,255,255,0.1)" }}
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
