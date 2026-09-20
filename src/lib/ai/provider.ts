// ============================================================
// DevLeveler — AI Provider Interface & Factory
// ============================================================

import type { AIProvider, AIProviderName, AIProviderConfig } from "./types";

// ---------------------------------------------------------------------------
// Provider Registry
// ---------------------------------------------------------------------------

const providerRegistry = new Map<AIProviderName, () => AIProvider>();

export function registerProvider(
  name: AIProviderName,
  factory: () => AIProvider
): void {
  providerRegistry.set(name, factory);
}

// ---------------------------------------------------------------------------
// Provider Factory
// ---------------------------------------------------------------------------

let cachedProvider: AIProvider | null = null;
let cachedProviderName: AIProviderName | null = null;

/**
 * Get the configured AI provider. Uses caching to avoid re-creation.
 * Provider selection is based on process.env.AI_PROVIDER (defaults to "gemini").
 */
export function getProvider(): AIProvider {
  const providerName = getProviderName();

  // Return cached provider if still valid
  if (cachedProvider && cachedProviderName === providerName) {
    return cachedProvider;
  }

  const factory = providerRegistry.get(providerName);
  if (!factory) {
    throw new Error(
      `AI provider "${providerName}" is not registered. ` +
      `Available: ${Array.from(providerRegistry.keys()).join(", ")}`
    );
  }

  cachedProvider = factory();
  cachedProviderName = providerName;
  return cachedProvider;
}

/**
 * Get the configured provider name from environment.
 */
export function getProviderName(): AIProviderName {
  if (process.env.AI_PROVIDER) {
    const raw = process.env.AI_PROVIDER.toLowerCase();
    const valid: AIProviderName[] = [
      "gemini", "openrouter", "openai", "claude",
      "deepseek", "groq", "mistral", "qwen",
    ];
    if (valid.includes(raw as AIProviderName)) {
      return raw as AIProviderName;
    }
    console.warn(`Unknown AI_PROVIDER "${raw}", checking available keys...`);
  }

  // Automatic selection based on available API keys
  if (process.env.OPENROUTER_API_KEY) {
    return "openrouter";
  }
  if (process.env.OPENAI_API_KEY) {
    return "openai";
  }
  if (process.env.GEMINI_API_KEY) {
    return "gemini";
  }

  return "openrouter";
}

/**
 * Get provider config from environment variables.
 */
export function getProviderConfig(): AIProviderConfig {
  const provider = getProviderName();
  const model = process.env.AI_MODEL || undefined;

  const envKeys: Record<AIProviderName, string> = {
    gemini: "GEMINI_API_KEY",
    openrouter: "OPENROUTER_API_KEY",
    openai: "OPENAI_API_KEY",
    claude: "ANTHROPIC_API_KEY",
    deepseek: "DEEPSEEK_API_KEY",
    groq: "GROQ_API_KEY",
    mistral: "MISTRAL_API_KEY",
    qwen: "QWEN_API_KEY",
  };

  const apiKey = process.env[envKeys[provider]] || "";

  // Base URLs for OpenRouter-compatible providers
  const baseUrls: Record<AIProviderName, string | undefined> = {
    gemini: undefined,
    openrouter: "https://openrouter.ai/api/v1",
    openai: "https://api.openai.com/v1",
    claude: "https://api.anthropic.com/v1",
    deepseek: "https://api.deepseek.com/v1",
    groq: "https://api.groq.com/openai/v1",
    mistral: "https://api.mistral.ai/v1",
    qwen: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  };

  return {
    provider,
    apiKey,
    model,
    baseUrl: baseUrls[provider],
    timeout: 30000,
    maxRetries: 2,
  };
}
