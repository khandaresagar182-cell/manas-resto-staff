"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Shift } from "./types";
import { getStoredShifts, saveStoredShifts } from "./storage";

interface DutyContextType {
    shifts: Shift[];
    addShift: (shift: Shift) => void;
    removeShift: (id: string) => void;
    updateShift: (id: string, data: Partial<Shift>) => void;
    getShiftsForDate: (date: string) => Shift[];
    getShiftsForStaff: (staffId: string) => Shift[];
}

const DutyContext = createContext<DutyContextType | undefined>(undefined);

export function DutyProvider({ children }: { children: React.ReactNode }) {
    const [shifts, setShifts] = useState<Shift[]>(() => {
        const stored = getStoredShifts();
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return [];
            }
        }
        return [];
    });

    // Persist shifts whenever they change
    useEffect(() => {
        saveStoredShifts(shifts);
    }, [shifts]);

    const addShift = useCallback((shift: Shift) => {
        setShifts((prev) => [...prev, shift]);
    }, []);

    const removeShift = useCallback((id: string) => {
        setShifts((prev) => prev.filter((s) => s.id !== id));
    }, []);

    const updateShift = useCallback((id: string, data: Partial<Shift>) => {
        setShifts((prev) =>
            prev.map((s) => (s.id === id ? { ...s, ...data } : s))
        );
    }, []);

    const getShiftsForDate = useCallback(
        (date: string) => shifts.filter((s) => s.date === date),
        [shifts]
    );

    const getShiftsForStaff = useCallback(
        (staffId: string) => shifts.filter((s) => s.staffId === staffId),
        [shifts]
    );

    return (
        <DutyContext.Provider
            value={{ shifts, addShift, removeShift, updateShift, getShiftsForDate, getShiftsForStaff }}
        >
            {children}
        </DutyContext.Provider>
    );
}

export function useDuty() {
    const context = useContext(DutyContext);
    if (context === undefined) {
        throw new Error("useDuty must be used within a DutyProvider");
    }
    return context;
}
