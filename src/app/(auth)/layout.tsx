interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-12 selection:bg-[var(--accent)] selection:text-white">
      {/* Grid Pattern Background */}
      <div className="grid-pattern absolute inset-0 opacity-20" />

      {/* Radial overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--background)]/75 to-[var(--background)]" />

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}
