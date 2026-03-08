"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed as PWA
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setInstalled(true);
            return;
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Show banner after a short delay
            setTimeout(() => setShowBanner(true), 3000);
        };

        window.addEventListener("beforeinstallprompt", handler);
        window.addEventListener("appinstalled", () => {
            setInstalled(true);
            setShowBanner(false);
        });

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setInstalled(true);
        }
        setShowBanner(false);
        setDeferredPrompt(null);
    };

    if (installed) return null;

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-28 left-0 right-0 z-50 flex justify-center px-4"
                >
                    <div
                        className="w-full max-w-[398px] rounded-2xl p-4 flex items-center gap-3 shadow-2xl"
                        style={{
                            background: "linear-gradient(135deg, #1B2A4A, #2D4A7A)",
                            border: "1px solid rgba(245,166,35,0.3)",
                        }}
                    >
                        {/* Icon */}
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #F5A623, #FFC857)" }}
                        >
                            <img src="/logo.png" alt="Manas Resto" className="w-8 h-8 rounded-lg object-cover" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white">Install Manas Roster</p>
                            <p className="text-xs text-blue-200/70 mt-0.5">Add to home screen for quick access & offline use</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={handleInstall}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                                style={{
                                    background: "linear-gradient(135deg, #F5A623, #FFC857)",
                                    color: "#1A1A2E",
                                }}
                            >
                                <Download size={14} />
                                Install
                            </motion.button>
                            <button
                                onClick={() => setShowBanner(false)}
                                className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{ background: "rgba(255,255,255,0.1)" }}
                            >
                                <X size={14} className="text-white/60" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
