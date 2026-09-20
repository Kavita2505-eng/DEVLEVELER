import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database...");
  
  // Delete all records in correct order to avoid foreign key violations
  await prisma.xPHistory.deleteMany({});
  await prisma.interviewSession.deleteMany({});
  await prisma.portfolioAnalysis.deleteMany({});
  await prisma.roadmap.deleteMany({});
  await prisma.skillGap.deleteMany({});
  await prisma.developerScore.deleteMany({});
  await prisma.resume.deleteMany({});
  await prisma.gitHubProfile.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleaned.");

  // 1. Create a Seed User
  console.log("Creating seed users...");
  const devUser = await prisma.user.create({
    data: {
      name: "Demo Developer",
      email: "demo@devleveler.com",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80",
      xp: 1250,
      level: 4,
    },
  });

  // 2. Create GitHub Profile
  const languages = [
    { name: "TypeScript", value: 45, percentage: 45, color: "#3178c6" },
    { name: "JavaScript", value: 30, percentage: 30, color: "#f1e05a" },
    { name: "HTML", value: 15, percentage: 15, color: "#e34c26" },
    { name: "CSS", value: 10, percentage: 10, color: "#563d7c" },
  ];

  const topRepos = [
    {
      id: 1,
      name: "e-commerce-api",
      full_name: "demo/e-commerce-api",
      description: "A high-performance REST API built with NestJS and Prisma.",
      html_url: "https://github.com",
      language: "TypeScript",
      stargazers_count: 24,
      forks_count: 5,
      watchers_count: 24,
      open_issues_count: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
      size: 1024,
      topics: ["nestjs", "prisma", "api", "postgresql"],
      fork: false,
      archived: false,
      has_wiki: true,
      has_pages: false,
      license: { key: "mit", name: "MIT" },
    },
    {
      id: 2,
      name: "react-dashboard",
      full_name: "demo/react-dashboard",
      description: "A premium admin dashboard built with Tailwind CSS and React.",
      html_url: "https://github.com",
      language: "TypeScript",
      stargazers_count: 18,
      forks_count: 2,
      watchers_count: 18,
      open_issues_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
      size: 2048,
      topics: ["react", "tailwind", "dashboard"],
      fork: false,
      archived: false,
      has_wiki: false,
      has_pages: true,
      license: null,
    },
  ];

  await prisma.gitHubProfile.create({
    data: {
      userId: devUser.id,
      username: "demodev",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80",
      bio: "Full Stack Engineer interested in high-performance web systems.",
      publicRepos: 15,
      followers: 42,
      following: 30,
      totalStars: 42,
      totalForks: 7,
      languages: JSON.stringify(languages),
      topRepos: JSON.stringify(topRepos),
      activityScore: 78,
      repoHealth: 85,
      githubScore: 81,
    },
  });

  // 3. Create Resume Analysis
  const education = [
    {
      institution: "Tech State University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      year: "2023",
    },
  ];

  const experience = [
    {
      company: "Innovate Labs",
      role: "Junior Web Developer",
      duration: "2023 - Present",
      highlights: [
        "Built responsive client portals in React and Next.js.",
        "Collaborated with design team to enforce UI systems.",
        "Optimized web queries, reducing page load times by 20%.",
      ],
    },
  ];

  const resumeSuggestions = [
    {
      category: "experience",
      message: "Quantify your impact more. Add metrics showing scale and load reduction achievements.",
      priority: "high",
    },
    {
      category: "skills",
      message: "Add backend or devops tools (Docker, AWS) to enhance full-stack profile relevance.",
      priority: "medium",
    },
  ];

  await prisma.resume.create({
    data: {
      userId: devUser.id,
      fileName: "demo_resume.pdf",
      rawText: "Demo Resume Content",
      skills: JSON.stringify(["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Git"]),
      education: JSON.stringify(education),
      experience: JSON.stringify(experience),
      projects: JSON.stringify([]),
      certifications: JSON.stringify([]),
      atsScore: 72,
      qualityScore: 68,
      missingKeywords: JSON.stringify(["Docker", "Node.js", "Jest", "PostgreSQL", "CI/CD"]),
      suggestions: JSON.stringify(resumeSuggestions),
      summary: "Aspiring Full Stack Developer with hands-on experience in React and frontend system building.",
    },
  });

  // 4. Create Developer Score
  const scoreBreakdown = {
    github: {
      score: 81,
      weight: 0.25,
      weighted: 20,
      details: ["Strong GitHub presence with active contributions"],
    },
    projects: {
      score: 75,
      weight: 0.30,
      weighted: 23,
      details: ["Projects demonstrate real-world problem solving"],
    },
    skills: {
      score: 60,
      weight: 0.20,
      weighted: 12,
      details: ["Good foundation — expand into complementary technologies"],
    },
    resume: {
      score: 68,
      weight: 0.15,
      weighted: 10,
      details: ["Resume needs some improvements for better ATS compatibility"],
    },
    deployment: {
      score: 50,
      weight: 0.10,
      weighted: 5,
      details: ["Portfolio exists but could be improved"],
    },
  };

  await prisma.developerScore.create({
    data: {
      userId: devUser.id,
      overallScore: 70,
      githubScore: 81,
      projectScore: 75,
      skillScore: 60,
      resumeScore: 68,
      deploymentScore: 50,
      rank: "Engineer",
      level: "Mid-Level Developer",
      breakdown: JSON.stringify(scoreBreakdown),
    },
  });

  // 5. Create Skill Gap Analysis
  const currentSkills = [
    { name: "React", category: "Frontend", proficiency: 80 },
    { name: "TypeScript", category: "Frontend", proficiency: 75 },
    { name: "JavaScript", category: "Frontend", proficiency: 85 },
  ];

  const missingSkills = [
    { name: "Docker", category: "DevOps", proficiency: 0 },
    { name: "Node.js", category: "Backend", proficiency: 0 },
    { name: "PostgreSQL", category: "Database", proficiency: 0 },
  ];

  const skillRecommendations = [
    {
      skill: "Docker",
      reason: "Essential for modern containerized development and deployment workflows.",
      priority: "critical",
      resources: ["https://docs.docker.com", "Docker official tutorial"],
    },
    {
      skill: "PostgreSQL",
      reason: "Learn a reliable relational database to store backend application states.",
      priority: "important",
      resources: ["https://www.postgresql.org/docs/", "PostgreSQL Tutorial for Beginners"],
    },
  ];

  await prisma.skillGap.create({
    data: {
      userId: devUser.id,
      currentSkills: JSON.stringify(currentSkills),
      missingSkills: JSON.stringify(missingSkills),
      recommendations: JSON.stringify(skillRecommendations),
      priority: "high",
    },
  });

  // 6. Create XP History entries
  await prisma.xPHistory.createMany({
    data: [
      {
        userId: devUser.id,
        amount: 300,
        reason: "Analyzed GitHub profile",
        category: "github",
        earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId: devUser.id,
        amount: 100,
        reason: "Uploaded and analyzed resume",
        category: "resume",
        earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        userId: devUser.id,
        amount: 500,
        reason: "Completed project analysis",
        category: "project",
        earnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
