"use client";

import { usePathname } from "next/navigation";
import { LogOut, User, Bell, CheckCheck, Search, ChevronRight, Sparkles, Award } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  getNotificationsAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
} from "@/actions/notifications";
import type { Notification } from "@prisma/client";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    plan?: string | null;
    isEarlyAdopter?: boolean;
    premiumExpiresAt?: Date | string | null;
    avatarSource?: string;
    customAvatar?: string | null;
    googleAvatarUrl?: string | null;
    githubAvatarUrl?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsAction();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await markNotificationAsReadAction(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await markAllNotificationsAsReadAction();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "Overview";
      case "/dashboard/intelligence":
        return "Developer Intelligence";
      case "/dashboard/github":
        return "GitHub Intelligence";
      case "/dashboard/readiness":
        return "Readiness & Skills";
      case "/dashboard/resume":
        return "Resume Analysis";
      case "/dashboard/skills":
        return "Skill Gaps";
      case "/dashboard/roadmap":
        return "Career Roadmap";
      case "/dashboard/career-coach":
        return "AI Career Coach";
      case "/dashboard/portfolio":
        return "Portfolio Audit";
      case "/dashboard/projects":
        return "Projects & Code";
      case "/dashboard/interview":
        return "Interview Prep";
      case "/dashboard/rankings":
        return "Rankings & Leaderboard";
      case "/dashboard/settings":
        return "Settings";
      case "/dashboard/billing":
        return "Billing & Plans";
      case "/dashboard/recruiter":
        return "Recruiter Portal";
      case "/dashboard/admin":
        return "Admin Dashboard";
      default:
        return "Console";
    }
  };

  const title = getPageTitle(pathname);

  const getNotificationLink = (type: string) => {
    switch (type) {
      case "ROADMAP":
        return "/dashboard/roadmap";
      case "SCORE_IMPROVEMENT":
        return "/dashboard";
      case "ACHIEVEMENT":
        return "/dashboard";
      case "PROFILE_UPDATE":
        return "/dashboard/settings";
      default:
        return "/dashboard";
    }
  };

  const avatarSrc = (() => {
    const source = user.avatarSource || "INITIALS";
    if (source === "CUSTOM" && user.customAvatar) return user.customAvatar;
    if (source === "GOOGLE" && user.googleAvatarUrl) return user.googleAvatarUrl;
    if (source === "GITHUB" && user.githubAvatarUrl) return user.githubAvatarUrl;
    return user.image || "/avatar-sample.png";
  })();

  const initials = (() => {
    if (!user.name) return "U";
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  })();

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-surface/80 backdrop-blur-xl border-b border-border shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex items-center justify-between px-6 md:px-8 print:hidden transition-colors">
      {/* Left Area: Breadcrumbs + ⌘K Search Bar */}
      <div className="flex items-center gap-6 flex-1 max-w-2xl min-w-0">
        <div className="flex items-center gap-1.5 text-on-surface-variant text-xs shrink-0 font-medium">
          <Link href="/dashboard" className="hover:text-on-surface transition-colors">
            Platform
          </Link>
          <ChevronRight className="h-3 w-3 text-outline" />
          <span className="text-on-surface font-semibold">{title}</span>
        </div>

        {/* ⌘K Command Bar */}
        <div className="relative flex-1 hidden md:flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-outline pointer-events-none" />
          <input
            type="text"
            placeholder="⌘K to search intelligence, skills, actions..."
            className="w-full h-9 pl-9 pr-12 bg-surface-container-lowest border border-border rounded-lg text-on-surface text-xs placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-xs transition-all"
            id="global-command-search"
          />
          <kbd className="absolute right-2 font-mono text-[10px] text-outline bg-surface-container-high px-1.5 py-0.5 rounded border border-border/50">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Area: Telemetry Sync + Plan Badge + Notifications + User Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Telemetry Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low font-mono text-xs text-tertiary font-medium border border-border/60">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
          <span>AI Engine Synced</span>
        </div>

        {/* Founding Dev / Plan Badge */}
        {user.isEarlyAdopter ? (
          <Link
            href="/dashboard/billing"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-mono text-xs font-semibold hover:opacity-90 transition-opacity"
            title="Founding Developer (Early Adopter)"
          >
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            <span>Founding Dev</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/billing"
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-xs font-semibold hover:opacity-90 transition-opacity",
              user.plan === "PRO"
                ? "bg-primary-fixed text-on-primary-fixed"
                : "bg-surface-container-high text-on-surface-variant"
            )}
          >
            <Award className="h-3.5 w-3.5" />
            <span>{user.plan === "PRO" ? "Pro Member" : "Free Plan"}</span>
          </Link>
        )}

        {/* Notifications Popover */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-high focus:outline-none"
            title="Notifications"
            id="notifications-header-btn"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[9px] font-bold text-white ring-2 ring-surface">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 z-50 w-80 rounded-2xl border border-border bg-surface-container-lowest p-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-border pb-2.5 mb-3">
                <span className="text-xs font-semibold text-on-surface">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-60 overflow-y-auto space-y-2">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleMarkAsRead(n.id)}
                      className={cn(
                        "rounded-xl p-2.5 transition-colors border cursor-pointer",
                        n.read
                          ? "bg-surface-container-low border-transparent text-on-surface-variant"
                          : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                      )}
                    >
                      <Link href={getNotificationLink(n.type)} className="block">
                        <div className="flex items-start justify-between gap-1.5">
                          <span
                            className={cn(
                              "text-xs font-semibold leading-tight",
                              n.read ? "text-on-surface-variant" : "text-primary font-bold"
                            )}
                          >
                            {n.title}
                          </span>
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-0.5" />
                          )}
                        </div>
                        <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">
                          {n.message}
                        </p>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-outline italic">
                    No notifications yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="relative flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-primary/40 transition-all focus:outline-none cursor-pointer"
            id="profile-dropdown-btn"
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={user.name ?? "User"}
                width={32}
                height={32}
                unoptimized
                className="w-8 h-8 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-container-high text-on-surface font-semibold text-xs font-mono">
                {initials}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary ring-2 ring-white" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-border bg-surface-container-lowest p-3 shadow-xl z-50">
              <div className="px-2 py-2 border-b border-border mb-2">
                <p className="text-xs font-bold text-on-surface truncate">{user.name}</p>
                <p className="text-[11px] text-on-surface-variant truncate font-mono mt-0.5">
                  {user.email}
                </p>
              </div>

              {/* Status Section */}
              <div className="px-2 py-1.5 space-y-1.5 border-b border-border mb-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-outline">Tier:</span>
                  <span className="font-bold text-primary">
                    {user.plan === "PRO" ? "PRO MEMBER" : "FREE TIER"}
                  </span>
                </div>

                {user.isEarlyAdopter && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-secondary font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <span>💎</span> Founding Dev
                    </span>
                    <span className="text-[9px] bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded-full font-mono font-bold">
                      ACTIVE
                    </span>
                  </div>
                )}
              </div>

              {/* Actions Section */}
              <div className="space-y-1">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Profile & Settings</span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-2.5 w-full rounded-lg px-2.5 py-2 text-xs text-error hover:bg-error-container hover:text-on-error-container transition-colors text-left cursor-pointer font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
