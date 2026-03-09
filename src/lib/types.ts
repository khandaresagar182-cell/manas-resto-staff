export interface Staff {
    id: string;
    name: string;
    role: string;
    department: string;
    avatar: string;
    email: string;
    phone: string;
}

export interface Shift {
    id: string;
    staffId: string;
    date: string;
    startTime: string;
    endTime: string;
    department: string;
    location: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    type: "roster_published" | "shift_swap" | "schedule_change" | "reminder" | "shift_assigned" | "shift_removed";
    icon: string;
}

export interface AttendanceRecord {
    id: string;
    staffId: string;
    staffName: string;
    staffAvatar: string;
    date: string;          // "YYYY-MM-DD"
    time: string;          // "HH:MM"
    timestamp: string;     // ISO string
    photoBase64: string;   // data URL from camera canvas capture (fallback)
    photoUrl?: string;     // Firebase Storage download URL (preferred)
    latitude: number | null;
    longitude: number | null;
    locationLabel: string; // human-readable GPS label or fallback
    isLate?: boolean;      // true if checked in after shift start time
    shiftStartTime?: string; // the shift start time they were late for
}
