"use client";

import { useState } from "react";
import { getCareerCoachInsightsAction, askCareerCoachAction } from "@/actions/coach";
import {
  Compass,
  Loader2,
  Award,
  BookOpen,
  FolderCode,
  Briefcase,
  Send,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CoachInsights } from "@/actions/coach";

interface CoachClientProps {
  initialInsights: CoachInsights | null;
}

export function CoachClient({ initialInsights }: CoachClientProps) {
  const [insights, setInsights] = useState<CoachInsights | null>(initialInsights);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<Array<{ role: "user" | "model"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // Structured card expanded state
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleLoadInsights = async () => {
    setLoadingInsights(true);
    setError(null);
    try {
      const res = await getCareerCoachInsightsAction();
      if (res.success && res.data) {
        setInsights(res.data);
      } else {
        setError(res.error ?? "Failed to fetch coach insights.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setSending(true);

    try {
      // Map chat history to Gemini schema (role: "user" | "model", parts: string)
      const history = messages.map((m) => ({
        role: m.role,
        parts: m.content,
      }));

      const res = await askCareerCoachAction(userMsg, history);
      if (res.success && res.data) {
        setMessages((prev) => [...prev, { role: "model", content: res.data! }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: "Sorry, I had trouble answering that. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "An error occurred. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const toggleExpandCard = (card: string) => {
    setExpandedCard(expandedCard === card ? null : card);
  };

  return (
    <div className="space-y-6">
      {/* Summary / Fetch banner */}
      {!insights && !loadingInsights && (
        <div className="card-base p-6 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-[var(--foreground)]">Career Coach Insights</h3>
          <p className="text-xs text-[var(--foreground-secondary)] max-w-sm mx-auto">
            Analyze your Developer Score, GitHub activity, and Resume keywords to get structured suggestions.
          </p>
          <button
            onClick={handleLoadInsights}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-[var(--accent)] px-5 text-xs font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            id="coach-load-btn"
          >
            Generate Insights
          </button>
        </div>
      )}

      {loadingInsights && (
        <div className="card-base p-6 text-center max-w-xl mx-auto py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)] mx-auto mb-3" />
          <p className="text-xs text-[var(--foreground-secondary)] font-medium">Curating Career Coach insights...</p>
        </div>
      )}

      {error && (
        <div className="max-w-xl mx-auto rounded-lg border border-[var(--error)]/20 bg-[var(--error-muted)] p-3 text-xs text-[var(--error)]">
          {error}
        </div>
      )}

      {insights && !loadingInsights && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Insights Panel */}
          <div className="space-y-6 lg:col-span-8">
            {/* Overview Summary */}
            <div className="card-base p-6">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)]">
                Coach Overview
              </span>
              <p className="text-sm leading-relaxed text-[var(--foreground-secondary)] mt-2 font-medium">
                {insights.summary}
              </p>
            </div>

            {/* Recommendation Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* How to Improve Score */}
              <div
                onClick={() => toggleExpandCard("score")}
                className="card-base p-5 cursor-pointer hover:bg-[var(--surface-hover)]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4.5 w-4.5 text-[var(--accent)]" />
                      <h4 className="text-sm font-semibold text-[var(--foreground)]">Improve My Score</h4>
                    </div>
                    {expandedCard === "score" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  <p className="text-xs text-[var(--foreground-secondary)] mt-2 font-medium">
                    Rating: <span className="text-[var(--accent)]">{insights.improveScore.rating}</span>
                  </p>
                </div>
                {expandedCard === "score" && (
                  <ul className="mt-4 border-t border-[var(--border)] pt-3 space-y-2 text-xs text-[var(--foreground-secondary)] list-disc pl-4">
                    {insights.improveScore.tips.map((t, idx) => (
                      <li key={idx} className="leading-relaxed">{t}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* What Should I Learn Next */}
              <div
                onClick={() => toggleExpandCard("learn")}
                className="card-base p-5 cursor-pointer hover:bg-[var(--surface-hover)]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4.5 w-4.5 text-[var(--accent)]" />
                      <h4 className="text-sm font-semibold text-[var(--foreground)]">What to Learn Next</h4>
                    </div>
                    {expandedCard === "learn" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  <p className="text-xs text-[var(--foreground-secondary)] mt-2 font-medium">
                    Focus: <span className="text-[var(--accent)]">{insights.learnNext.rating}</span>
                  </p>
                </div>
                {expandedCard === "learn" && (
                  <ul className="mt-4 border-t border-[var(--border)] pt-3 space-y-2 text-xs text-[var(--foreground-secondary)] list-disc pl-4">
                    {insights.learnNext.tips.map((t, idx) => (
                      <li key={idx} className="leading-relaxed">{t}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Which Projects Should I Build */}
              <div
                onClick={() => toggleExpandCard("projects")}
                className="card-base p-5 cursor-pointer hover:bg-[var(--surface-hover)]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderCode className="h-4.5 w-4.5 text-[var(--accent)]" />
                      <h4 className="text-sm font-semibold text-[var(--foreground)]">Projects to Build</h4>
                    </div>
                    {expandedCard === "projects" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  <p className="text-xs text-[var(--foreground-secondary)] mt-2 font-medium">
                    Idea: <span className="text-[var(--accent)]">{insights.projectsToBuild.rating}</span>
                  </p>
                </div>
                {expandedCard === "projects" && (
                  <ul className="mt-4 border-t border-[var(--border)] pt-3 space-y-2 text-xs text-[var(--foreground-secondary)] list-disc pl-4">
                    {insights.projectsToBuild.tips.map((t, idx) => (
                      <li key={idx} className="leading-relaxed">{t}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Internship Readiness */}
              <div
                onClick={() => toggleExpandCard("readiness")}
                className="card-base p-5 cursor-pointer hover:bg-[var(--surface-hover)]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4.5 w-4.5 text-[var(--accent)]" />
                      <h4 className="text-sm font-semibold text-[var(--foreground)]">Internship Ready?</h4>
                    </div>
                    {expandedCard === "readiness" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  <p className="text-xs text-[var(--foreground-secondary)] mt-2 font-medium">
                    Status: <span className="text-[var(--accent)]">{insights.internshipReady.status}</span>
                  </p>
                </div>
                {expandedCard === "readiness" && (
                  <ul className="mt-4 border-t border-[var(--border)] pt-3 space-y-2 text-xs text-[var(--foreground-secondary)] list-disc pl-4">
                    {insights.internshipReady.tips.map((t, idx) => (
                      <li key={idx} className="leading-relaxed">{t}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Collapsible Chat Widget (Right Panel) */}
          <div className="lg:col-span-4 flex flex-col h-[520px] card-base overflow-hidden border border-[var(--border)]">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-[var(--accent)]" />
                <h4 className="text-sm font-semibold text-[var(--foreground)]">Ask Coach Questions</h4>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] pulse-glow" />
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center p-6 text-[var(--foreground-tertiary)]">
                  <Compass className="h-8 w-8 stroke-1 mb-2 text-[var(--foreground-muted)]" />
                  <p className="text-xs">Ask specific queries about your tech stack, gaps, or projects.</p>
                </div>
              )}
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-2 max-w-[85%] text-xs rounded-lg p-3",
                    m.role === "user"
                      ? "bg-[var(--accent)] text-white ml-auto"
                      : "bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground-secondary)] mr-auto"
                  )}
                >
                  {m.role === "model" && <Sparkles className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />}
                  <p className="leading-relaxed">{m.content}</p>
                </div>
              ))}
              {sending && (
                <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 max-w-[80%] text-xs text-[var(--foreground-tertiary)] mr-auto">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--accent)]" />
                  <span>Thinking...</span>
                </div>
              )}
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendChat} className="border-t border-[var(--border)] p-3 bg-[var(--background)] flex gap-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={sending}
                className="flex-1 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
                id="coach-chat-input"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
                id="coach-chat-send-btn"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
