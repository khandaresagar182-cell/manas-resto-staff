"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/ui/splash-screen";
import { LoginPage } from "@/components/ui/login-page";
import { DutyRosterApp } from "@/components/ui/duty-roster-app";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { DutyProvider } from "@/lib/duty-context";
import { NotificationProvider } from "@/lib/notification-context";
import { AttendanceProvider } from "@/lib/attendance-context";
import { InstallBanner } from "@/components/ui/install-banner";

type AppPhase = "splash" | "auth-check" | "login" | "app";

function AppContent() {
    const [phase, setPhase] = useState<AppPhase>("splash");
    const { isAuthenticated, isLoading } = useAuth();

    // After splash, check auth status
    useEffect(() => {
        if (phase === "auth-check" && !isLoading) {
            if (isAuthenticated) {
                setPhase("app");
            } else {
                setPhase("login");
            }
        }
    }, [phase, isLoading, isAuthenticated]);

    // If user logs out while in app, go back to login
    const currentPhase = phase === "app" && !isAuthenticated ? "login" : phase;

    return (
        <AnimatePresence mode="wait">
            {currentPhase === "splash" && (
                <motion.div key="splash" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <SplashScreen onComplete={() => setPhase("auth-check")} />
                </motion.div>
            )}
            {currentPhase === "auth-check" && (
                <motion.div
                    key="auth-check"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center"
                    style={{
                        background: "linear-gradient(135deg, #0F1A2E 0%, #1B2A4A 40%, #2D4A7A 100%)",
                    }}
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full"
                    />
                </motion.div>
            )}
            {currentPhase === "login" && (
                <motion.div
                    key="login"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <LoginWrapper onLogin={() => setPhase("app")} />
                </motion.div>
            )}
            {currentPhase === "app" && isAuthenticated && (
                <motion.div
                    key="app"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <DutyRosterApp />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Wrapper that detects auth changes to transition to app
function LoginWrapper({ onLogin }: { onLogin: () => void }) {
    const { isAuthenticated } = useAuth();

    // When auth changes to true, transition to app
    if (isAuthenticated) {
        setTimeout(() => onLogin(), 100);
    }

    return <LoginPage />;
}

export default function Home() {
    return (
        <AuthProvider>
            <DutyProvider>
                <NotificationProvider>
                    <AttendanceProvider>
                        <AppContent />
                        <InstallBanner />
                    </AttendanceProvider>
                </NotificationProvider>
            </DutyProvider>
        </AuthProvider>
    );
}
