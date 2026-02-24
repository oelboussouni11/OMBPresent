"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const TOTAL_SEGMENTS = 8;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function MemberEnroll() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const groupId = params.id;
  const firstName = searchParams.get("first") || "";
  const lastName = searchParams.get("last") || "";

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [completedSegments, setCompletedSegments] = useState(0);
  const [status, setStatus] = useState("Requesting camera access...");
  const [scanLineAngle, setScanLineAngle] = useState(0);
  const [sending, setSending] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [memberId, setMemberId] = useState<number | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
          setStatus("Rotate your head slowly");
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setStatus("Camera access denied");
      }
    }
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
      }
    };
  }, []);

  const captureAndSend = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || sending || enrolled) return;
    setSending(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setSending(false);
      return;
    }
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          setSending(false);
          return;
        }

        try {
          let res;
          if (memberId === null) {
            // First capture: create the member
            const formData = new FormData();
            formData.append("first_name", firstName);
            formData.append("last_name", lastName);
            formData.append("email", session?.user?.email || "");
            formData.append("image", blob, "face.jpg");
            res = await fetch(`${API_URL}/groups/${groupId}/members`, {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            if (data.status === "success") {
              setMemberId(data.data.id);
              setCompletedSegments(1);
            } else {
              setStatus(data.message || "No face detected — adjust position");
            }
          } else {
            // Subsequent captures: add more encodings
            const formData = new FormData();
            formData.append("image", blob, "face.jpg");
            res = await fetch(`${API_URL}/members/${memberId}/add-encoding`, {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            if (data.status === "success") {
              setCompletedSegments((prev) => {
                const next = prev + 1;
                if (next >= TOTAL_SEGMENTS) {
                  setStatus("Face enrolled successfully");
                  setEnrolled(true);
                  if (videoRef.current?.srcObject) {
                    const tracks = (
                      videoRef.current.srcObject as MediaStream
                    ).getTracks();
                    tracks.forEach((t) => t.stop());
                  }
                }
                return Math.min(next, TOTAL_SEGMENTS);
              });
            } else {
              setStatus(data.message || "No face detected — adjust position");
            }
          }
        } catch (err) {
          setStatus("Connection error");
        }
        setSending(false);
      },
      "image/jpeg",
      0.8,
    );
  }, [firstName, lastName, session, groupId, sending, enrolled, memberId]);

  // Auto-capture
  useEffect(() => {
    if (!cameraReady || enrolled) return;
    const interval = setInterval(captureAndSend, 750);
    return () => clearInterval(interval);
  }, [cameraReady, enrolled, captureAndSend]);

  // Rotating scan line
  useEffect(() => {
    if (!cameraReady || enrolled) return;
    const interval = setInterval(() => {
      setScanLineAngle((prev) => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [cameraReady, enrolled]);

  const progress = Math.round((completedSegments / TOTAL_SEGMENTS) * 100);
  const isComplete = completedSegments >= TOTAL_SEGMENTS;

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <canvas ref={canvasRef} className="hidden" />

      <Link
        href={`/dashboard/group/${groupId}`}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-200 z-10"
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
        Back
      </Link>

      {/* Status pill */}
      <div className="relative z-10 mb-8">
        <div
          className={`inline-flex items-center gap-2.5 rounded-full px-5 py-2 border ${isComplete ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white/[0.03] border-white/10"}`}
        >
          <div className="relative">
            <div
              className={`w-2 h-2 rounded-full ${isComplete ? "bg-emerald-400" : "bg-amber-400"}`}
            />
            {!isComplete && (
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>
          <span
            className={`text-xs font-medium tracking-wide ${isComplete ? "text-emerald-400" : "text-gray-400"}`}
          >
            {isComplete ? "ENROLLMENT COMPLETE" : "SCANNING IN PROGRESS"}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          {isComplete ? "All set!" : `Enrolling ${firstName}`}
        </h1>
        <p className="mt-3 text-gray-500 text-sm md:text-base">{status}</p>
      </div>

      {/* Scan circle */}
      <div className="relative z-10">
        <div
          className={`absolute inset-[-20px] rounded-full transition-all duration-1000 ${isComplete ? "bg-emerald-500/10 shadow-[0_0_80px_rgba(16,185,129,0.15)]" : "bg-emerald-500/[0.03] shadow-[0_0_60px_rgba(16,185,129,0.08)]"}`}
        />
        <div className="relative w-80 h-80 md:w-[380px] md:h-[380px]">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="49"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.3"
            />
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1.5"
              className="-rotate-90 origin-center"
            />
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="url(#scanGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="295.3"
              strokeDashoffset={295.3 - (295.3 * progress) / 100}
              className="-rotate-90 origin-center transition-all duration-700 ease-out"
            />
            {!isComplete && cameraReady && (
              <line
                x1="50"
                y1="50"
                x2={50 + 47 * Math.cos((scanLineAngle * Math.PI) / 180)}
                y2={50 + 47 * Math.sin((scanLineAngle * Math.PI) / 180)}
                stroke="url(#lineGradient)"
                strokeWidth="0.5"
                opacity="0.4"
              />
            )}
            <defs>
              <linearGradient
                id="scanGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="transparent" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
          </svg>

          {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => {
            const angle = (i * (360 / TOTAL_SEGMENTS) * Math.PI) / 180;
            const isCompleted = i < completedSegments;
            const isNext = i === completedSegments;
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  top: `${50 - 47 * Math.cos(angle)}%`,
                  left: `${50 + 47 * Math.sin(angle)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {isCompleted && (
                  <div className="absolute inset-[-4px] rounded-full bg-emerald-500/20 blur-sm" />
                )}
                <div
                  className={`relative w-2.5 h-2.5 rounded-full transition-all duration-500 ${isCompleted ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : isNext ? "bg-gray-500 animate-pulse" : "bg-gray-700"}`}
                />
              </div>
            );
          })}

          <div className="absolute inset-[18px] md:inset-[22px] rounded-full overflow-hidden">
            <div className="absolute inset-0 rounded-full border border-white/10 z-10 pointer-events-none" />
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.4)] pointer-events-none" />
          </div>

          {isComplete && (
            <div className="absolute inset-[18px] md:inset-[22px] rounded-full bg-emerald-950/60 backdrop-blur-md flex items-center justify-center z-20">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-scale-in">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5l10 -10" />
                  </svg>
                </div>
                <span className="mt-4 text-sm font-medium text-emerald-300">
                  Face Captured
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10 mt-12 w-80 md:w-[380px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-mono">
              {String(completedSegments).padStart(2, "0")}/
              {String(TOTAL_SEGMENTS).padStart(2, "0")}
            </span>
            <span className="text-xs text-gray-600">segments</span>
          </div>
          <span className="text-xs font-semibold text-emerald-400 font-mono">
            {progress}%
          </span>
        </div>
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-6 text-center">
          {isComplete ? (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => router.push(`/dashboard/group/${groupId}`)}
                className="group w-full bg-emerald-500 text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-emerald-600 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Done
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 text-gray-500">
              <svg
                className="animate-spin-slow"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M12 2v4m0 12v4m-10-10h4m12 0h4m-3.17-6.83l-2.83 2.83m-8 8l-2.83 2.83m0-13.66l2.83 2.83m8 8l2.83 2.83" />
              </svg>
              <span className="text-xs">
                Keep rotating slowly for best results
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
