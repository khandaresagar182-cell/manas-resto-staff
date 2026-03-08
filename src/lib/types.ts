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
