"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { AttendanceRecord } from "./types";
import { saveAttendanceRecordAsync, subscribeToAttendance } from "./storage";

interface AttendanceContextType {
    records: AttendanceRecord[];
    addRecord: (record: AttendanceRecord) => Promise<void>;
    getRecordsForDate: (date: string) => AttendanceRecord[];
    getRecordsForStaff: (staffId: string) => AttendanceRecord[];
    hasCheckedInToday: (staffId: string) => boolean;
    getTodayRecord: (staffId: string) => AttendanceRecord | undefined;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);

    // Subscribe to attendance records in real-time
    useEffect(() => {
        const unsubscribe = subscribeToAttendance((newRecords) => {
            // Sort records by timestamp descending (newest first)
            const sortedRecords = [...newRecords].sort((a, b) => {
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            });
            setRecords(sortedRecords);
        });

        return () => unsubscribe();
    }, []);

    const addRecord = useCallback(async (record: AttendanceRecord) => {
        // We write to Firestore. The real-time listener will instantly update our state.
        await saveAttendanceRecordAsync(record);
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
