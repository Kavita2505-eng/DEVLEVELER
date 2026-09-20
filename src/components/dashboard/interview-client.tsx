"use client";

import { useState, useEffect } from "react";
import { generateInterviewSessionAction, submitInterviewAnswerAction } from "@/actions/interview";
import { ProgressRing } from "@/components/charts/progress-ring";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  Code2,
  UserCheck,
  ChevronRight,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  History,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { InterviewQuestion } from "@/types";

interface SessionHistoryItem {
  id: string;
  type: "hr" | "technical" | "project";
  difficulty: string;
  skillFocus: string[];
  generatedAt: Date | string;
  questions: InterviewQuestion[];
}

interface InterviewClientProps {
  pastSessions: SessionHistoryItem[];
}

interface SavedProgress {
  currentIndex: number;
  answers: Record<
    string,
    {
      userAnswer: string;
      score: number;
      feedback: string;
      improvedAnswer: string;
    }
  >;
}

export function InterviewClient({ pastSessions }: InterviewClientProps) {
  // Navigation & session state
  const [activeSession, setActiveSession] = useState<SessionHistoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active session questionnaire states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answers, setAnswers] = useState<SavedProgress["answers"]>({});
  const [currentEvaluation, setCurrentEvaluation] = useState<{
    score: number;
    feedback: string;
    improvedAnswer: string;
  } | null>(null);

  // Mode state: "selection" | "active" | "report"
  const [mode, setMode] = useState<"selection" | "active" | "report">("selection");

  // Load active session progress from localStorage when session changes
  useEffect(() => {
    if (activeSession) {
      const saved = localStorage.getItem(`devleveler-interview-${activeSession.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as SavedProgress;
          setCurrentQuestionIndex(parsed.currentIndex);
          setAnswers(parsed.answers);
          
          // Hydrate evaluation if the current question was already answered
          const currentQuestionId = activeSession.questions[parsed.currentIndex]?.id;
          if (currentQuestionId && parsed.answers[currentQuestionId]) {
            const data = parsed.answers[currentQuestionId];
            setCurrentEvaluation({
              score: data.score,
              feedback: data.feedback,
              improvedAnswer: data.improvedAnswer,
            });
            setUserAnswer(data.userAnswer);
          } else {
            setCurrentEvaluation(null);
            setUserAnswer("");
          }
        } catch (e) {
          console.error("Failed to parse saved interview progress:", e);
        }
      } else {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setCurrentEvaluation(null);
        setUserAnswer("");
      }
    }
  }, [activeSession]);

  // Save progress to localStorage on change
  const saveProgress = (index: number, currentAnswers: SavedProgress["answers"]) => {
    if (activeSession) {
      const progressData: SavedProgress = {
        currentIndex: index,
        answers: currentAnswers,
      };
      localStorage.setItem(`devleveler-interview-${activeSession.id}`, JSON.stringify(progressData));
    }
  };

  const handleStartSession = async (type: "hr" | "technical" | "project") => {
    setLoading(true);
    setError(null);
    try {
      const res = await generateInterviewSessionAction(type);
      if (res.success && res.data) {
        const newSession: SessionHistoryItem = {
          id: res.data.id,
          type,
          difficulty: "intermediate",
          skillFocus: type === "hr" ? ["STAR Method", "Behavioral"] : type === "technical" ? ["System Design", "Coding"] : ["Architecture", "Engineering Decisions"],
          generatedAt: new Date(),
          questions: res.data.questions,
        };
        setActiveSession(newSession);
        setMode("active");
      } else {
        setError(res.error ?? "Failed to create session.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSession = (session: SessionHistoryItem) => {
    setActiveSession(session);
    setMode("active");
  };

  const handleViewReport = (session: SessionHistoryItem) => {
    const saved = localStorage.getItem(`devleveler-interview-${session.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedProgress;
        setAnswers(parsed.answers);
      } catch {
        setAnswers({});
      }
    } else {
      setAnswers({});
    }
    setActiveSession(session);
    setMode("report");
  };

  const handleEvaluate = async () => {
    if (!activeSession || !userAnswer.trim() || submitting) return;
    
    const question = activeSession.questions[currentQuestionIndex];
    setSubmitting(true);
    setError(null);

    try {
      const res = await submitInterviewAnswerAction(question.question, userAnswer);
      if (res.success && res.data) {
        const evalData = {
          userAnswer: userAnswer.trim(),
          score: res.data.score,
          feedback: res.data.feedback,
          improvedAnswer: res.data.improvedAnswer,
        };

        const updatedAnswers = {
          ...answers,
          [question.id]: evalData,
        };

        setAnswers(updatedAnswers);
        setCurrentEvaluation(res.data);
        saveProgress(currentQuestionIndex, updatedAnswers);
      } else {
        setError(res.error ?? "Failed to submit answer");
      }
    } catch {
      setError("Failed to evaluate answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!activeSession) return;
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < activeSession.questions.length) {
      setCurrentQuestionIndex(nextIndex);
      saveProgress(nextIndex, answers);

      // Hydrate if next question already has an answer saved
      const nextQuestionId = activeSession.questions[nextIndex].id;
      if (answers[nextQuestionId]) {
        const data = answers[nextQuestionId];
        setCurrentEvaluation({
          score: data.score,
          feedback: data.feedback,
          improvedAnswer: data.improvedAnswer,
        });
        setUserAnswer(data.userAnswer);
      } else {
        setCurrentEvaluation(null);
        setUserAnswer("");
      }
    } else {
      setMode("report");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex === 0) return;
    const prevIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(prevIndex);
    saveProgress(prevIndex, answers);

    const prevQuestionId = activeSession!.questions[prevIndex].id;
    const data = answers[prevQuestionId];
    if (data) {
      setCurrentEvaluation({
        score: data.score,
        feedback: data.feedback,
        improvedAnswer: data.improvedAnswer,
      });
      setUserAnswer(data.userAnswer);
    } else {
      setCurrentEvaluation(null);
      setUserAnswer("");
    }
  };

  const handleEndSession = () => {
    setMode("report");
  };

  const handleReset = () => {
    setActiveSession(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setCurrentEvaluation(null);
    setMode("selection");
    setError(null);
  };

  // Score aggregations
  const answeredQuestionsCount = Object.keys(answers).length;
  const averageScore = answeredQuestionsCount > 0
    ? Math.round(Object.values(answers).reduce((sum, item) => sum + item.score, 0) / answeredQuestionsCount)
    : 0;

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-[var(--error-border)] bg-[var(--error-bg)] p-4 text-xs text-[var(--error)]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. SELECTION MODE */}
      {mode === "selection" && (
        <div className="space-y-8">
          {loading ? (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-center p-6">
              <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)] mb-4" />
              <h3 className="text-base font-bold text-[var(--foreground)]">Tailoring Interview Session</h3>
              <p className="mt-1 text-xs text-[var(--foreground-secondary)] max-w-sm">
                Generating context-aware interview questions matching the tech stack and achievements from your linked profile.
              </p>
            </div>
          ) : (
            <>
              {/* Category Picker Grid */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Technical Card */}
                <div 
                  onClick={() => handleStartSession("technical")}
                  className="card-base p-6 cursor-pointer group hover:border-[var(--accent)] transition-all flex flex-col justify-between h-[220px]"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors mb-4">
                      <Code2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-blue-400 transition-colors">
                      Technical & Architecture
                    </h3>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-2 line-clamp-3">
                      Challenge your software engineering knowledge. Coding questions, system design concepts, and language-specific best practices.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--foreground-tertiary)] group-hover:text-[var(--accent)] transition-colors pt-2">
                    Begin Assessment <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Behavioral / HR Card */}
                <div 
                  onClick={() => handleStartSession("hr")}
                  className="card-base p-6 cursor-pointer group hover:border-[var(--accent)] transition-all flex flex-col justify-between h-[220px]"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors mb-4">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-emerald-400 transition-colors">
                      Behavioral & HR
                    </h3>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-2 line-clamp-3">
                      Practice soft skills, conflict resolution, and leadership stories tailored to your background. Focuses on the STAR method format.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--foreground-tertiary)] group-hover:text-[var(--accent)] transition-colors pt-2">
                    Begin Assessment <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Project / Resume Card */}
                <div 
                  onClick={() => handleStartSession("project")}
                  className="card-base p-6 cursor-pointer group hover:border-[var(--accent)] transition-all flex flex-col justify-between h-[220px]"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors mb-4">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-purple-400 transition-colors">
                      Project Experience
                    </h3>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-2 line-clamp-3">
                      Deep-dive into the architectural trade-offs, technologies, and lessons learned from the projects documented in your profile.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--foreground-tertiary)] group-hover:text-[var(--accent)] transition-colors pt-2">
                    Begin Assessment <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Past History Table */}
              {pastSessions.length > 0 && (
                <div className="card-base p-6">
                  <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4 mb-4">
                    <History className="h-4 w-4 text-[var(--foreground-secondary)]" />
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">Interview History</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="text-[var(--foreground-tertiary)] border-b border-[var(--border)]">
                          <th className="py-2.5 font-medium">Topic / Category</th>
                          <th className="py-2.5 font-medium">Date</th>
                          <th className="py-2.5 font-medium">Difficulty</th>
                          <th className="py-2.5 font-medium">Skill Target</th>
                          <th className="py-2.5 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastSessions.map((session) => (
                          <tr key={session.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] transition-colors">
                            <td className="py-3 font-semibold capitalize text-[var(--foreground)]">
                              {session.type === "hr" ? "Behavioral (HR)" : session.type === "technical" ? "Technical" : "Project"}
                            </td>
                            <td className="py-3 text-[var(--foreground-secondary)]">
                              {new Date(session.generatedAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td className="py-3 text-[var(--foreground-secondary)] capitalize">
                              {session.difficulty}
                            </td>
                            <td className="py-3">
                              <div className="flex flex-wrap gap-1">
                                {session.skillFocus.map((s, idx) => (
                                  <span key={idx} className="bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[10px] text-[var(--foreground-secondary)]">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 text-right space-x-2">
                              <button
                                onClick={() => handleResumeSession(session)}
                                className="text-[var(--accent)] hover:underline font-medium"
                              >
                                Resume
                              </button>
                              <span className="text-[var(--border)]">|</span>
                              <button
                                onClick={() => handleViewReport(session)}
                                className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:underline font-medium"
                              >
                                View Report
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 2. ACTIVE SESSION MODE */}
      {mode === "active" && activeSession && (
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Left Navigation: Progress list */}
          <div className="card-base p-5 lg:col-span-4 space-y-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)] capitalize">
                {activeSession.type === "hr" ? "Behavioral (HR) Session" : activeSession.type}
              </span>
              <h3 className="text-sm font-bold text-[var(--foreground)] mt-1">Questions List</h3>
            </div>
            
            <div className="space-y-2">
              {activeSession.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = !!answers[q.id];
                
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      const savedAns = answers[q.id];
                      if (savedAns) {
                        setCurrentEvaluation({
                          score: savedAns.score,
                          feedback: savedAns.feedback,
                          improvedAnswer: savedAns.improvedAnswer,
                        });
                        setUserAnswer(savedAns.userAnswer);
                      } else {
                        setCurrentEvaluation(null);
                        setUserAnswer("");
                      }
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between",
                      isCurrent
                        ? "border-[var(--accent)] bg-[var(--accent-muted)]/5 font-semibold text-[var(--foreground)]"
                        : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface)]/80 text-[var(--foreground-secondary)]"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]",
                        isCurrent
                          ? "bg-[var(--accent)] text-white"
                          : isAnswered
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-[var(--surface)] text-[var(--foreground-tertiary)] border border-[var(--border)]"
                      )}>
                        {idx + 1}
                      </span>
                      <span className="truncate">{q.question}</span>
                    </div>
                    {isAnswered && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {answers[q.id].score}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-[var(--border)] pt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-[var(--foreground-secondary)]">
                <span>Progress</span>
                <span>{answeredQuestionsCount} / {activeSession.questions.length} Answered</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--surface)] border border-[var(--border)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--accent)] transition-all duration-300"
                  style={{ width: `${(answeredQuestionsCount / activeSession.questions.length) * 100}%` }}
                />
              </div>
              
              <button
                onClick={handleEndSession}
                className="w-full mt-2 flex h-9 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] text-xs font-semibold text-[var(--foreground)] transition-colors"
              >
                End Session & View Summary
              </button>
            </div>
          </div>

          {/* Right Area: Current Question Card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="card-base p-6 space-y-6">
              {/* Question metadata row */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize",
                    activeSession.questions[currentQuestionIndex].difficulty === "easy"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : activeSession.questions[currentQuestionIndex].difficulty === "hard"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  )}>
                    {activeSession.questions[currentQuestionIndex].difficulty}
                  </span>
                  <span className="bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded-full text-[10px] text-[var(--foreground-secondary)] font-semibold">
                    {activeSession.questions[currentQuestionIndex].skill}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-tertiary)]">
                  <span>Question {currentQuestionIndex + 1} of {activeSession.questions.length}</span>
                </div>
              </div>

              {/* Question text */}
              <div>
                <h2 className="text-base font-bold text-[var(--foreground)] leading-relaxed">
                  {activeSession.questions[currentQuestionIndex].question}
                </h2>
              </div>

              {/* Answer input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--foreground-secondary)]">Your Answer</label>
                <textarea
                  placeholder="Draft your professional response here. Try to use structured formatting (bullet points, clear paragraphs) and the STAR method if behavioral..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full min-h-[160px] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-xs leading-relaxed text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-80"
                  disabled={submitting || !!currentEvaluation}
                  id="answer-textarea"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-5">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0 || submitting}
                  className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] px-4 text-xs font-semibold text-[var(--foreground)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </button>

                {currentEvaluation ? (
                  <button
                    onClick={handleNext}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-5 text-xs font-semibold text-white transition-colors"
                  >
                    {currentQuestionIndex + 1 === activeSession.questions.length ? "Finish Assessment" : "Next Question"} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleEvaluate}
                    disabled={submitting || !userAnswer.trim()}
                    className="flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-5 text-xs font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    id="submit-answer-btn"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Evaluating Answer...
                      </>
                    ) : (
                      <>
                        <Award className="h-3.5 w-3.5" /> Evaluate Response
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Evaluation Results Card */}
            <AnimatePresence mode="wait">
              {currentEvaluation && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="card-base p-6 space-y-5 border-emerald-500/20 bg-emerald-500/[0.02]"
                >
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[var(--foreground)]">Evaluation Breakdown</h4>
                        <p className="text-[10px] text-[var(--foreground-tertiary)]">Actionable tips for scaling this answer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-lg text-xs font-bold">
                      <span className="text-[var(--foreground-secondary)]">Score:</span>
                      <span className={cn(
                        "font-extrabold",
                        currentEvaluation.score >= 80 ? "text-emerald-400" : currentEvaluation.score >= 60 ? "text-blue-400" : "text-amber-400"
                      )}>
                        {currentEvaluation.score}/100
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-[11px] font-semibold text-[var(--foreground-secondary)] uppercase tracking-wider">Coach Feedback</h5>
                    <p className="text-xs leading-relaxed text-[var(--foreground-secondary)] bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg">
                      {currentEvaluation.feedback}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                      <h5 className="text-[11px] font-semibold text-[var(--foreground-secondary)] uppercase tracking-wider">Optimized Suggested Response</h5>
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--foreground-secondary)] bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg whitespace-pre-line font-medium border-dashed border-[var(--accent)]/30">
                      {currentEvaluation.improvedAnswer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 3. REPORT / SUMMARY MODE */}
      {mode === "report" && activeSession && (
        <div className="space-y-6">
          {/* Header summary card */}
          <div className="card-base p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)]">Assessment Completed</span>
                <h2 className="text-lg font-bold text-[var(--foreground)] capitalize">
                  {activeSession.type === "hr" ? "Behavioral (HR)" : activeSession.type} Readiness Score
                </h2>
                <p className="text-xs text-[var(--foreground-secondary)] max-w-md">
                  We evaluated your answers based on technical accuracy, structure, action verb choice, and complexity. Review specific feedback below.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                  {activeSession.skillFocus.map((s, idx) => (
                    <span key={idx} className="bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded-full text-[10px] text-[var(--foreground-secondary)]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-1.5">
                <ProgressRing score={averageScore} size={130} strokeWidth={8} />
                <span className="text-[10px] font-medium text-[var(--foreground-secondary)] mt-1">Average Evaluation Score</span>
              </div>
            </div>
          </div>

          {/* Results grid */}
          <div className="card-base p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
              <BookOpen className="h-4 w-4 text-[var(--foreground-secondary)]" />
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Responses & Evaluations</h3>
            </div>

            <div className="space-y-4">
              {activeSession.questions.map((q, idx) => {
                const ans = answers[q.id];
                return (
                  <div key={q.id} className="border border-[var(--border)] rounded-lg p-4 bg-[var(--surface)] space-y-3">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--card)] border border-[var(--border)] text-[10px] font-bold text-[var(--foreground-secondary)]">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-[var(--foreground)] max-w-[250px] sm:max-w-md md:max-w-xl truncate">
                          {q.question}
                        </span>
                      </div>
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded border",
                        ans
                          ? ans.score >= 80
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : ans.score >= 60
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-[var(--surface)] text-[var(--foreground-tertiary)] border-[var(--border)]"
                      )}>
                        {ans ? `${ans.score}/100` : "Skipped"}
                      </span>
                    </div>

                    {ans ? (
                      <div className="grid gap-3 md:grid-cols-2 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wider">Your Answer:</span>
                          <p className="bg-[var(--card)] border border-[var(--border)] p-2.5 rounded text-[var(--foreground-secondary)] line-clamp-4 hover:line-clamp-none transition-all cursor-pointer">
                            {ans.userAnswer}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wider">Coach Feedback & Tips:</span>
                          <p className="bg-[var(--card)] border border-[var(--border)] p-2.5 rounded text-[var(--foreground-secondary)]">
                            {ans.feedback}
                          </p>
                        </div>
                        <div className="md:col-span-2 space-y-1 pt-1">
                          <div className="flex items-center gap-1 text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wider">
                            <Sparkles className="h-3 w-3" /> Professional Suggested Response:
                          </div>
                          <p className="bg-[var(--card)] border border-[var(--border)] p-3 rounded text-[var(--foreground-secondary)] whitespace-pre-line border-dashed border-[var(--accent)]/30">
                            {ans.improvedAnswer}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--foreground-tertiary)] italic">No answer submitted for this question.</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[var(--border)] pt-5 flex items-center justify-end">
              <button
                onClick={handleReset}
                className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-5 text-sm font-semibold text-white transition-colors"
              >
                Start Another Session <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
