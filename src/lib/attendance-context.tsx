"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { AttendanceRecord } from "./types";
import { getStoredAttendance, saveStoredAttendance } from "./storage";

interface AttendanceContextType {
    records: AttendanceRecord[];
    addRecord: (record: AttendanceRecord) => void;
    getRecordsForDate: (date: string) => AttendanceRecord[];
    getRecordsForStaff: (staffId: string) => AttendanceRecord[];
    hasCheckedInToday: (staffId: string) => boolean;
    getTodayRecord: (staffId: string) => AttendanceRecord | undefined;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = getStoredAttendance();
        setRecords(stored);
    }, []);

    const addRecord = useCallback((record: AttendanceRecord) => {
        setRecords((prev) => {
            const updated = [record, ...prev];
            saveStoredAttendance(updated);
            return updated;
        });
    }, []);

    const getRecordsForDate = useCallback(
        (date: string) => records.filter((r) => r.date === date),
        [records]
    );

    const getRecordsForStaff = useCallback(
        (staffId: string) => records.filter((r) => r.staffId === staffId),
        [records]
    );

    const hasCheckedInToday = useCallback(
        (staffId: string) => {
            const today = new Date().toISOString().split("T")[0];
            return records.some((r) => r.staffId === staffId && r.date === today);
        },
        [records]
    );

    const getTodayRecord = useCallback(
        (staffId: string) => {
            const today = new Date().toISOString().split("T")[0];
            return records.find((r) => r.staffId === staffId && r.date === today);
        },
        [records]
    );

    return (
        <AttendanceContext.Provider
            value={{ records, addRecord, getRecordsForDate, getRecordsForStaff, hasCheckedInToday, getTodayRecord }}
        >
            {children}
        </AttendanceContext.Provider>
    );
}

export function useAttendance() {
    const ctx = useContext(AttendanceContext);
    if (!ctx) throw new Error("useAttendance must be used within AttendanceProvider");
    return ctx;
}
