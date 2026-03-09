"use client";

import { useEffect } from "react";

export function PWARegister() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker
                    .register("/sw.js")
                    .then((reg) => {
                        console.log("[PWA] Service Worker registered:", reg.scope);

                        // Check for updates every 6 hours – keeps cache fresh
                        // without hammering the server on low-connectivity devices
                        setInterval(() => reg.update(), 6 * 60 * 60 * 1_000);
                    })
                    .catch((err) => {
                        console.warn("[PWA] Service Worker registration failed:", err);
                    });
            });
        }
    }, []);

    return null;
}
