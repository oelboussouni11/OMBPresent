"use client";

import { Suspense } from "react";
import { useRef, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface AttendanceEntry {
  name: string;
  confidence: number;
  timestamp: string;
  already_marked?: boolean;
}

function AttendContent() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("group");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [log, setLog] = useState<AttendanceEntry[]>([]);
  const [sending, setSending] = useState(false);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }
    startCamera();
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    if (!groupId) return;
    fetch(`${API_URL}/groups/${groupId}/attendance`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setLog(data.data);
      })
      .catch(console.error);
  }, [groupId]);

  const captureAndRecognize = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || sending || !groupId) return;
    setSending(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          setSending(false);
          return;
        }

        const formData = new FormData();
        formData.append("image", blob, "face.jpg");

        try {
          const res = await fetch(`${API_URL}/groups/${groupId}/recognize`, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.status === "success") {
            const entry = data.data as AttendanceEntry;
            setLastResult(entry.name);
            if (!entry.already_marked) {
              setLog((prev) => {
                const exists = prev.find((e) => e.name === entry.name);
                if (exists) return prev;
                return [entry, ...prev];
              });
            }
          } else {
            setLastResult(null);
          }
        } catch (err) {
          console.error("Recognition error:", err);
        }
        setSending(false);
      },
      "image/jpeg",
      0.8,
    );
  }, [sending, groupId]);

  useEffect(() => {
    if (!cameraReady || !scanning) return;
    const interval = setInterval(captureAndRecognize, 1500);
    return () => clearInterval(interval);
  }, [cameraReady, scanning, captureAndRecognize]);

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (!groupId) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">No group selected</h1>
          <p className="mt-2 text-gray-500 text-sm">
            Go to your dashboard and select a group first
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-emerald-400 text-sm hover:underline"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col md:flex-row overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <Link
          href={`/dashboard/group/${groupId}`}
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-200 z-10"
          onClick={stopCamera}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          Back to Group
        </Link>
        <div className="relative z-10 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Attendance Scanner
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Faces are recognized automatically
          </p>
        </div>
        <div className="relative z-10 w-80 h-80 md:w-[400px] md:h-[400px]">
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-emerald-500/50 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-emerald-500/50 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-emerald-500/50 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-emerald-500/50 rounded-br-lg" />
          <div className="absolute inset-2 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {scanning && (
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-scan-line" />
            )}
          </div>
          {lastResult && (
            <div className="absolute bottom-4 left-4 right-4 bg-emerald-500/90 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center gap-3 z-10">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                {lastResult[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {lastResult}
                </div>
                <div className="text-xs text-emerald-100">Recognized</div>
              </div>
              <svg
                className="ml-auto"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M5 12l5 5l10 -10" />
              </svg>
            </div>
          )}
        </div>
        <div className="relative z-10 mt-8 flex items-center gap-4">
          <button
            onClick={() => setScanning(!scanning)}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${scanning ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"}`}
          >
            {scanning ? "Pause Scanning" : "Resume Scanning"}
          </button>
        </div>
      </div>
      <div className="w-full md:w-96 bg-white/[0.02] border-l border-white/5 flex flex-col">
        <div className="px-6 py-5 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              Today&apos;s Attendance
            </h2>
            <span className="text-xs text-gray-500 font-mono">
              {log.length} recorded
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {log.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-gray-600"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                No attendance recorded yet
              </p>
              <p className="text-xs text-gray-700 mt-1">
                Faces will appear here when recognized
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {log.map((entry, i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-sm font-bold">
                    {entry.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {entry.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(entry.timestamp)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-emerald-400">
                      {(entry.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-gray-600">confidence</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Attend() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AttendContent />
    </Suspense>
  );
}
