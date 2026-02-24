"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EnrollStart() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (name.trim().length < 2) return;
    router.push(`/enroll/scan?name=${encodeURIComponent(name.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            New Enrollment
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Enter the person&apos;s name to begin face scanning
          </p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="e.g. Omar El Boussouni"
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
            autoFocus
          />
          <button
            onClick={handleStart}
            disabled={name.trim().length < 2}
            className="mt-6 w-full bg-emerald-500 text-white py-3.5 rounded-full text-sm font-semibold hover:bg-emerald-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Start Face Scan
          </button>
        </div>
        <p className="mt-6 text-center text-xs text-gray-600">
          Face data is encrypted and stored securely. No raw photos are saved.
        </p>
      </div>
    </div>
  );
}
