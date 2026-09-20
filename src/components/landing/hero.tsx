"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  GitBranch,
  CheckCircle2,
  Terminal,
  FileText,
  Sparkles,
  Compass
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";

// Helper for generating Radar Chart points
const RADAR_LABELS = [
  "System Architecture",
  "Code Quality",
  "Git Activity",
  "Resume Quality",
  "Deployment Prep",
];

const generateRadarPoints = (scores: number[], center: number, maxRadius: number) => {
  return scores.map((score, index) => {
    const angle = (index * 2 * Math.PI) / scores.length - Math.PI / 2;
    const radius = (score / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  }).map(p => `${p.x},${p.y}`).join(" ");
};

function RadarChart() {
  const center = 80;
  const maxRadius = 55;
  const scores = [88, 82, 94, 75, 70]; // Upgraded demo scores
  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden h-full group hover:border-cyan-500/20 transition-all duration-300">
      <div className="absolute top-2 left-3 text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
        Skill Balance
      </div>
      <svg width="150" height="150" viewBox="0 0 160 160" className="mt-3">
        {/* Background grids */}
        {gridLevels.map((lvl) => {
          const points = RADAR_LABELS.map((_, i) => {
            const angle = (i * 2 * Math.PI) / RADAR_LABELS.length - Math.PI / 2;
            const r = (lvl / 100) * maxRadius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(" ");
          return (
            <polygon
              key={lvl}
              points={points}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.8"
              strokeDasharray={lvl === 100 ? "none" : "2,2"}
            />
          );
        })}

        {/* Axis lines */}
        {RADAR_LABELS.map((_, i) => {
          const angle = (i * 2 * Math.PI) / RADAR_LABELS.length - Math.PI / 2;
          const targetX = center + maxRadius * Math.cos(angle);
          const targetY = center + maxRadius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={targetX}
              y2={targetY}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Filled polygon for developer stats */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          points={generateRadarPoints(scores, center, maxRadius)}
          fill="rgba(6, 182, 212, 0.08)"
          stroke="url(#radarGradient)"
          strokeWidth="1.8"
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Vertices indicator dots */}
        {scores.map((score, index) => {
          const angle = (index * 2 * Math.PI) / scores.length - Math.PI / 2;
          const radius = (score / 100) * maxRadius;
          const cx = center + radius * Math.cos(angle);
          const cy = center + radius * Math.sin(angle);
          return (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r="3"
              fill="#00f0ff"
              className="pulse-glow-cyan"
            />
          );
        })}
      </svg>
    </div>
  );
}

function ScoreWidget() {
  const score = 88;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden h-full group hover:border-purple-500/20 transition-all duration-300">
      <div className="absolute top-2 left-3 text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
        AI Rating
      </div>
      <div className="relative flex items-center justify-center mt-3">
        <svg width="110" height="110" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ff007f" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black text-white tracking-tighter">{score}</span>
          <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">Level 4</span>
        </div>
      </div>
    </div>
  );
}

function CareerReadinessWidget() {
  return (
    <div className="p-5 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-full group hover:border-cyan-500/20 transition-all duration-300">
      <div>
        <div className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider mb-4">
          Market Alignment
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="text-zinc-400 font-semibold">Startup Readiness</span>
              <span className="text-white font-extrabold">94%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: "94%" }}
                transition={{ duration: 1.2, delay: 0.2 }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="text-zinc-400 font-semibold">Big Tech Readiness</span>
              <span className="text-white font-extrabold">81%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: "81%" }}
                transition={{ duration: 1.2, delay: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] text-zinc-500 font-medium">Target Track:</span>
        <span className="text-[9px] font-bold text-cyan-400 px-2.5 py-0.5 bg-cyan-950/30 border border-cyan-800/30 rounded-full">
          Senior Fullstack
        </span>
      </div>
    </div>
  );
}

// 3D Particles Interactive Neural Network Background Canvas
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Reduce particles on mobile for better performance
    const isMobile = width < 768;
    const particleCount = isMobile ? 30 : 80;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseColor: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 2 + 1;
        this.baseColor = Math.random() > 0.5 ? "6, 182, 212" : "168, 85, 247";
      }

      update(mx: number, my: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        const dx = mx - this.x;
        const dy = my - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          const force = (220 - dist) / 220;
          this.x += (dx / dist) * force * 0.65;
          this.y += (dy / dist) * force * 0.65;
        }
      }

      draw(context: CanvasRenderingContext2D, mx: number, my: number) {
        const dx = mx - this.x;
        const dy = my - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let alpha = 0.15;

        if (dist < 200) {
          alpha = 0.15 + (1 - dist / 200) * 0.45;
        }

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${this.baseColor}, ${alpha})`;
        context.fill();
      }
    }

    const particles: Particle[] = Array.from({ length: particleCount }, () => new Particle());
    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Pause animation when tab is hidden to save CPU/GPU
    let isPaused = false;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        cancelAnimationFrame(animationFrameId);
      } else {
        isPaused = false;
        draw();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let angle = 0;

    // Animation Loop
    const draw = () => {
      if (isPaused) return;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Rotating Holographic AI energy core in center background
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Core glow gradient
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 180);
      grad.addColorStop(0, "rgba(59, 130, 246, 0.06)");
      grad.addColorStop(0.5, "rgba(6, 182, 212, 0.03)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(0, 0, 180, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Rotating dashed orbits
      angle += 0.002;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
      ctx.lineWidth = 1;

      // Orbit 1
      ctx.beginPath();
      ctx.arc(0, 0, 120, 0, Math.PI * 2);
      ctx.setLineDash([4, 15]);
      ctx.rotate(angle);
      ctx.stroke();

      // Orbit 2
      ctx.beginPath();
      ctx.arc(0, 0, 75, 0, Math.PI * 2);
      ctx.setLineDash([8, 12]);
      ctx.rotate(-angle * 1.8);
      ctx.stroke();

      ctx.restore();
      ctx.setLineDash([]); // Reset line dash

      // 2. Update and draw particles
      particles.forEach((p) => {
        p.update(mouse.x, mouse.y);
        p.draw(ctx, mouse.x, mouse.y);
      });

      // 3. Connect close particles (neural network effect)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

export function Hero() {
  const [activeTab, setActiveTab] = useState<"github" | "resume" | "roadmap">("github");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse tilt effects
  const mx = useMotionValue(200);
  const my = useMotionValue(200);
  const rotateX = useTransform(my, [0, 400], [10, -10]);
  const rotateY = useTransform(mx, [0, 400], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const xVal = e.clientX - rect.left;
        const yVal = e.clientY - rect.top;
        mx.set(xVal);
        my.set(yVal);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mx, my]);

  // Tab switcher rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => {
        if (prev === "github") return "resume";
        if (prev === "resume") return "roadmap";
        return "github";
      });
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20 bg-zinc-950">

      {/* Aurora Background */}
      <div className="aurora-bg" />

      {/* 3D Particle Grid Neural Network */}
      <ParticleCanvas />

      {/* Grid Pattern overlay */}
      <div className="grid-mesh-overlay absolute inset-0 opacity-15" />

      {/* Gradient Blurs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Interactive spotlight glow matching cursor */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-40 md:opacity-75"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.06), transparent 70%)`
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 w-full z-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline copy */}
          <div className="text-center lg:text-left lg:col-span-6 space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3.5 py-1"
            >
              <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-extrabold text-zinc-300 tracking-widest uppercase">
                The Career Intelligence Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-black tracking-tight sm:text-5xl lg:text-[54px] leading-[1.08] text-white"
            >
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">AI-Powered</span>
              <br />
              <span className="glow-text-cyan-purple">Developer Intelligence.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Deep GitHub telemetry analysis, ATS resume audits, skill gap detection against live market demands,
              and personalized AI learning paths. No black boxes. Just absolute clarity for your tech career.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4.5 justify-center lg:justify-start pt-2"
            >
              <Link
                href="/login"
                id="hero-cta-primary"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-7 text-xs font-extrabold text-black transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-white/10 active:scale-[0.97] holographic-shine"
              >
                Start Analyzing Free
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </Link>
              <a
                href="#how-it-works"
                id="hero-cta-secondary"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-7 text-xs font-extrabold text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
              >
                See How It Works
              </a>
            </motion.div>
          </div>

          {/* Right Column: Visual Dashboard Showcase */}
          <div ref={containerRef} className="lg:col-span-6 flex justify-center w-full perspective-[1200px]">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-[480px] premium-glass-card rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Window Header */}
              <div className="flex items-center justify-between pb-4.5 border-b border-white/5 mb-5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <span className="text-[10px] font-mono text-zinc-500 ml-2">devleveler.com/dashboard</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-extrabold text-cyan-400 bg-cyan-950/20 border border-cyan-800/30 px-2.5 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Telemetry Active
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-1 mb-5 bg-zinc-900/40 border border-white/5 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setActiveTab("github")}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    activeTab === "github" ? "bg-white/10 text-white border border-white/10" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <GitBranch className="h-3.5 w-3.5 text-cyan-400" />
                  GitHub
                </button>
                <button
                  onClick={() => setActiveTab("resume")}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    activeTab === "resume" ? "bg-white/10 text-white border border-white/10" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-purple-400" />
                  Resume
                </button>
                <button
                  onClick={() => setActiveTab("roadmap")}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    activeTab === "roadmap" ? "bg-white/10 text-white border border-white/10" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Compass className="h-3.5 w-3.5 text-pink-400" />
                  Roadmap
                </button>
              </div>

              {/* Interactive Visual Shell */}
              <div className="min-h-[230px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {activeTab === "github" && (
                    <motion.div
                      key="github"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="col-span-1">
                        <ScoreWidget />
                      </div>
                      <div className="col-span-1">
                        <RadarChart />
                      </div>
                      <div className="col-span-2 rounded-xl border border-white/5 p-3 flex items-center justify-between text-xs bg-zinc-950/30">
                        <div className="flex items-center gap-2">
                          <Terminal className="h-4 w-4 text-cyan-400" />
                          <span className="font-mono text-zinc-400">github: /kartikshukla2301-eng</span>
                        </div>
                        <span className="font-bold text-zinc-500">2.4k Commits</span>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "resume" && (
                    <motion.div
                      key="resume"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-white/5 p-4 text-center flex flex-col justify-center bg-zinc-950/40">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">ATS Compliance</span>
                          <span className="text-3xl font-black text-emerald-400 mt-1">91/100</span>
                          <span className="text-[9px] text-emerald-400 font-bold mt-1">✓ Optimized</span>
                        </div>
                        <CareerReadinessWidget />
                      </div>
                      {/* Critical gaps items */}
                      <div className="rounded-2xl border border-white/5 p-3.5 text-xs space-y-2 bg-zinc-950/40">
                        <div className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Target Recommendations</div>
                        <div className="flex gap-2">
                          <span className="px-2.5 py-1 bg-white/5 border border-white/5 text-zinc-300 rounded-full text-[9px] font-bold">Redis Cache</span>
                          <span className="px-2.5 py-1 bg-white/5 border border-white/5 text-zinc-300 rounded-full text-[9px] font-bold">Docker Compose</span>
                          <span className="px-2.5 py-1 bg-white/5 border border-white/5 text-zinc-300 rounded-full text-[9px] font-bold">Next.js middleware</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "roadmap" && (
                    <motion.div
                      key="roadmap"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-2xl border border-white/5 p-4.5 space-y-4 bg-zinc-950/40"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-xs font-bold text-white">Target Learning Roadmap</span>
                        <span className="text-[9px] font-extrabold text-pink-400 uppercase tracking-wider bg-pink-950/20 border border-pink-900/30 px-2 py-0.5 rounded-full">Week 4 of 12</span>
                      </div>
                      <div className="space-y-3.5">
                        <div className="flex gap-3 items-start text-xs">
                          <CheckCircle2 className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-white block">Implement custom NextAuth caching</span>
                            <span className="text-[10px] text-zinc-500">Configure Redis storage adapters to handle high session volume</span>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start text-xs">
                          <div className="h-4 w-4 rounded-full border border-zinc-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-zinc-400 block">Setup horizontal Docker scaling</span>
                            <span className="text-[10px] text-zinc-500">Build compose files to spin up multi-replica pg clusters locally</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
