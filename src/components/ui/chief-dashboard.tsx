"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Send,
    Clock,
    MapPin,
    X,
    Plus,
    Trash2,
} from "lucide-react";
import { departmentColors, departmentBgColors } from "@/lib/mock-data";
import { useDuty } from "@/lib/duty-context";
import { useAuth } from "@/lib/auth-context";
import { useNotifications } from "@/lib/notification-context";
import type { Staff, Shift } from "@/lib/types";

export function ChiefDashboard() {
    const { shifts, addShift, removeShift } = useDuty();
    const { addNotification } = useNotifications();
    const { allUsers } = useAuth();

    // Map Firestore users to Staff shape in real-time
    const staffMembers = allUsers.map((u) => ({
        id: u.id,
        name: u.name,
        role: u.staffRole,
        department: u.department,
        avatar: u.avatar,
        email: u.email,
        phone: u.phone,
    }));

    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });
    const [editingShift, setEditingShift] = useState<Shift | null>(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    // New shift form state
    const [newShift, setNewShift] = useState({
        staffId: "",
        startTime: "09:00",
        endTime: "17:00",
        department: "Kitchen",
        location: "Main Kitchen",
    });

    // 14-day range
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

    const shiftsForDate = shifts.filter((s) => s.date === selectedDate);
    const staffOnDuty = new Set(shiftsForDate.map((s) => s.staffId)).size;
    const totalStaff = staffMembers.length;

    const getStaffShifts = (staffId: string) =>
        shiftsForDate.filter((s) => s.staffId === staffId);

    const handleAssignDuty = () => {
        if (!newShift.staffId) return;
        const staff = staffMembers.find((s) => s.id === newShift.staffId);
        if (!staff) return;

        const dateLabel = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric",
        });

        addShift({
            id: `shift-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            staffId: newShift.staffId,
            date: selectedDate,
            startTime: newShift.startTime,
            endTime: newShift.endTime,
            department: newShift.department,
            location: newShift.location,
        });

        // Fire notification
        addNotification({
            title: "Shift Assigned 🗓️",
            message: `${staff.name} has been assigned a shift on ${dateLabel} from ${newShift.startTime} to ${newShift.endTime} at ${newShift.location}.`,
            type: "shift_assigned",
            icon: "calendar",
            targetUserId: newShift.staffId,
        });

        setIsAssigning(false);
        setNewShift({
            staffId: "",
            startTime: "09:00",
            endTime: "17:00",
            department: "Kitchen",
            location: "Main Kitchen",
        });
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
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-white">Duty Roster</h1>
                        <p className="text-sm text-white/70 mt-0.5">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                    <div
                        className="w-10 h-10 rounded-xl overflow-hidden"
                        style={{ border: "2px solid rgba(245,166,35,0.4)" }}
                    >
                        <Image
                            src="/logo.png"
                            alt="Manas Resto"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-white">{staffOnDuty}</p>
                        <p className="text-[10px] text-white/60 mt-0.5">On Duty</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-amber-300">
                            {totalStaff - staffOnDuty}
                        </p>
                        <p className="text-[10px] text-blue-200 mt-0.5">Unassigned</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-white">{shiftsForDate.length}</p>
                        <p className="text-[10px] text-blue-200 mt-0.5">Total Shifts</p>
                    </div>
                </div>
            </div>

            {/* Calendar Strip */}
            <div className="px-4 mt-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-gray-800">Select Date</h2>
                    <div className="flex gap-1">
                        <button
                            onClick={() =>
                                calendarRef.current?.scrollBy({ left: -200, behavior: "smooth" })
                            }
                            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center"
                            style={{ minHeight: "28px", minWidth: "28px" }}
                        >
                            <ChevronLeft size={14} className="text-gray-500" />
                        </button>
                        <button
                            onClick={() =>
                                calendarRef.current?.scrollBy({ left: 200, behavior: "smooth" })
                            }
                            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center"
                            style={{ minHeight: "28px", minWidth: "28px" }}
                        >
                            <ChevronRight size={14} className="text-gray-500" />
                        </button>
                    </div>
                </div>
                <div
                    ref={calendarRef}
                    className="flex gap-2 overflow-x-auto pb-2 scroll-horizontal"
                >
                    {days.map((day) => {
                        const isSelected = selectedDate === day.date;
                        return (
                            <motion.button
                                key={day.date}
                                onClick={() => setSelectedDate(day.date)}
                                whileTap={{ scale: 0.92 }}
                                className="flex flex-col items-center justify-center rounded-2xl transition-all duration-200 flex-shrink-0"
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
                                    border: day.isToday && !isSelected
                                        ? "2px solid #1B2A4A"
                                        : "1px solid transparent",
                                }}
                            >
                                <span
                                    className="text-[10px] font-semibold uppercase"
                                    style={{ color: isSelected ? "#1A1A2E" : "#9CA3AF" }}
                                >
                                    {day.dayName}
                                </span>
                                <span
                                    className="text-lg font-bold"
                                    style={{ color: isSelected ? "#1A1A2E" : "#374151" }}
                                >
                                    {day.dayNumber}
                                </span>
                                <span
                                    className="text-[9px] font-medium"
                                    style={{ color: isSelected ? "#1A1A2E" : "#9CA3AF" }}
                                >
                                    {day.month}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Staff Roster */}
            <div className="px-4">
                <h2 className="text-sm font-bold text-gray-800 mb-3">Staff Schedule</h2>
                <div className="space-y-3">
                    {staffMembers.map((staff) => {
                        const staffShifts = getStaffShifts(staff.id);
                        return (
                            <motion.div
                                key={staff.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl p-4"
                                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                        style={{
                                            background: "linear-gradient(135deg, #1B2A4A, #2D4A7A)",
                                        }}
                                    >
                                        {staff.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm text-gray-900 truncate">
                                            {staff.name}
                                        </h3>
                                        <p className="text-xs text-gray-400">{staff.role}</p>
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${departmentBgColors[staff.department]}`}
                                    >
                                        {staff.department}
                                    </span>
                                </div>

                                {staffShifts.length > 0 ? (
                                    <div className="flex gap-2 flex-wrap">
                                        {staffShifts.map((shift) => (
                                            <div key={shift.id} className="flex items-center gap-1">
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setEditingShift(shift)}
                                                    className={`${departmentColors[shift.department]} rounded-xl px-3 py-2 flex items-center gap-2`}
                                                    style={{ minHeight: "44px" }}
                                                >
                                                    <Clock size={12} />
                                                    <span className="text-xs font-semibold">
                                                        {shift.startTime} – {shift.endTime}
                                                    </span>
                                                    <MapPin size={10} className="opacity-70" />
                                                    <span className="text-[10px] opacity-80">
                                                        {shift.location}
                                                    </span>
                                                </motion.button>
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => removeShift(shift.id)}
                                                    className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 size={12} className="text-red-500" />
                                                </motion.button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-400 italic py-2">
                                        No shift assigned
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Edit Shift Modal */}
            <AnimatePresence>
                {editingShift && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-end justify-center"
                        style={{ background: "rgba(0,0,0,0.4)" }}
                        onClick={() => setEditingShift(null)}
                    >
                        <motion.div
                            initial={{ y: 300 }}
                            animate={{ y: 0 }}
                            exit={{ y: 300 }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-t-3xl w-full max-w-[430px] p-6"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-bold text-gray-900">Shift Details</h3>
                                <button
                                    onClick={() => setEditingShift(null)}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                                >
                                    <X size={16} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Start Time</label>
                                        <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-800">
                                            {editingShift.startTime}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-gray-500 mb-1 block">End Time</label>
                                        <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-800">
                                            {editingShift.endTime}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Department</label>
                                    <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-800">
                                        {editingShift.department}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Location</label>
                                    <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-800">
                                        {editingShift.location}
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => {
                                            removeShift(editingShift.id);
                                            setEditingShift(null);
                                        }}
                                        className="flex-1 py-3.5 rounded-xl border border-red-200 text-sm font-semibold text-red-500 flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={14} />
                                        Remove Shift
                                    </button>
                                    <button
                                        onClick={() => setEditingShift(null)}
                                        className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white"
                                        style={{
                                            background: "linear-gradient(135deg, #1B2A4A, #2D4A7A)",
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Assign Duty Modal */}
            <AnimatePresence>
                {isAssigning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-end justify-center"
                        style={{ background: "rgba(0,0,0,0.4)" }}
                        onClick={() => setIsAssigning(false)}
                    >
                        <motion.div
                            initial={{ y: 400 }}
                            animate={{ y: 0 }}
                            exit={{ y: 400 }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-t-3xl w-full max-w-[430px] p-6"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-bold text-gray-900">Assign New Duty</h3>
                                <button
                                    onClick={() => setIsAssigning(false)}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                                >
                                    <X size={16} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Staff Select */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">
                                        Staff Member
                                    </label>
                                    <select
                                        value={newShift.staffId}
                                        onChange={(e) =>
                                            setNewShift((prev) => ({
                                                ...prev,
                                                staffId: e.target.value,
                                                department:
                                                    staffMembers.find((s) => s.id === e.target.value)
                                                        ?.department || prev.department,
                                            }))
                                        }
                                        className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 appearance-none border border-gray-100"
                                    >
                                        <option value="">— Select staff —</option>
                                        {staffMembers.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Times */}
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-gray-500 mb-1 block">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={newShift.startTime}
                                            onChange={(e) =>
                                                setNewShift((prev) => ({ ...prev, startTime: e.target.value }))
                                            }
                                            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 border border-gray-100"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-gray-500 mb-1 block">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={newShift.endTime}
                                            onChange={(e) =>
                                                setNewShift((prev) => ({ ...prev, endTime: e.target.value }))
                                            }
                                            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 border border-gray-100"
                                        />
                                    </div>
                                </div>

                                {/* Department */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">
                                        Department
                                    </label>
                                    <select
                                        value={newShift.department}
                                        onChange={(e) =>
                                            setNewShift((prev) => ({ ...prev, department: e.target.value }))
                                        }
                                        className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 appearance-none border border-gray-100"
                                    >
                                        {["Kitchen", "Service", "Bar", "Front Desk"].map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">
                                        Location
                                    </label>
                                    <select
                                        value={newShift.location}
                                        onChange={(e) =>
                                            setNewShift((prev) => ({ ...prev, location: e.target.value }))
                                        }
                                        className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 appearance-none border border-gray-100"
                                    >
                                        {["Main Kitchen", "Main Hall", "Outdoor Area", "Bar Counter", "Front Desk"].map(
                                            (l) => (
                                                <option key={l} value={l}>{l}</option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {/* Submit */}
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleAssignDuty}
                                    disabled={!newShift.staffId}
                                    className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40"
                                    style={{
                                        background: "linear-gradient(135deg, #B5122E, #D41535)",
                                        color: "white",
                                    }}
                                >
                                    <Plus size={16} />
                                    Assign Duty
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Buttons */}
            <div
                className="fixed bottom-24 z-40 flex flex-col gap-3"
                style={{ right: "max(16px, calc(50% - 215px + 16px))" }}
            >
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsAssigning(true)}
                    className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold shadow-lg"
                    style={{
                        background: "linear-gradient(135deg, #B5122E, #D41535)",
                        color: "white",
                    }}
                >
                    <Plus size={16} strokeWidth={2.5} />
                    Assign Duty
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold shadow-lg"
                    style={{
                        background: "rgba(181,18,46,0.12)",
                        color: "#B5122E",
                        border: "1.5px solid rgba(181,18,46,0.25)",
                    }}
                >
                    <Send size={16} strokeWidth={2.5} />
                    Publish Roster
                </motion.button>
            </div>
        </div>
    );
}
