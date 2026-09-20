import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL connection URL"),
  DIRECT_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  AUTH_GOOGLE_ID: z.string().min(1, "AUTH_GOOGLE_ID is required for Google OAuth"),
  AUTH_GOOGLE_SECRET: z.string().min(1, "AUTH_GOOGLE_SECRET is required for Google OAuth"),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  AI_PROVIDER: z.string().optional(),
  AI_MODEL: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL").default("http://localhost:3000"),
}).refine(
  (data) => !!(data.OPENROUTER_API_KEY || data.OPENAI_API_KEY || data.GEMINI_API_KEY),
  {
    message: "At least one AI API key (OPENROUTER_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY) must be provided",
    path: ["OPENROUTER_API_KEY"],
  }
);

const result = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  AI_PROVIDER: process.env.AI_PROVIDER,
  AI_MODEL: process.env.AI_MODEL,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!result.success) {
  const errorMessages = result.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  const message = `
========================================================================
⚠️ DEVLEVELER ENV VALIDATION WARNING:
========================================================================
The following environment variables are missing or invalid:
${errorMessages}

Please ensure you have created a '.env.local' file in the project root 
by copying '.env.example' and filling in the correct credentials.
========================================================================`;

  console.error(message);
}

// Export parsed env values, falling back to process.env if validation failed
export const env = result.success ? result.data : {
  DATABASE_URL: process.env.DATABASE_URL || "",
  DIRECT_URL: process.env.DIRECT_URL || "",
  AUTH_SECRET: process.env.AUTH_SECRET || "",
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID || "",
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  AI_PROVIDER: process.env.AI_PROVIDER || "",
  AI_MODEL: process.env.AI_MODEL || "",
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || "",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};
