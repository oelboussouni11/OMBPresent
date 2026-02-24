"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
}

interface Stats {
  total_members: number;
  present_today: number;
  absent_today: number;
  avg_rate: number;
  daily: Record<string, number>;
  recent: { name: string; time: string; confidence: number }[];
  group_name: string;
  group_description: string;
}

export default function GroupDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const groupId = params.id;
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "members">(
    "overview",
  );

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/groups/${groupId}/members`);
      const data = await res.json();
      if (data.status === "success") setMembers(data.data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  }, [groupId]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/groups/${groupId}/stats`);
      const data = await res.json();
      if (data.status === "success") setStats(data.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, [groupId]);

  useEffect(() => {
    fetchMembers();
    fetchStats();
  }, [fetchMembers, fetchStats]);

  const handleOpenAdd = () => {
    setShowAdd(true);
    setFirstName("");
    setLastName("");
  };

  const handleStartScan = () => {
    if (firstName.trim().length < 1 || lastName.trim().length < 1) return;
    router.push(
      `/dashboard/group/${groupId}/enroll?first=${encodeURIComponent(firstName.trim())}&last=${encodeURIComponent(lastName.trim())}`,
    );
    setShowAdd(false);
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxDaily = stats
    ? Math.max(...days.map((d) => stats.daily[d] || 0), 1)
    : 1;

  return (
    <div className="min-h-screen bg-[#0A0A0B] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
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
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="bg-white/[0.05] border border-white/10 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/[0.08] hover:border-white/20 transition-all"
            >
              + Add Member
            </button>
            <Link
              href={`/attend?group=${groupId}`}
              className="bg-emerald-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-emerald-600 transition-all duration-300"
            >
              Start Attendance
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Group header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {stats?.group_name || "Group"}
          </h1>
          {stats?.group_description && (
            <p className="mt-1 text-gray-500 text-sm">
              {stats.group_description}
            </p>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Total Members",
              value: stats?.total_members || 0,
              color: "text-white",
            },
            {
              label: "Present Today",
              value: stats?.present_today || 0,
              color: "text-emerald-400",
            },
            {
              label: "Absent Today",
              value: stats?.absent_today || 0,
              color: "text-red-400",
            },
            {
              label: "Avg. Rate",
              value: `${stats?.avg_rate || 0}%`,
              color: "text-teal-400",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-5"
            >
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                {kpi.label}
              </div>
              <div className={`mt-2 text-3xl font-bold ${kpi.color}`}>
                {kpi.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-white/[0.03] border border-white/10 rounded-full p-1 w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "overview" ? "bg-emerald-500 text-white" : "text-gray-500 hover:text-gray-300"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "members" ? "bg-emerald-500 text-white" : "text-gray-500 hover:text-gray-300"}`}
          >
            Members ({members.length})
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Weekly Chart */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-6">
                This Week
              </h3>
              <div className="flex items-end gap-3 h-40">
                {days.map((day) => {
                  const count = stats?.daily[day] || 0;
                  const height = (count / maxDaily) * 100;
                  return (
                    <div
                      key={day}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <span className="text-[10px] text-gray-500 font-mono">
                        {count}
                      </span>
                      <div
                        className="w-full rounded-t-md bg-white/[0.06] relative"
                        style={{ height: "100%" }}
                      >
                        <div
                          className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-teal-500 transition-all duration-700"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-600">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-6">
                Recent Activity
              </h3>
              {stats?.recent && stats.recent.length > 0 ? (
                <div className="space-y-3">
                  {stats.recent.map((r, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold">
                        {r.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">
                          {r.name}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {r.time}
                        </div>
                      </div>
                      <div className="text-xs font-mono text-emerald-400">
                        {(r.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-600">No activity today</p>
                  <p className="text-xs text-gray-700 mt-1">
                    Start attendance to see results here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <>
            {members.length === 0 ? (
              <div className="text-center py-32">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <svg
                    width="28"
                    height="28"
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
                <h3 className="text-lg font-semibold text-white">
                  No members yet
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Add members with face enrollment to start tracking
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg font-bold">
                      {member.first_name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {member.first_name} {member.last_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Enrolled{" "}
                        {new Date(member.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add member modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-[#141415] border border-white/10 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-6">
              Add New Member
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Omar"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. El Boussouni"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 rounded-full text-sm font-medium text-gray-400 border border-white/10 hover:border-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStartScan}
                disabled={
                  firstName.trim().length < 1 || lastName.trim().length < 1
                }
                className="flex-1 bg-emerald-500 text-white py-3 rounded-full text-sm font-semibold hover:bg-emerald-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next: Face Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
