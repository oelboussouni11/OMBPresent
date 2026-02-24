"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface Group {
  id: number;
  name: string;
  description: string;
  member_count: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(
        `${API_URL}/groups?email=${encodeURIComponent(session.user.email)}`,
      );
      const data = await res.json();
      if (data.status === "success") setGroups(data.data);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchGroups();
  }, [status, router, fetchGroups]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleCreate = async () => {
    if (newName.trim().length < 2 || !session?.user?.email) return;
    try {
      const res = await fetch(`${API_URL}/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDesc.trim(),
          user_email: session.user.email,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setGroups((prev) => [...prev, data.data]);
        setNewName("");
        setNewDesc("");
        setShowCreate(false);
      }
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  };

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
              >
                <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                <path d="M3 21v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              OMBPresent
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm text-gray-400">
                {session?.user?.name}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-xs text-gray-600 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Your Groups
            </h1>
            <p className="mt-1 text-gray-500 text-sm">
              Create groups and manage attendance
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-emerald-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-600 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            + New Group
          </button>
        </div>

        {showCreate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6">
            <div className="bg-[#141415] border border-white/10 rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-6">
                Create New Group
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Computer Science 101"
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="e.g. Monday & Wednesday, 9AM-11AM"
                    rows={3}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 rounded-full text-sm font-medium text-gray-400 border border-white/10 hover:border-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={newName.trim().length < 2}
                  className="flex-1 bg-emerald-500 text-white py-3 rounded-full text-sm font-semibold hover:bg-emerald-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        )}

        {groups.length === 0 ? (
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">No groups yet</h3>
            <p className="mt-1 text-sm text-gray-600">
              Create your first group to start tracking attendance
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <Link
                href={`/dashboard/group/${group.id}`}
                key={group.id}
                className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-700 group-hover:text-gray-400 transition-colors"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white">
                  {group.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {group.description || "No description"}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-gray-600 font-mono">
                    {group.member_count} members
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
