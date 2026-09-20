// ============================================================
// DevLeveler — Developer Score Engine
// ============================================================

import type { DeveloperScoreData, ScoreBreakdown } from "@/types";

// ---------------------------------------------------------------------------
// Weights
// ---------------------------------------------------------------------------

const BASE_WEIGHTS = {
  github: 0.25,
  projects: 0.30,
  skills: 0.20,
  resume: 0.15,
  deployment: 0.10,
} as const;

type ComponentKey = keyof typeof BASE_WEIGHTS;

// ---------------------------------------------------------------------------
// Rank calculation
// ---------------------------------------------------------------------------

function getRank(score: number): string {
  if (score >= 91) return "Master";
  if (score >= 76) return "Architect";
  if (score >= 61) return "Engineer";
  if (score >= 41) return "Builder";
  if (score >= 21) return "Explorer";
  return "Beginner";
}

function getLevel(score: number): string {
  if (score >= 91) return "Elite Developer";
  if (score >= 76) return "Senior Developer";
  if (score >= 61) return "Mid-Level Developer";
  if (score >= 41) return "Junior Developer";
  if (score >= 21) return "Aspiring Developer";
  return "Getting Started";
}

// ---------------------------------------------------------------------------
// Score details generator
// ---------------------------------------------------------------------------

function getGitHubDetails(score: number): string[] {
  const details: string[] = [];
  if (score >= 80) details.push("Strong GitHub presence with active contributions");
  else if (score >= 50) details.push("Moderate GitHub activity — keep pushing code regularly");
  else details.push("Low GitHub activity — start contributing more frequently");

  if (score >= 60) details.push("Good repository health and documentation");
  else details.push("Improve repo descriptions, READMEs, and topic tags");

  return details;
}

function getProjectDetails(score: number): string[] {
  const details: string[] = [];
  if (score >= 80) details.push("Impressive project portfolio with diverse technologies");
  else if (score >= 50) details.push("Decent projects — add more variety and complexity");
  else details.push("Build more projects to showcase your skills");

  if (score >= 70) details.push("Projects demonstrate real-world problem solving");
  else details.push("Focus on projects that solve real problems");

  return details;
}

function getSkillDetails(score: number): string[] {
  const details: string[] = [];
  if (score >= 80) details.push("Well-rounded skill set covering multiple domains");
  else if (score >= 50) details.push("Good foundation — expand into complementary technologies");
  else details.push("Focus on building core skills in your chosen stack");

  return details;
}

function getResumeDetails(score: number): string[] {
  const details: string[] = [];
  if (score >= 80) details.push("Resume is well-structured and ATS-optimized");
  else if (score >= 50) details.push("Resume needs some improvements for better ATS compatibility");
  else details.push("Resume needs significant improvements — review Career Coach suggestions");

  return details;
}

function getDeploymentDetails(score: number): string[] {
  const details: string[] = [];
  if (score >= 80) details.push("Excellent portfolio deployment and online presence");
  else if (score >= 50) details.push("Portfolio exists but could be improved");
  else details.push("Deploy a portfolio website to showcase your work");

  return details;
}

// ---------------------------------------------------------------------------
// Main scoring function
// ---------------------------------------------------------------------------

export interface ScoreInput {
  githubScore?: number;
  projectScore?: number;
  skillScore?: number;
  resumeScore?: number;
  deploymentScore?: number;
}

export function calculateDeveloperScore(
  params: ScoreInput
): DeveloperScoreData {
  const components: { key: ComponentKey; score: number | undefined }[] = [
    { key: "github", score: params.githubScore },
    { key: "projects", score: params.projectScore },
    { key: "skills", score: params.skillScore },
    { key: "resume", score: params.resumeScore },
    { key: "deployment", score: params.deploymentScore },
  ];

  // Separate available and missing components
  const available = components.filter((c) => c.score !== undefined);
  const totalAvailableWeight = available.reduce(
    (sum, c) => sum + BASE_WEIGHTS[c.key],
    0
  );

  // If no components provided, return zero score
  if (available.length === 0 || totalAvailableWeight === 0) {
    return createEmptyScore();
  }

  // Calculate redistributed weights proportionally
  const redistributedWeights: Record<ComponentKey, number> = {
    github: 0,
    projects: 0,
    skills: 0,
    resume: 0,
    deployment: 0,
  };

  for (const comp of available) {
    redistributedWeights[comp.key] =
      BASE_WEIGHTS[comp.key] / totalAvailableWeight;
  }

  // Calculate weighted score
  let overallScore = 0;
  for (const comp of available) {
    overallScore += (comp.score ?? 0) * redistributedWeights[comp.key];
  }
  overallScore = Math.max(0, Math.min(100, Math.round(overallScore)));

  // Build the breakdown
  const safeScore = (s: number | undefined) =>
    Math.max(0, Math.min(100, Math.round(s ?? 0)));

  const ghScore = safeScore(params.githubScore);
  const prjScore = safeScore(params.projectScore);
  const skScore = safeScore(params.skillScore);
  const resScore = safeScore(params.resumeScore);
  const depScore = safeScore(params.deploymentScore);

  const breakdown: ScoreBreakdown = {
    github: {
      score: ghScore,
      weight: redistributedWeights.github,
      weighted: Math.round(ghScore * redistributedWeights.github),
      details: getGitHubDetails(ghScore),
    },
    projects: {
      score: prjScore,
      weight: redistributedWeights.projects,
      weighted: Math.round(prjScore * redistributedWeights.projects),
      details: getProjectDetails(prjScore),
    },
    skills: {
      score: skScore,
      weight: redistributedWeights.skills,
      weighted: Math.round(skScore * redistributedWeights.skills),
      details: getSkillDetails(skScore),
    },
    resume: {
      score: resScore,
      weight: redistributedWeights.resume,
      weighted: Math.round(resScore * redistributedWeights.resume),
      details: getResumeDetails(resScore),
    },
    deployment: {
      score: depScore,
      weight: redistributedWeights.deployment,
      weighted: Math.round(depScore * redistributedWeights.deployment),
      details: getDeploymentDetails(depScore),
    },
  };

  return {
    overallScore,
    githubScore: ghScore,
    projectScore: prjScore,
    skillScore: skScore,
    resumeScore: resScore,
    deploymentScore: depScore,
    rank: getRank(overallScore),
    level: getLevel(overallScore),
    breakdown,
  };
}

// ---------------------------------------------------------------------------
// Empty score fallback
// ---------------------------------------------------------------------------

function createEmptyScore(): DeveloperScoreData {
  const emptyComponent = {
    score: 0,
    weight: 0,
    weighted: 0,
    details: ["Not yet analyzed"],
  };

  return {
    overallScore: 0,
    githubScore: 0,
    projectScore: 0,
    skillScore: 0,
    resumeScore: 0,
    deploymentScore: 0,
    rank: "Beginner",
    level: "Getting Started",
    breakdown: {
      github: { ...emptyComponent },
      projects: { ...emptyComponent },
      skills: { ...emptyComponent },
      resume: { ...emptyComponent },
      deployment: { ...emptyComponent },
    },
  };
}
