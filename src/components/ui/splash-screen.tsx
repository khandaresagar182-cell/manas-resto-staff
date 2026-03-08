"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface SplashScreenProps {
    onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
            style={{
                background: "#FFFFFF",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >

            {/* Main content */}
            <div className="flex flex-col items-center gap-5 relative z-10">
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-28 h-28 rounded-full flex items-center justify-center"
                    style={{
                        background: "#ffffff",
                        boxShadow: "0 20px 60px rgba(181,18,46,0.3), 0 0 0 4px rgba(181,18,46,0.15)",
                        padding: "8px",
                    }}
                >
                    <Image
                        src="/logo.png"
                        alt="Manas Resto Logo"
                        width={96}
                        height={96}
                        className="w-full h-full object-contain rounded-full"
                        priority
                    />
                </motion.div>

                {/* App name */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-center"
                >
                    <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "#B5122E" }}>
                        Manas Resto
                    </h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="h-0.5 mx-auto mt-2 rounded-full"
                        style={{
                            background: "linear-gradient(90deg, transparent, #B5122E, transparent)",
                        }}
                    />
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                    className="text-sm font-medium tracking-widest uppercase" style={{ color: "#B5122E", opacity: 0.7 }}
                >
                    Staff Management System
                </motion.p>

                {/* Loading dots */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="flex gap-1.5 mt-2"
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{ background: "#B5122E" }}
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Progress bar */}
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 2.5, ease: "linear" }}
                onAnimationComplete={onComplete}
                className="absolute bottom-0 left-0 right-0 h-1 origin-left"
                style={{ background: "rgba(181,18,46,0.5)" }}
            />
        </motion.div>
    );
}
