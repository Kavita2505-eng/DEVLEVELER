"use client";

import { useState } from "react";
import { updateSettingsAction } from "@/actions/settings";
import {
  User,
  Loader2,
  Mail,
  Link2,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Copy,
  Palette,
  Upload,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import type { SettingsData } from "@/actions/settings";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function Twitter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

interface SettingsClientProps {
  initialSettings: SettingsData;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(initialSettings.name ?? "");
  const [username, setUsername] = useState(initialSettings.username ?? "");
  const [bio, setBio] = useState(initialSettings.bio ?? "");
  
  // Custom arrays as comma separated strings for easy editing
  const [careerGoalsText, setCareerGoalsText] = useState(
    initialSettings.careerGoals?.join(", ") ?? ""
  );
  const [customSkillsText, setCustomSkillsText] = useState(
    initialSettings.customSkills?.join(", ") ?? ""
  );

  // Social links
  const [linkedin, setLinkedin] = useState(
    initialSettings.connectedAccounts?.linkedin ?? ""
  );
  const [twitter, setTwitter] = useState(
    initialSettings.connectedAccounts?.twitter ?? ""
  );
  const [github, setGithub] = useState(
    initialSettings.connectedAccounts?.github ?? ""
  );

  // Notifications
  const [emailNotif, setEmailNotif] = useState(
    initialSettings.notificationPreferences?.email ?? true
  );
  const [reminders, setReminders] = useState(
    initialSettings.notificationPreferences?.reminders ?? true
  );
  const [weeklySum, setWeeklySum] = useState(
    initialSettings.notificationPreferences?.weeklySummary ?? true
  );

  // SaaS states
  const [isPublic, setIsPublic] = useState(initialSettings.isPublic ?? true);
  const [role, setRole] = useState(initialSettings.role ?? "DEVELOPER");
  const [plan, setPlan] = useState(initialSettings.plan ?? "FREE");
  const [copied, setCopied] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  // Theme & Appearance states
  const [theme, setTheme] = useState(initialSettings.theme || "default");
  const [themeAccentColor, setThemeAccentColor] = useState(initialSettings.themeAccentColor || "");
  const [themeTextColor, setThemeTextColor] = useState(initialSettings.themeTextColor || "");
  const [themeHighlightColor, setThemeHighlightColor] = useState(initialSettings.themeHighlightColor || "");

  // Avatar states
  const [avatarSource, setAvatarSource] = useState(initialSettings.avatarSource || "INITIALS");
  const [customAvatar, setCustomAvatar] = useState<string | null>(initialSettings.customAvatar || null);
  const googleAvatarUrl = initialSettings.googleAvatarUrl || null;
  const githubAvatarUrl = initialSettings.githubAvatarUrl || null;

  // Real-time theme visual shift preview
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      const themeClasses = [
        "theme-amoled", "theme-discord", "theme-cyberpunk", "theme-ocean",
        "theme-forest", "theme-sakura", "theme-lavender", "theme-peach",
        "theme-instagram", "theme-midnight"
      ];
      themeClasses.forEach(c => root.classList.remove(c));
      if (theme !== "default") {
        root.classList.add(`theme-${theme}`);
      }

      if (themeAccentColor) {
        root.style.setProperty("--accent", themeAccentColor);
        root.style.setProperty("--accent-hover", `${themeAccentColor}dd`);
      } else {
        root.style.removeProperty("--accent");
        root.style.removeProperty("--accent-hover");
      }

      if (themeTextColor) {
        root.style.setProperty("--foreground", themeTextColor);
      } else {
        root.style.removeProperty("--foreground");
      }

      if (themeHighlightColor) {
        root.style.setProperty("--accent-secondary", themeHighlightColor);
      } else {
        root.style.removeProperty("--accent-secondary");
      }
    }
  }, [theme, themeAccentColor, themeTextColor, themeHighlightColor]);

  // Client-side square-crop and compress WebP
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 120; // light square sizing
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
          
          const base64 = canvas.toDataURL("image/webp", 0.75); // WEBP compression (<10KB)
          setCustomAvatar(base64);
          setAvatarSource("CUSTOM");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProfileUrl(`${window.location.origin}/u/${username}`);
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    // Parse array inputs
    const careerGoals = careerGoalsText
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g !== "");
    const customSkills = customSkillsText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    const settingsData: SettingsData = {
      name,
      username: username.trim() !== "" ? username.trim().toLowerCase() : undefined,
      bio,
      careerGoals,
      customSkills,
      connectedAccounts: {
        linkedin: linkedin.trim(),
        twitter: twitter.trim(),
        github: github.trim(),
      },
      notificationPreferences: {
        email: emailNotif,
        reminders,
        weeklySummary: weeklySum,
      },
      isPublic,
      role,
      plan,
      theme,
      themeAccentColor: themeAccentColor || null,
      themeTextColor: themeTextColor || null,
      themeHighlightColor: themeHighlightColor || null,
      avatarSource,
      customAvatar,
    };

    try {
      const res = await updateSettingsAction(settingsData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.error ?? "Failed to save settings.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Profile configuration saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 rounded-lg border border-[var(--error-border)] bg-[var(--error-bg)] p-4 text-xs text-[var(--error)]">
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Side: General Profile, Skills, Goals */}
        <div className="lg:col-span-8 space-y-6">

          {/* Profile Branding & Avatar */}
          <div className="card-base p-6 space-y-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-[var(--foreground-secondary)]" /> Profile Branding & Avatar
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar Preview */}
              <div className="relative flex flex-col items-center justify-center shrink-0">
                {(() => {
                  const avatarPreviewSrc = (() => {
                    if (avatarSource === "CUSTOM" && customAvatar) return customAvatar;
                    if (avatarSource === "GOOGLE" && googleAvatarUrl) return googleAvatarUrl;
                    if (avatarSource === "GITHUB" && githubAvatarUrl) return githubAvatarUrl;
                    return null;
                  })();

                  const initials = (() => {
                    if (!name) return "U";
                    const parts = name.trim().split(/\s+/);
                    if (parts.length >= 2) {
                      return (parts[0][0] + parts[1][0]).toUpperCase();
                    }
                    return parts[0][0].toUpperCase();
                  })();

                  if (avatarSource !== "INITIALS" && avatarPreviewSrc) {
                    const isExternal = avatarPreviewSrc.startsWith("http");
                    return isExternal ? (
                      <NextImage
                        src={avatarPreviewSrc}
                        alt="Avatar Preview"
                        width={80}
                        height={80}
                        unoptimized
                        className="h-20 w-20 rounded-full border-2 border-[var(--border)] object-cover shadow-lg"
                      />
                    ) : (
                      <img
                        src={avatarPreviewSrc}
                        alt="Avatar Preview"
                        className="h-20 w-20 rounded-full border-2 border-[var(--border)] object-cover shadow-lg"
                      />
                    );
                  }

                  return (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)] text-2xl font-bold font-sans shadow-lg">
                      {initials}
                    </div>
                  );
                })()}
                
                <span className="mt-2 text-[9px] uppercase font-bold tracking-wider text-[var(--foreground-tertiary)] bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)]">
                  {avatarSource} Source
                </span>
              </div>

              {/* Upload & Source Controls */}
              <div className="flex-1 space-y-4 w-full">
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="flex flex-col items-center justify-center h-20 rounded-lg border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] cursor-pointer transition-all">
                    <Upload className="h-4.5 w-4.5 text-[var(--foreground-secondary)]" />
                    <span className="text-[10px] font-semibold text-[var(--foreground-secondary)] mt-1.5">
                      Upload Custom Avatar
                    </span>
                    <span className="text-[9px] text-[var(--foreground-tertiary)]">WEBP/PNG/JPG (&lt;15KB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setAvatarSource("INITIALS")}
                      className={cn(
                        "h-9 rounded-lg border text-xs font-semibold px-3 transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                        avatarSource === "INITIALS"
                          ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      Use Initial Monogram
                    </button>
                    
                    {googleAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarSource("GOOGLE")}
                        className={cn(
                          "h-9 rounded-lg border text-xs font-semibold px-3 transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                          avatarSource === "GOOGLE"
                            ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]"
                            : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)] hover:bg-[var(--surface-hover)]"
                        )}
                      >
                        <RotateCcw className="h-3 w-3" /> Reset Google Avatar
                      </button>
                    )}

                    {githubAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarSource("GITHUB")}
                        className={cn(
                          "h-9 rounded-lg border text-xs font-semibold px-3 transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                          avatarSource === "GITHUB"
                            ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]"
                            : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)] hover:bg-[var(--surface-hover)]"
                        )}
                      >
                        <RotateCcw className="h-3 w-3" /> Reset GitHub Avatar
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {customAvatar && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomAvatar(null);
                        setAvatarSource("INITIALS");
                      }}
                      className="flex items-center gap-1.5 text-[10px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove Custom Avatar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Form */}
          <div className="card-base p-6 space-y-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-[var(--foreground-secondary)]" /> General Profile
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground-secondary)]">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground-secondary)]">Public Username</label>
                <input
                  type="text"
                  placeholder="Letters, numbers, dashes (3-20 chars)..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors font-mono"
                  id="settings-username-input"
                />
                <p className="text-[9px] text-[var(--foreground-tertiary)]">
                  Setting this will enable your public developer profile at: /u/{username || "[username]"}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground-secondary)]">Bio / Summary</label>
              <textarea
                placeholder="Brief summary of your professional background, tech stacks, or engineering interests..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full min-h-[90px] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs leading-relaxed text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          {/* Theme & Branding */}
          <div className="card-base p-6 space-y-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
              <Palette className="h-4.5 w-4.5 text-[var(--foreground-secondary)]" /> Theme & Branding
            </h3>

            {/* Presets Grid */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-[var(--foreground-secondary)]">Choose UI Preset Theme</label>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                {[
                  { id: "default", name: "Default Dark", dots: ["bg-[#09090b]", "bg-[#3b82f6]", "bg-[#fafafa]"] },
                  { id: "amoled", name: "AMOLED Black", dots: ["bg-[#000000]", "bg-[#3b82f6]", "bg-[#fafafa]"] },
                  { id: "discord", name: "Discord Chat", dots: ["bg-[#313338]", "bg-[#5865f2]", "bg-[#ffffff]"] },
                  { id: "cyberpunk", name: "Cyberpunk", dots: ["bg-[#0b0714]", "bg-[#fcee0a]", "bg-[#ff0055]"] },
                  { id: "ocean", name: "Ocean Blue", dots: ["bg-[#020c1b]", "bg-[#0ea5e9]", "bg-[#06b6d4]"] },
                  { id: "forest", name: "Forest Green", dots: ["bg-[#05130f]", "bg-[#22c55e]", "bg-[#10b981]"] },
                  { id: "sakura", name: "Sakura Pink", dots: ["bg-[#18090f]", "bg-[#ff85a1]", "bg-[#f43f5e]"] },
                  { id: "lavender", name: "Lavender Dream", dots: ["bg-[#0a0614]", "bg-[#a78bfa]", "bg-[#8b5cf6]"] },
                  { id: "peach", name: "Peach Sunset", dots: ["bg-[#140b07]", "bg-[#f97316]", "bg-[#ea580c]"] },
                  { id: "instagram", name: "Instagram Warm", dots: ["bg-[#0f0a0c]", "bg-[#e1306c]", "bg-[#c13584]"] },
                  { id: "midnight", name: "Midnight Purple", dots: ["bg-[#02010a]", "bg-[#a855f7]", "bg-[#7e22ce]"] },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setTheme(p.id);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-between rounded-lg border p-3 bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-center transition-all cursor-pointer",
                      theme === p.id ? "border-[var(--accent)] ring-1 ring-[var(--accent)]" : "border-[var(--border)]"
                    )}
                  >
                    <span className="text-[10px] font-bold text-[var(--foreground)]">{p.name}</span>
                    <div className="flex gap-1 mt-2.5">
                      {p.dots.map((dotClass, dIdx) => (
                        <div key={dIdx} className={cn("h-3 w-3 rounded-full border border-white/10 shadow", dotClass)} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Overrides */}
            <div className="border-t border-[var(--border)] pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--foreground-secondary)]">Custom Color Calibration</span>
                {(themeAccentColor || themeTextColor || themeHighlightColor) && (
                  <button
                    type="button"
                    onClick={() => {
                      setThemeAccentColor("");
                      setThemeTextColor("");
                      setThemeHighlightColor("");
                    }}
                    className="text-[10px] font-bold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Reset Overrides
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[var(--foreground-tertiary)] uppercase tracking-wider block">
                    Accent Color
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="color"
                      value={themeAccentColor || "#3b82f6"}
                      onChange={(e) => setThemeAccentColor(e.target.value)}
                      className="h-8.5 w-10 shrink-0 border border-[var(--border)] bg-transparent p-0 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="#3b82f6"
                      value={themeAccentColor}
                      onChange={(e) => setThemeAccentColor(e.target.value)}
                      className="flex-1 h-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[var(--foreground-tertiary)] uppercase tracking-wider block">
                    Text Color
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="color"
                      value={themeTextColor || "#fafafa"}
                      onChange={(e) => setThemeTextColor(e.target.value)}
                      className="h-8.5 w-10 shrink-0 border border-[var(--border)] bg-transparent p-0 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="#fafafa"
                      value={themeTextColor}
                      onChange={(e) => setThemeTextColor(e.target.value)}
                      className="flex-1 h-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[var(--foreground-tertiary)] uppercase tracking-wider block">
                    Secondary Accent
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="color"
                      value={themeHighlightColor || "#06b6d4"}
                      onChange={(e) => setThemeHighlightColor(e.target.value)}
                      className="h-8.5 w-10 shrink-0 border border-[var(--border)] bg-transparent p-0 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="#06b6d4"
                      value={themeHighlightColor}
                      onChange={(e) => setThemeHighlightColor(e.target.value)}
                      className="flex-1 h-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills and Goals Form */}
          <div className="card-base p-6 space-y-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
              <Bookmark className="h-4.5 w-4.5 text-[var(--foreground-secondary)]" /> Skills & Career Goals
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground-secondary)]">Custom Developer Skills</label>
                <input
                  type="text"
                  placeholder="TypeScript, Next.js, Docker, Kubernetes, CI/CD..."
                  value={customSkillsText}
                  onChange={(e) => setCustomSkillsText(e.target.value)}
                  className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
                />
                <p className="text-[9px] text-[var(--foreground-tertiary)] leading-relaxed">
                  Enter comma-separated technologies. These will supplement skills extracted from your resume or GitHub languages for career audits.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground-secondary)]">Career Goals</label>
                <input
                  type="text"
                  placeholder="Full Stack Engineer, Devops Architect, Remote Internships..."
                  value={careerGoalsText}
                  onChange={(e) => setCareerGoalsText(e.target.value)}
                  className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
                />
                <p className="text-[9px] text-[var(--foreground-tertiary)] leading-relaxed">
                  Enter comma-separated target titles or roles. Helps the roadmap and recommendations tailor roadmap goals specifically for your direction.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Connections & Notifications */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Connected accounts */}
          <div className="card-base p-5 space-y-4">
            <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider flex items-center gap-1.5 border-b border-[var(--border)] pb-2.5">
              <Link2 className="h-4 w-4" /> Connected Handles
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-[var(--foreground-secondary)] flex items-center gap-1.5">
                  <Linkedin className="h-3.5 w-3.5 text-blue-400" /> LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username..."
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full h-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-[var(--foreground-secondary)] flex items-center gap-1.5">
                  <Twitter className="h-3.5 w-3.5 text-sky-400" /> Twitter/X Handle
                </label>
                <input
                  type="text"
                  placeholder="@username..."
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="w-full h-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-[var(--foreground-secondary)] flex items-center gap-1.5">
                  <GithubIcon className="h-3.5 w-3.5 text-[var(--foreground)]" /> GitHub Username
                </label>
                <input
                  type="text"
                  placeholder="github-username..."
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full h-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* Notifications config */}
          <div className="card-base p-5 space-y-4">
            <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider flex items-center gap-1.5 border-b border-[var(--border)] pb-2.5">
              <Mail className="h-4 w-4" /> Preferences
            </h3>

            <div className="space-y-3.5 text-xs text-[var(--foreground-secondary)]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="rounded border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>Email Notifications</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminders}
                  onChange={(e) => setReminders(e.target.checked)}
                  className="rounded border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>Goal & Roadmap Reminders</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={weeklySum}
                  onChange={(e) => setWeeklySum(e.target.checked)}
                  className="rounded border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>Weekly Growth Summaries</span>
              </label>
            </div>
          </div>

          {/* SaaS & Testing Settings */}
          <div className="card-base p-5 space-y-4">
            <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider flex items-center gap-1.5 border-b border-[var(--border)] pb-2.5">
              <Sparkles className="h-4 w-4 text-blue-400" /> SaaS & Developer Tools
            </h3>

            <div className="space-y-3.5 text-xs">
              {/* Profile Share Link */}
              {initialSettings.username && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-[var(--foreground-secondary)]">Public Profile Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={profileUrl}
                      className="flex-1 h-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[10px] text-[var(--foreground-secondary)] outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(profileUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="h-8.5 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-item-hover)] flex items-center justify-center cursor-pointer"
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Public toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span className="text-xs font-medium text-[var(--foreground-secondary)]">Show profile in recruiter directory</span>
              </label>

              <hr className="border-[var(--border)]" />

              {/* Role Switcher */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-[var(--foreground-secondary)]">Testing: User Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                >
                  <option value="DEVELOPER">Developer</option>
                  <option value="RECRUITER">Recruiter</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              {/* Plan Switcher */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-[var(--foreground-secondary)]">Testing: Account Plan</label>
                  {plan === "PRO" && (() => {
                    const currentStatus = (() => {
                      if (!initialSettings.premiumExpiresAt) return "ACTIVE";
                      const expiry = new Date(initialSettings.premiumExpiresAt).getTime();
                      const now = Date.now();
                      if (expiry < now) return "EXPIRED";
                      const remainingDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                      if (remainingDays <= 30) return "EXPIRING SOON";
                      return "ACTIVE";
                    })();

                    return (
                      <div className="flex gap-1.5">
                        <span className="inline-flex items-center rounded bg-blue-500/10 px-1.5 py-0.5 text-[8px] font-black text-blue-400 uppercase tracking-widest border border-blue-500/20">
                          PRO
                        </span>
                        {currentStatus === "ACTIVE" && (
                          <span className="inline-flex items-center rounded bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-black text-emerald-400 uppercase tracking-widest border border-emerald-500/20">
                            ACTIVE
                          </span>
                        )}
                        {currentStatus === "EXPIRING SOON" && (
                          <span className="inline-flex items-center rounded bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-black text-amber-400 uppercase tracking-widest border border-amber-500/20 animate-pulse">
                            EXPIRING SOON
                          </span>
                        )}
                        {currentStatus === "EXPIRED" && (
                          <span className="inline-flex items-center rounded bg-red-500/10 px-1.5 py-0.5 text-[8px] font-black text-red-400 uppercase tracking-widest border border-red-500/20">
                            EXPIRED
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full h-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                >
                  <option value="FREE">Free Tier</option>
                  <option value="PRO">Pro Tier</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-xs font-semibold text-white transition-colors disabled:opacity-50"
            id="settings-save-btn"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving Configuration...
              </>
            ) : (
              "Save Configurations"
            )}
          </button>

        </div>
      </div>
    </form>
  );
}
