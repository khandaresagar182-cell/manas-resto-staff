"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, MapPin, CheckCircle, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useAttendance } from "@/lib/attendance-context";
import type { AttendanceRecord } from "@/lib/types";

type Phase = "idle" | "camera" | "preview" | "saving" | "success" | "already";

export function AttendanceCheckin() {
    const { user } = useAuth();
    const { hasCheckedInToday, getTodayRecord, addRecord } = useAttendance();

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [phase, setPhase] = useState<Phase>("idle");
    const [capturedPhoto, setCapturedPhoto] = useState<string>("");
    const [gpsState, setGpsState] = useState<{
        lat: number | null;
        lng: number | null;
        label: string;
        loading: boolean;
        error: string;
    }>({ lat: null, lng: null, label: "", loading: false, error: "" });
    const [cameraError, setCameraError] = useState("");

    const today = new Date().toISOString().split("T")[0];
    const todayRecord = getTodayRecord(user?.id ?? "");
    const alreadyCheckedIn = hasCheckedInToday(user?.id ?? "");

    // Auto-detect already-checked-in state
    useEffect(() => {
        if (alreadyCheckedIn) {
            setPhase("already");
        }
    }, [alreadyCheckedIn]);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
    }, []);

    const startCamera = useCallback(async () => {
        setCameraError("");
        setPhase("camera");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (e) {
            const err = e as Error;
            setCameraError(
                err.name === "NotAllowedError"
                    ? "Camera permission denied. Please allow camera access and try again."
                    : "Could not start camera. Please check your device."
            );
            setPhase("idle");
        }
    }, []);

    const getGPS = useCallback((): Promise<{ lat: number | null; lng: number | null; label: string }> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve({ lat: null, lng: null, label: "Location not available" });
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = parseFloat(pos.coords.latitude.toFixed(5));
                    const lng = parseFloat(pos.coords.longitude.toFixed(5));
                    resolve({ lat, lng, label: `${lat}°N, ${lng}°E` });
                },
                () => {
                    resolve({ lat: null, lng: null, label: "Location unavailable" });
                },
                { timeout: 8000, maximumAge: 60000 }
            );
        });
    }, []);

    const snapPhoto = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Mirror the image (selfie cam)
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedPhoto(dataUrl);
        stopCamera();

        // Get GPS in parallel
        setGpsState((p) => ({ ...p, loading: true }));
        const { lat, lng, label } = await getGPS();
        setGpsState({ lat, lng, label, loading: false, error: "" });

        setPhase("preview");
    }, [stopCamera, getGPS]);

    const confirmCheckIn = useCallback(async () => {
        if (!user) return;
        setPhase("saving");

        const now = new Date();
        const record: AttendanceRecord = {
            id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            staffId: user.id,
            staffName: user.name,
            staffAvatar: user.avatar,
            date: today,
            time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
            timestamp: now.toISOString(),
            photoBase64: capturedPhoto,
            latitude: gpsState.lat,
            longitude: gpsState.lng,
            locationLabel: gpsState.label || "Location not captured",
        };

        await addRecord(record);

        // Short delay for save animation
        await new Promise((r) => setTimeout(r, 800));
        setPhase("success");
        setTimeout(() => setPhase("already"), 2500);
    }, [user, today, capturedPhoto, gpsState, addRecord]);

    const retake = useCallback(() => {
        setCapturedPhoto("");
        setGpsState({ lat: null, lng: null, label: "", loading: false, error: "" });
        startCamera();
    }, [startCamera]);

    // Cleanup on unmount
    useEffect(() => () => stopCamera(), [stopCamera]);

    if (!user) return null;

    const nowStr = new Date().toLocaleString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="pb-4">
            {/* Header */}
            <div
                className="px-5 pt-4 pb-6 rounded-b-3xl"
                style={{ background: "linear-gradient(160deg, #8B0D22 0%, #B5122E 50%, #D41535 100%)" }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ background: "linear-gradient(135deg, rgba(245,166,35,0.8), rgba(255,200,87,0.8))" }}
                    >
                        {user.avatar}
                    </div>
                    <div>
                        <p className="text-sm text-red-200">Kitchen Check-In</p>
                        <h1 className="text-xl font-bold text-white">{user.name}</h1>
                    </div>
                </div>
                <p className="text-xs text-white/60 mt-2">{nowStr}</p>
            </div>

            <div className="px-4 mt-5">
                <AnimatePresence mode="wait">
                    {/* ── IDLE ─────────────────────────────────── */}
                    {phase === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-6 pt-6"
                        >
                            <div
                                className="w-32 h-32 rounded-full flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #FFF3F5, #FFE0E5)" }}
                            >
                                <Camera size={52} style={{ color: "#B5122E" }} />
                            </div>
                            <div className="text-center">
                                <h2 className="text-lg font-bold text-gray-900">Mark Your Attendance</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Snap a selfie to check in for today&apos;s shift
                                </p>
                            </div>
                            {cameraError && (
                                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 w-full">
                                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                                    <p className="text-xs text-red-600">{cameraError}</p>
                                </div>
                            )}
                            <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={startCamera}
                                className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
                                style={{ background: "linear-gradient(135deg, #B5122E, #D41535)", boxShadow: "0 8px 24px rgba(181,18,46,0.35)" }}
                            >
                                <Camera size={20} />
                                Open Camera
                            </motion.button>
                        </motion.div>
                    )}

                    {/* ── CAMERA ─────────────────────────────── */}
                    {phase === "camera" && (
                        <motion.div
                            key="camera"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-4"
                        >
                            <p className="text-sm text-center text-gray-500 font-medium">Look at the camera &amp; smile 😊</p>
                            <div className="relative rounded-3xl overflow-hidden bg-gray-900" style={{ aspectRatio: "4/3" }}>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                    style={{ transform: "scaleX(-1)" }}
                                />
                                {/* Overlay guide circle */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    style={{ background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.3) 100%)" }}
                                >
                                    <div
                                        className="w-36 h-36 rounded-full border-4 border-dashed border-white/60"
                                        style={{ animation: "spin 8s linear infinite" }}
                                    />
                                </div>
                            </div>
                            <canvas ref={canvasRef} className="hidden" />
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={snapPhoto}
                                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white shadow-xl"
                                style={{ background: "linear-gradient(135deg, #B5122E, #D41535)", boxShadow: "0 0 0 6px rgba(181,18,46,0.2)" }}
                            >
                                <Camera size={32} />
                            </motion.button>
                        </motion.div>
                    )}

                    {/* ── PREVIEW ────────────────────────────── */}
                    {phase === "preview" && capturedPhoto && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-4"
                        >
                            <h2 className="text-base font-bold text-gray-900 text-center">Confirm Your Check-In</h2>

                            {/* Photo preview */}
                            <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={capturedPhoto} alt="selfie" className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 inset-x-0 p-3 flex items-end"
                                    style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.65))" }}>
                                    <div className="flex items-center gap-1.5 text-white">
                                        <MapPin size={13} />
                                        {gpsState.loading ? (
                                            <span className="text-xs">Getting location…</span>
                                        ) : (
                                            <span className="text-xs font-medium">{gpsState.label}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Info card */}
                            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Staff</span>
                                    <span className="font-semibold text-gray-900">{user.name}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-semibold text-gray-900">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-gray-500">Time</span>
                                    <span className="font-semibold text-gray-900">{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={retake}
                                    className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={15} />
                                    Retake
                                </button>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={confirmCheckIn}
                                    className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
                                    style={{ background: "linear-gradient(135deg, #B5122E, #D41535)" }}
                                >
                                    <CheckCircle size={15} />
                                    Confirm
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── SAVING ─────────────────────────────── */}
                    {phase === "saving" && (
                        <motion.div
                            key="saving"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-4 pt-16"
                        >
                            <Loader2 size={48} style={{ color: "#B5122E" }} className="animate-spin" />
                            <p className="text-base font-semibold text-gray-700">Saving check-in…</p>
                        </motion.div>
                    )}

                    {/* ── SUCCESS ────────────────────────────── */}
                    {phase === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="flex flex-col items-center gap-4 pt-12"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.12, 1] }}
                                transition={{ repeat: 2, duration: 0.4 }}
                                className="w-24 h-24 rounded-full flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
                            >
                                <CheckCircle size={48} className="text-white" />
                            </motion.div>
                            <h2 className="text-xl font-bold text-gray-900">Checked In! ✅</h2>
                            <p className="text-sm text-gray-500">Your attendance has been recorded</p>
                        </motion.div>
                    )}

                    {/* ── ALREADY CHECKED IN ─────────────────── */}
                    {phase === "already" && todayRecord && (
                        <motion.div
                            key="already"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-4"
                        >
                            <div
                                className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                                style={{ background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)", border: "1.5px solid #6EE7B7" }}
                            >
                                <CheckCircle size={18} className="text-green-600" />
                                <div>
                                    <p className="text-sm font-semibold text-green-800">Already Checked In Today</p>
                                    <p className="text-xs text-green-600">{todayRecord.time}</p>
                                </div>
                            </div>
                            {/* Selfie card */}
                            <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
                                <div className="relative" style={{ aspectRatio: "4/3" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={todayRecord.photoBase64} alt="check-in photo" className="w-full h-full object-cover" />
                                    <div
                                        className="absolute inset-0"
                                        style={{ background: "linear-gradient(transparent 55%, rgba(0,0,0,0.7) 100%)" }}
                                    />
                                    <div className="absolute bottom-0 inset-x-0 p-4">
                                        <p className="text-white font-bold text-base">{todayRecord.staffName}</p>
                                        <div className="flex items-center gap-1 text-white/80 mt-0.5">
                                            <MapPin size={11} />
                                            <p className="text-xs">{todayRecord.locationLabel}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 flex justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400">Check-in time</p>
                                        <p className="text-sm font-bold text-gray-900">{todayRecord.time}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Date</p>
                                        <p className="text-sm font-bold text-gray-900">
                                            {new Date(todayRecord.date + "T00:00:00").toLocaleDateString("en-IN", {
                                                day: "numeric", month: "short",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* If alreadyCheckedIn but todayRecord not yet loaded */}
                    {phase === "already" && !todayRecord && (
                        <motion.div key="already-loading" className="flex justify-center pt-16">
                            <Loader2 size={32} style={{ color: "#B5122E" }} className="animate-spin" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* spin keyframe */}
            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
