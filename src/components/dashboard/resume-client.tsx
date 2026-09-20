"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { analyzeResumeAction } from "@/actions/resume";
import { calculateScore } from "@/actions/score";
import { ProgressRing } from "@/components/charts/progress-ring";
import {
  FileText,
  FileUp,
  Loader2,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResumeAnalysis } from "@/types";

interface ResumeClientProps {
  initialAnalysis: ResumeAnalysis | null;
  userId: string;
}

export function ResumeClient({ initialAnalysis, userId }: ResumeClientProps) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(initialAnalysis);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await analyzeResumeAction(formData);
        if (res.success && res.data) {
          setAnalysis(res.data);
          // Re-calculate the developer score now that we have resume data
          await calculateScore(userId);
        } else {
          setError(res.error ?? "Failed to analyze resume");
        }
      } catch {
        setError("An unexpected error occurred during analysis.");
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div className="card-base p-6">
        <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-4">
          Upload Resume
        </h3>
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-xl py-12 px-6 cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--surface-hover)]/30 transition-all",
            isDragActive ? "border-[var(--accent)] bg-[var(--surface)]" : "",
            loading ? "opacity-50 pointer-events-none" : ""
          )}
        >
          <input {...getInputProps()} id="resume-file-input" />
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-sm text-[var(--foreground-secondary)]">
              <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)]" />
              <p className="font-semibold text-[var(--foreground)]">Analyzing Resume...</p>
              <p className="text-xs text-[var(--foreground-tertiary)]">
                Extracting text and scanning keywords with Gemini v2.0
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center text-sm text-[var(--foreground-secondary)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)]">
                <FileUp className="h-6 w-6 text-[var(--foreground-secondary)]" />
              </div>
              <p className="font-semibold text-[var(--foreground)]">
                Drag & drop your resume, or <span className="text-[var(--accent)]">browse</span>
              </p>
              <p className="text-xs text-[var(--foreground-tertiary)]">
                Supports PDF format only (Max 5MB)
              </p>
            </div>
          )}
        </div>
        {error && (
          <div className="mt-4 flex items-center gap-2 text-xs text-[var(--error)] bg-[var(--error-muted)] border border-[var(--error)]/20 p-3 rounded-lg">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {!loading && analysis && (
        <div className="space-y-6">
          {/* Export / Actions Row */}
          <div className="flex justify-end gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="h-8.5 px-4 rounded-lg bg-[var(--surface)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="h-4 w-4" /> Export Report (PDF)
            </button>
          </div>

          {/* Top Row: Score Gauges */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-base p-6 flex flex-col items-center justify-center text-center">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)] mb-4 self-start">
                ATS Compatibility
              </h4>
              <ProgressRing score={analysis.atsScore} size={140} strokeWidth={10} />
              <p className="mt-4 text-xs text-[var(--foreground-secondary)]">
                Estimated ATS readability based on keywords and format.
              </p>
            </div>
            <div className="card-base p-6 flex flex-col items-center justify-center text-center">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)] mb-4 self-start">
                Resume Quality
              </h4>
              <ProgressRing score={analysis.qualityScore} size={140} strokeWidth={10} />
              <p className="mt-4 text-xs text-[var(--foreground-secondary)]">
                Content quality based on impact, clarity, and metrics.
              </p>
            </div>
          </div>

          {/* Missing Keywords & Extracted Skills */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Skills */}
            <div className="card-base p-6 md:col-span-7 space-y-4">
              <h3 className="text-sm font-semibold text-[var(--foreground-secondary)]">
                Extracted Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {analysis.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-md bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-[var(--foreground-secondary)] border border-[var(--border)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="card-base p-6 md:col-span-5 space-y-4">
              <h3 className="text-sm font-semibold text-[var(--foreground-secondary)]">
                Recommended Keywords
              </h3>
              {analysis.missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missingKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center rounded-md bg-[var(--warning-muted)] px-2.5 py-1 text-xs font-medium text-[var(--warning)] border border-[var(--warning)]/20"
                    >
                      +{kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--foreground-tertiary)]">
                  All critical industry keywords found! Excellent job.
                </p>
              )}
            </div>
          </div>

          {/* Suggestions & Recommendations */}
          <div className="card-base p-6 space-y-5">
            <h3 className="text-sm font-semibold text-[var(--foreground-secondary)]">
              Suggestions & Improvements
            </h3>
            <div className="space-y-3">
              {analysis.suggestions.map((sug, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  <Sparkles className="h-5 w-5 text-[var(--accent)] shrink-0 mt-0.5" />
                  <div>
                    <span
                      className={cn(
                        "inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider mb-2",
                        sug.priority === "high"
                          ? "bg-[var(--error-muted)] text-[var(--error)]"
                          : sug.priority === "medium"
                          ? "bg-[var(--warning-muted)] text-[var(--warning)]"
                          : "bg-[var(--info-muted)] text-[var(--info)]"
                      )}
                    >
                      {sug.priority} Priority
                    </span>
                    <p className="text-xs leading-relaxed text-[var(--foreground-secondary)]">
                      {sug.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience & Education */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Experience */}
            <div className="card-base p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[var(--accent)]" />
                <h3 className="text-sm font-semibold text-[var(--foreground-secondary)]">
                  Experience
                </h3>
              </div>
              <div className="space-y-4">
                {analysis.experience.map((exp, i) => (
                  <div key={i} className="relative border-l border-[var(--border)] pl-4 ml-2">
                    <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border border-[var(--border)] bg-[var(--background)]" />
                    <h4 className="text-sm font-bold text-[var(--foreground)]">{exp.role}</h4>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">
                      {exp.company} &bull; {exp.duration}
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-[var(--foreground-tertiary)] list-disc pl-4">
                      {exp.highlights.map((h, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="card-base p-6 space-y-5">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[var(--accent)]" />
                <h3 className="text-sm font-semibold text-[var(--foreground-secondary)]">
                  Education
                </h3>
              </div>
              <div className="space-y-4">
                {analysis.education.map((edu, i) => (
                  <div key={i} className="border-b border-[var(--border)] last:border-0 pb-4 last:pb-0">
                    <h4 className="text-sm font-bold text-[var(--foreground)]">
                      {edu.degree} in {edu.field}
                    </h4>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                      {edu.institution} &bull; {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
