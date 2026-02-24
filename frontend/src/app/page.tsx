"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="bg-[#FAFAFA] text-[#1d1d1f] overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                <path d="M3 21v-2a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              OMBPresent
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a
              href="#how-it-works"
              className="hover:text-gray-900 transition-colors duration-200"
            >
              How it Works
            </a>
            <a
              href="#features"
              className="hover:text-gray-900 transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#metrics"
              className="hover:text-gray-900 transition-colors duration-200"
            >
              Dashboard
            </a>
          </div>
          <Link
            href={session ? "/dashboard" : "/login"}
            className="bg-[#1d1d1f] text-white text-sm px-5 py-2.5 rounded-full font-medium hover:bg-[#333] transition-colors duration-200"
          >
            {session ? "Dashboard" : "Get Started"}
          </Link>
        </div>
      </nav>

      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-100/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-8 shadow-sm animate-fade-in-up">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-gray-600">
              AI-Powered Attendance Tracking
            </span>
          </div>
          <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold tracking-tight leading-[1.05] max-w-5xl animate-fade-in-up animation-delay-100">
            Lost your badge again?
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Good thing you brought your face.
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            OMBPresent uses AI face recognition to detect, verify, and log
            attendance in real time. Create groups, enroll members, and track
            everything — automatically.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
            <Link
              href={session ? "/dashboard" : "/login"}
              className="group bg-[#1d1d1f] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#333] transition-all duration-300 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5"
            >
              {session ? "Go to Dashboard" : "Start Free"}
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <a
              href="#how-it-works"
              className="bg-white border border-gray-200 px-8 py-4 rounded-full text-sm font-semibold hover:border-gray-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              See How It Works
            </a>
          </div>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            {[
              { value: "<500ms", label: "Recognition speed" },
              { value: "97%", label: "Accuracy rate" },
              { value: "5s", label: "Face enrollment" },
              { value: "0", label: "Manual check-ins" },
            ].map((kpi) => (
              <div key={kpi.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {kpi.value}
                </div>
                <div className="mt-1 text-xs text-gray-400 font-medium">
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
              How It Works
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
              Three steps. Zero friction.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create a Group",
                description:
                  "Sign in with Google and create groups for your classes, teams, or departments. Add a name and description — that's it.",
                icon: (
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Enroll Faces",
                description:
                  "Add members and guide them through our circle face scan. 8 captures from different angles in under 30 seconds — done.",
                icon: (
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20c0-2.21 2.24-4 5-4s5 1.79 5 4" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Track Attendance",
                description:
                  "Start the attendance scanner for any group. The AI recognizes faces in real time and logs who's present — no manual work.",
                icon: (
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                    <path d="M9 3h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1" />
                    <path d="M9 14l2 2l4 -4" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative bg-white rounded-2xl p-8 border border-gray-200/80 hover:border-gray-300 transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all duration-300">
                    {item.icon}
                  </div>
                  <span className="text-5xl font-bold text-gray-100 group-hover:text-emerald-100 transition-colors duration-300">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-32 px-6 bg-[#1d1d1f] text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-sm font-semibold text-emerald-400 tracking-widest uppercase">
              Features
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
              Everything you need to track attendance.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Google Sign-In",
                desc: "Secure authentication with your Google account. Your data is private — only you can access your groups and members.",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                ),
              },
              {
                title: "Circle Face Enrollment",
                desc: "Guided face scanning captures 8 angles in under 30 seconds. A visual progress ring shows completion in real time.",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20c0-2.21 2.24-4 5-4s5 1.79 5 4" />
                  </svg>
                ),
              },
              {
                title: "Multi-Group Management",
                desc: "Create unlimited groups — classes, teams, departments. Each group has its own members and attendance records.",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                  </svg>
                ),
              },
              {
                title: "Real-Time Recognition",
                desc: "The attendance scanner continuously detects faces and matches them against enrolled members. Results appear instantly.",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2-2v-2" />
                    <circle cx="12" cy="11" r="3" />
                    <path d="M8 18c0-2.21 1.79-4 4-4s4 1.79 4 4" />
                  </svg>
                ),
              },
              {
                title: "Smart Deduplication",
                desc: "Each person is only marked once per day. No duplicate entries, no manual cleanup needed.",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                    <path d="M9 14l2 2l4 -4" />
                  </svg>
                ),
              },
              {
                title: "Live Attendance Feed",
                desc: "Watch attendance populate in real time with names, timestamps, and confidence scores as people are recognized.",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M4 19h16M4 15l4-6 4 2 4-5 4 4" />
                  </svg>
                ),
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group bg-white/[0.05] backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="metrics" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
              Dashboard
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
              Your command center.
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Manage groups, track members, and monitor attendance — all from
              one place.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-4 text-xs text-gray-400 font-mono">
                OMBPresent Dashboard
              </span>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600" />
                  <span className="text-sm font-semibold">OMBPresent</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-200" />
                  <span className="text-xs text-gray-400">user@email.com</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-lg font-bold">Your Groups</div>
                  <div className="text-xs text-gray-400">
                    3 groups, 47 members total
                  </div>
                </div>
                <div className="bg-emerald-500 text-white text-xs px-4 py-2 rounded-full font-medium">
                  + New Group
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Computer Science 101",
                    desc: "Mon & Wed, 9AM-11AM",
                    members: 24,
                  },
                  {
                    name: "Marketing Team",
                    desc: "Daily standup, 10AM",
                    members: 12,
                  },
                  {
                    name: "Physics Lab B",
                    desc: "Thursday, 2PM-5PM",
                    members: 11,
                  },
                ].map((g) => (
                  <div
                    key={g.name}
                    className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#059669"
                          strokeWidth="2"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                    <div className="text-sm font-semibold">{g.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {g.desc}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-3 font-mono">
                      {g.members} members
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
                Enrollment
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Face scanning,
                <br />
                <span className="text-gray-400">done right.</span>
              </h2>
              <p className="mt-6 text-gray-500 leading-relaxed">
                Our guided enrollment walks users through a smooth face capture
                process. A circular interface tracks progress as you rotate your
                head, capturing 8 angles for maximum recognition accuracy.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                {[
                  "Guided rotation with real-time visual feedback",
                  "8 captures from different angles in under 30 seconds",
                  "Duplicate detection — no double entries",
                  "Encrypted face encodings — no raw photos stored",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12l5 5l10 -10" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href={session ? "/dashboard" : "/login"}
                className="mt-8 inline-block group bg-[#1d1d1f] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#333] transition-all duration-300"
              >
                Try It Now
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 border border-gray-200" />
                <svg
                  className="absolute inset-0 w-full h-full -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="url(#grad2)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="301.6"
                    strokeDashoffset="60"
                    className="animate-enrollment-progress"
                  />
                  <defs>
                    <linearGradient
                      id="grad2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="50%" stopColor="#0D9488" />
                      <stop offset="100%" stopColor="#0891B2" />
                    </linearGradient>
                  </defs>
                </svg>
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * 45 * Math.PI) / 180;
                  const isCompleted = i < 6;
                  return (
                    <div
                      key={i}
                      className={`absolute w-2.5 h-2.5 rounded-full transition-all duration-500 ${isCompleted ? "bg-emerald-500 shadow-sm shadow-emerald-300" : "bg-gray-300"}`}
                      style={{
                        top: `${50 - 46 * Math.cos(angle)}%`,
                        left: `${50 + 46 * Math.sin(angle)}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  );
                })}
                <div className="absolute inset-10 md:inset-14 rounded-full bg-white border border-gray-200 flex flex-col items-center justify-center shadow-inner">
                  <svg
                    className="w-16 h-16 md:w-20 md:h-20 text-gray-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                  <span className="mt-1 text-xs font-medium text-gray-400">
                    Rotate slowly...
                  </span>
                  <span className="mt-1 text-xs font-semibold text-emerald-600">
                    75% complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
              Use Cases
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
              Built for everyone.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Universities",
                desc: "Track student attendance per class. Create a group for each course, enroll students once, and run attendance every lecture.",
              },
              {
                title: "Companies",
                desc: "Monitor team presence across departments. Perfect for office check-ins, meeting attendance, and shift tracking.",
              },
              {
                title: "Events",
                desc: "Register attendees beforehand and scan faces at the door. Real-time feed shows who arrived and when.",
              },
            ].map((uc) => (
              <div
                key={uc.title}
                className="bg-white rounded-2xl p-8 border border-gray-200/80 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-500"
              >
                <h3 className="text-xl font-semibold">{uc.title}</h3>
                <p className="mt-3 text-gray-500 text-sm leading-relaxed">
                  {uc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#1d1d1f] to-[#2d2d30] rounded-3xl p-16 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                Ready to automate attendance?
              </h2>
              <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
                Sign in with Google, create your first group, and start
                recognizing faces in minutes.
              </p>
              <Link
                href={session ? "/dashboard" : "/login"}
                className="mt-10 inline-block group bg-white text-[#1d1d1f] px-10 py-4 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                {session ? "Go to Dashboard" : "Get Started Free"}
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                <path d="M3 21v-2a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <span className="text-sm font-semibold">OMBPresent</span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; 2026 OMBPresent. Built by Omar El Boussouni.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a
              href="https://github.com/oelboussouni11/OMBPresent"
              className="hover:text-gray-900 transition-colors"
              target="_blank"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
