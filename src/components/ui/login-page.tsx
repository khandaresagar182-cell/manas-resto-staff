"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChefHat,
    Users,
    ArrowLeft,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    User,
    UserPlus,
    Mail,
    Phone,
    Briefcase,
} from "lucide-react";
import { useAuth, type UserRole } from "@/lib/auth-context";
import {
    getStoredUsers,
    saveStoredUsers,
    type StoredUser,
} from "@/lib/storage";
import type { Staff } from "@/lib/types";

// ── Brand colors ──────────────────────────────────────────────
const BRAND = {
    red: "#B5122E",
    darkRed: "#8B0D22",
    brightRed: "#D41535",
    redGlow: "rgba(181,18,46,0.3)",
    bgGradient: "linear-gradient(160deg, #8B0D22 0%, #B5122E 50%, #D41535 100%)",
};

type LoginStep = "role-select" | "login" | "register";

export function LoginPage() {
    const { loginWithUser } = useAuth();
    const [step, setStep] = useState<LoginStep>("role-select");
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

    const [selectedUserId, setSelectedUserId] = useState("");
    const [pin, setPin] = useState("");
    const [showPin, setShowPin] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [regName, setRegName] = useState("");
    const [regRole, setRegRole] = useState("");
    const [regDept, setRegDept] = useState("Kitchen");
    const [regEmail, setRegEmail] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regPin, setRegPin] = useState("");
    const [regConfirmPin, setRegConfirmPin] = useState("");
    const [showRegPin, setShowRegPin] = useState(false);

    const existingUsers = useMemo(() => {
        const all = getStoredUsers();
        if (!selectedRole) return all;
        return all.filter((u) => u.role === selectedRole);
    }, [selectedRole, step]);

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setError("");
        const users = getStoredUsers().filter((u) => u.role === role);
        setStep(users.length > 0 ? "login" : "register");
    };

    const handleBack = () => {
        setStep("role-select");
        setSelectedRole(null);
        setPin("");
        setSelectedUserId("");
        setError("");
        resetRegFields();
    };

    const resetRegFields = () => {
        setRegName(""); setRegRole(""); setRegDept("Kitchen");
        setRegEmail(""); setRegPhone(""); setRegPin(""); setRegConfirmPin("");
    };

    const handleLogin = async () => {
        if (!selectedUserId) { setError("Please select your account"); return; }
        const users = getStoredUsers();
        const user = users.find((u) => u.id === selectedUserId);
        if (!user) { setError("Account not found"); return; }
        if (pin !== user.pin) { setError("Incorrect PIN"); setPin(""); return; }
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        const staffUser: Staff = { id: user.id, name: user.name, role: user.staffRole, department: user.department, avatar: user.avatar, email: user.email, phone: user.phone };
        loginWithUser(staffUser, user.role);
    };

    const handleRegister = async () => {
        if (!regName.trim()) { setError("Please enter your full name"); return; }
        if (!regPin || regPin.length < 4) { setError("PIN must be 4 digits"); return; }
        if (regPin !== regConfirmPin) { setError("PINs do not match"); return; }
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        const initials = regName.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
        const newUser: StoredUser = {
            id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: regName.trim(), pin: regPin, role: selectedRole!,
            staffRole: regRole.trim() || (selectedRole === "chef" ? "Head Chef" : "Staff"),
            department: regDept, avatar: initials || "U",
            email: regEmail.trim(), phone: regPhone.trim(),
        };
        const users = getStoredUsers();
        users.push(newUser);
        saveStoredUsers(users);
        const staffUser: Staff = { id: newUser.id, name: newUser.name, role: newUser.staffRole, department: newUser.department, avatar: newUser.avatar, email: newUser.email, phone: newUser.phone };
        loginWithUser(staffUser, selectedRole!);
    };

    const handlePinKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") { if (step === "login") handleLogin(); else if (step === "register") handleRegister(); }
    };

    // ── Shared input style ────────────────────────────────────
    const inputStyle = {
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.2)",
        outline: "none",
    };
    const errorInputStyle = {
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.5)",
        outline: "none",
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center overflow-auto"
            style={{ background: BRAND.bgGradient }}
        >
            {/* Decorative blobs */}
            <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)" }} />
            <div className="absolute top-16 left-10 w-28 h-28 rounded-full border" style={{ borderColor: "rgba(255,255,255,0.07)" }} />
            <div className="absolute bottom-24 right-8 w-16 h-16 rounded-full border" style={{ borderColor: "rgba(255,255,255,0.07)" }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[400px] px-6 relative z-10 py-8"
            >
                {/* Logo + Title */}
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col items-center mb-8">
                    <div
                        className="w-20 h-20 rounded-full mb-4 flex items-center justify-center"
                        style={{ background: "#ffffff", boxShadow: "0 12px 40px rgba(0,0,0,0.3), 0 0 0 3px rgba(255,255,255,0.4)", padding: "6px" }}
                    >
                        <Image src="/logo.png" alt="Manas Resto" width={68} height={68} className="w-full h-full object-contain rounded-full" priority />
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Manas Resto</h1>
                    <p className="text-white/50 text-xs mt-1 tracking-widest uppercase">Staff Management</p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {/* ── ROLE SELECT ── */}
                    {step === "role-select" && (
                        <motion.div key="role-select" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                            <div
                                className="rounded-2xl p-5 mb-4"
                                style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
                            >
                                <h2 className="text-base font-bold text-white text-center mb-1">Welcome Back</h2>
                                <p className="text-white/50 text-sm text-center mb-5">Select your role to continue</p>
                                <div className="space-y-3">
                                    <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} onClick={() => handleRoleSelect("chef")}
                                        className="w-full rounded-xl p-4 text-left"
                                        style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
                                                <ChefHat size={22} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white">Head Chef</h3>
                                                <p className="text-xs text-white/50 mt-0.5">Manage roster & assign duties</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                    <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} onClick={() => handleRoleSelect("staff")}
                                        className="w-full rounded-xl p-4 text-left"
                                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.12)" }}>
                                                <Users size={22} className="text-white/80" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white">Staff Member</h3>
                                                <p className="text-xs text-white/50 mt-0.5">View your assigned duties</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── LOGIN ── */}
                    {step === "login" && (
                        <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            <button onClick={handleBack} className="flex items-center gap-1.5 text-white/60 text-sm mb-5 hover:text-white transition-colors">
                                <ArrowLeft size={16} />Back
                            </button>
                            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                                <h2 className="text-base font-bold text-white mb-1">{selectedRole === "chef" ? "Chef Login" : "Staff Login"}</h2>
                                <p className="text-white/50 text-sm mb-5">Select your account and enter PIN</p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[11px] font-semibold text-white/60 mb-1.5 block"><User size={11} className="inline mr-1" />Your Account</label>
                                        <select value={selectedUserId} onChange={(e) => { setSelectedUserId(e.target.value); setError(""); }} className="w-full rounded-xl px-4 py-3.5 text-sm font-medium text-white appearance-none cursor-pointer" style={inputStyle}>
                                            <option value="" style={{ background: BRAND.darkRed }}>— Select your account —</option>
                                            {existingUsers.map((u) => (<option key={u.id} value={u.id} style={{ background: BRAND.darkRed }}>{u.name} — {u.staffRole}</option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-white/60 mb-1.5 block"><Lock size={11} className="inline mr-1" />Enter PIN</label>
                                        <div className="relative">
                                            <input type={showPin ? "text" : "password"} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }} onKeyDown={handlePinKeyDown} placeholder="• • • •" maxLength={4}
                                                className="w-full rounded-xl px-4 py-3.5 text-sm font-medium text-white text-center tracking-[0.5em] placeholder:tracking-[0.3em]"
                                                style={error ? errorInputStyle : inputStyle} />
                                            <button onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors" type="button">
                                                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <AnimatePresence>{error && (<motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-white/80 text-center bg-white/10 rounded-lg py-2">{error}</motion.p>)}</AnimatePresence>
                                    <motion.button whileTap={{ scale: 0.97 }} onClick={handleLogin} disabled={isLoading}
                                        className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                                        style={{ background: "white", color: BRAND.red }}>
                                        {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" /> : <><LogIn size={16} />Sign In</>}
                                    </motion.button>
                                    <div className="text-center">
                                        <button onClick={() => { setStep("register"); setError(""); setPin(""); }} className="text-xs text-white/50 hover:text-white transition-colors">
                                            New here? <span className="font-semibold underline">Create Account</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── REGISTER ── */}
                    {step === "register" && (
                        <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            <button onClick={handleBack} className="flex items-center gap-1.5 text-white/60 text-sm mb-5 hover:text-white transition-colors">
                                <ArrowLeft size={16} />Back
                            </button>
                            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                                <h2 className="text-base font-bold text-white mb-1">{selectedRole === "chef" ? "Create Chef Account" : "Create Staff Account"}</h2>
                                <p className="text-white/50 text-sm mb-5">Register to access the system</p>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[11px] font-semibold text-white/60 mb-1.5 block"><User size={11} className="inline mr-1" />Full Name *</label>
                                        <input type="text" value={regName} onChange={(e) => { setRegName(e.target.value); setError(""); }} placeholder="Enter your full name" className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-white/30" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-white/60 mb-1.5 block"><Briefcase size={11} className="inline mr-1" />Position / Role</label>
                                        <input type="text" value={regRole} onChange={(e) => setRegRole(e.target.value)} placeholder={selectedRole === "chef" ? "e.g. Head Chef" : "e.g. Server, Line Cook"} className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-white/30" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-white/60 mb-1.5 block">Department</label>
                                        <select value={regDept} onChange={(e) => setRegDept(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white appearance-none cursor-pointer" style={inputStyle}>
                                            {["Kitchen", "Service", "Bar", "Front Desk"].map((d) => (<option key={d} value={d} style={{ background: BRAND.darkRed }}>{d}</option>))}
                                        </select>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="text-[11px] font-semibold text-white/60 mb-1.5 block"><Mail size={11} className="inline mr-1" />Email</label>
                                            <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="email" className="w-full rounded-xl px-3 py-3 text-sm font-medium text-white placeholder:text-white/30" style={inputStyle} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[11px] font-semibold text-white/60 mb-1.5 block"><Phone size={11} className="inline mr-1" />Phone</label>
                                            <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="phone" className="w-full rounded-xl px-3 py-3 text-sm font-medium text-white placeholder:text-white/30" style={inputStyle} />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="text-[11px] font-semibold text-white/60 mb-1.5 block"><Lock size={11} className="inline mr-1" />Set PIN *</label>
                                            <div className="relative">
                                                <input type={showRegPin ? "text" : "password"} value={regPin} onChange={(e) => { setRegPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }} placeholder="4 digits" maxLength={4}
                                                    className="w-full rounded-xl px-3 py-3 text-sm font-medium text-white text-center tracking-widest placeholder:tracking-normal placeholder:text-white/30" style={inputStyle} />
                                                <button onClick={() => setShowRegPin(!showRegPin)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70" type="button">
                                                    {showRegPin ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[11px] font-semibold text-white/60 mb-1.5 block">Confirm PIN *</label>
                                            <input type={showRegPin ? "text" : "password"} value={regConfirmPin} onChange={(e) => { setRegConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }} onKeyDown={handlePinKeyDown} placeholder="4 digits" maxLength={4}
                                                className="w-full rounded-xl px-3 py-3 text-sm font-medium text-white text-center tracking-widest placeholder:tracking-normal placeholder:text-white/30" style={inputStyle} />
                                        </div>
                                    </div>
                                    <AnimatePresence>{error && (<motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-white/80 text-center bg-white/10 rounded-lg py-2">{error}</motion.p>)}</AnimatePresence>
                                    <motion.button whileTap={{ scale: 0.97 }} onClick={handleRegister} disabled={isLoading}
                                        className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                                        style={{ background: "white", color: BRAND.red }}>
                                        {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" /> : <><UserPlus size={16} />Create Account & Sign In</>}
                                    </motion.button>
                                    {existingUsers.length > 0 && (
                                        <div className="text-center">
                                            <button onClick={() => { setStep("login"); setError(""); resetRegFields(); }} className="text-xs text-white/50 hover:text-white transition-colors">
                                                Already registered? <span className="font-semibold underline">Sign In</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
