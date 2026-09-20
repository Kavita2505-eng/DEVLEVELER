import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth();

  // Redirect to /login if not authenticated
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  // Fetch plan, role, isEarlyAdopter, premiumExpiresAt, theme/avatar settings, and devScore
  const [dbUser, devScore] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        plan: true,
        role: true,
        isEarlyAdopter: true,
        premiumExpiresAt: true,
        theme: true,
        themeAccentColor: true,
        themeTextColor: true,
        themeHighlightColor: true,
        avatarSource: true,
        customAvatar: true,
        googleAvatarUrl: true,
        githubAvatarUrl: true,
        image: true,
        name: true,
        username: true,
      },
    }),
    prisma.developerScore.findUnique({
      where: { userId: session.user.id },
      select: { overallScore: true },
    }),
  ]);

  const userTheme = dbUser?.theme || "default";
  const themeClass = userTheme !== "default" ? `theme-${userTheme}` : "";

  // Prepare custom style attributes for custom color overrides
  const customStyles: Record<string, string> = {};
  if (dbUser?.themeAccentColor) {
    customStyles["--accent"] = dbUser.themeAccentColor;
    customStyles["--accent-hover"] = `${dbUser.themeAccentColor}dd`;
  }
  if (dbUser?.themeTextColor) {
    customStyles["--foreground"] = dbUser.themeTextColor;
  }
  if (dbUser?.themeHighlightColor) {
    customStyles["--accent-secondary"] = dbUser.themeHighlightColor;
  }

  const userWithPlanAndRole = {
    id: session.user.id,
    email: session.user.email,
    name: dbUser?.name ?? session.user.name,
    username: dbUser?.username ?? undefined,
    image: dbUser?.image ?? session.user.image,
    plan: dbUser?.plan ?? "FREE",
    role: dbUser?.role ?? "DEVELOPER",
    isEarlyAdopter: dbUser?.isEarlyAdopter ?? false,
    premiumExpiresAt: dbUser?.premiumExpiresAt?.toISOString() ?? null,
    theme: userTheme,
    avatarSource: dbUser?.avatarSource ?? "INITIALS",
    customAvatar: dbUser?.customAvatar ?? null,
    googleAvatarUrl: dbUser?.googleAvatarUrl ?? null,
    githubAvatarUrl: dbUser?.githubAvatarUrl ?? null,
    devScore: devScore?.overallScore ?? null,
  };

  return (
    <div
      className={`relative min-h-screen bg-[var(--background)] ${themeClass}`}
      style={customStyles as React.CSSProperties}
    >
      {/* Sidebar Navigation */}
      <Sidebar user={userWithPlanAndRole} />

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-1 flex-col md:pl-72 transition-all">
        {/* Header */}
        <Header user={userWithPlanAndRole} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1440px] space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
