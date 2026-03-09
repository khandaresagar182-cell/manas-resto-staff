"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Staff } from "./types";
import {
    getStoredUsersAsync,
    subscribeToUsers,
    getStoredSession,
    saveStoredSession,
    type StoredUser,
} from "./storage";

export type UserRole = "chef" | "staff";

interface AuthState {
    user: Staff | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {
    login: (staffId: string, role: UserRole) => Promise<void>;
    loginWithUser: (user: Staff, role: UserRole) => void;
    logout: () => void;
    allUsers: StoredUser[]; // Expose real-time users list
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function storedUserToStaff(su: StoredUser): Staff {
    return {
        id: su.id,
        name: su.name,
        role: su.staffRole,
        department: su.department,
        avatar: su.avatar,
        email: su.email,
        phone: su.phone,
    };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        role: null,
        isAuthenticated: false,
        isLoading: true,
    });
    const [allUsers, setAllUsers] = useState<StoredUser[]>([]);

    // Subscribe to all users in real-time
    useEffect(() => {
        const unsubscribe = subscribeToUsers((users) => {
            setAllUsers(users);
        });
        return () => unsubscribe();
    }, []);

    // Restore session from localStorage on mount
    useEffect(() => {
        const restoreSession = async () => {
            const session = getStoredSession();
            if (session) {
                const users = await getStoredUsersAsync();
                const storedUser = users.find((u) => u.id === session.userId);
                if (storedUser) {
                    setAuthState({
                        user: storedUserToStaff(storedUser),
                        role: session.role,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    return;
                }
            }
            setAuthState((prev) => ({ ...prev, isLoading: false }));
        };
        restoreSession();
    }, []);

    const login = useCallback(async (staffId: string, role: UserRole) => {
        const users = await getStoredUsersAsync();
        const storedUser = users.find((u) => u.id === staffId);
        if (storedUser) {
            const user = storedUserToStaff(storedUser);
            setAuthState({ user, role, isAuthenticated: true, isLoading: false });
            saveStoredSession({ userId: staffId, role });
        }
    }, []);

    const loginWithUser = useCallback((user: Staff, role: UserRole) => {
        setAuthState({ user, role, isAuthenticated: true, isLoading: false });
        saveStoredSession({ userId: user.id, role });
    }, []);

    const logout = useCallback(() => {
        setAuthState({ user: null, role: null, isAuthenticated: false, isLoading: false });
        saveStoredSession(null);
    }, []);

    return (
        <AuthContext.Provider value={{ ...authState, login, loginWithUser, logout, allUsers }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
