// ============================================================
// DevLeveler — AI Model Registry
// ============================================================

import type { AIProviderName } from "./types";

export interface ModelConfig {
  id: string;
  provider: AIProviderName;
  displayName: string;
  maxTokens: number;
  contextWindow: number;
  supportsSystemPrompt: boolean;
  supportsChat: boolean;
  costPer1kInput?: number;
  costPer1kOutput?: number;
}

// ---------------------------------------------------------------------------
// Model definitions by provider
// ---------------------------------------------------------------------------

export const MODELS: Record<string, ModelConfig> = {
  // Gemini
  "gemini-2.0-flash": {
    id: "gemini-2.0-flash",
    provider: "gemini",
    displayName: "Gemini 2.0 Flash",
    maxTokens: 8192,
    contextWindow: 1048576,
    supportsSystemPrompt: true,
    supportsChat: true,
  },
  "gemini-2.5-pro": {
    id: "gemini-2.5-pro",
    provider: "gemini",
    displayName: "Gemini 2.5 Pro",
    maxTokens: 8192,
    contextWindow: 1048576,
    supportsSystemPrompt: true,
    supportsChat: true,
  },

  // OpenRouter (unified access to multiple providers)
  "openrouter/auto": {
    id: "openrouter/auto",
    provider: "openrouter",
    displayName: "OpenRouter Auto",
    maxTokens: 4096,
    contextWindow: 200000,
    supportsSystemPrompt: true,
    supportsChat: true,
  },
  "meta-llama/llama-3.3-70b-instruct": {
    id: "meta-llama/llama-3.3-70b-instruct",
    provider: "openrouter",
    displayName: "Llama 3.3 70B (OpenRouter)",
    maxTokens: 8192,
    contextWindow: 128000,
    supportsSystemPrompt: true,
    supportsChat: true,
  },
  "deepseek/deepseek-chat": {
    id: "deepseek/deepseek-chat",
    provider: "openrouter",
    displayName: "DeepSeek V3 (OpenRouter)",
    maxTokens: 8192,
    contextWindow: 64000,
    supportsSystemPrompt: true,
    supportsChat: true,
  },
  "google/gemini-2.0-flash-001": {
    id: "google/gemini-2.0-flash-001",
    provider: "openrouter",
    displayName: "Gemini 2.0 Flash (OpenRouter)",
    maxTokens: 8192,
    contextWindow: 1048576,
    supportsSystemPrompt: true,
    supportsChat: true,
  },

  // OpenAI
  "gpt-4o": {
    id: "gpt-4o",
    provider: "openai",
    displayName: "GPT-4o",
    maxTokens: 4096,
    contextWindow: 128000,
    supportsSystemPrompt: true,
    supportsChat: true,
    costPer1kInput: 0.005,
    costPer1kOutput: 0.015,
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    provider: "openai",
    displayName: "GPT-4o Mini",
    maxTokens: 4096,
    contextWindow: 128000,
    supportsSystemPrompt: true,
    supportsChat: true,
    costPer1kInput: 0.00015,
    costPer1kOutput: 0.0006,
  },

  // Claude
  "claude-sonnet-4-20250514": {
    id: "claude-sonnet-4-20250514",
    provider: "claude",
    displayName: "Claude Sonnet 4",
    maxTokens: 8192,
    contextWindow: 200000,
    supportsSystemPrompt: true,
    supportsChat: true,
  },

  // DeepSeek
  "deepseek-chat": {
    id: "deepseek-chat",
    provider: "deepseek",
    displayName: "DeepSeek Chat",
    maxTokens: 4096,
    contextWindow: 64000,
    supportsSystemPrompt: true,
    supportsChat: true,
  },

  // Groq
  "llama-3.3-70b-versatile": {
    id: "llama-3.3-70b-versatile",
    provider: "groq",
    displayName: "Llama 3.3 70B",
    maxTokens: 4096,
    contextWindow: 128000,
    supportsSystemPrompt: true,
    supportsChat: true,
  },

  // Mistral
  "mistral-large-latest": {
    id: "mistral-large-latest",
    provider: "mistral",
    displayName: "Mistral Large",
    maxTokens: 4096,
    contextWindow: 128000,
    supportsSystemPrompt: true,
    supportsChat: true,
  },

  // Qwen
  "qwen-max": {
    id: "qwen-max",
    provider: "qwen",
    displayName: "Qwen Max",
    maxTokens: 4096,
    contextWindow: 131072,
    supportsSystemPrompt: true,
    supportsChat: true,
  },
};

// ---------------------------------------------------------------------------
// Default models per provider
// ---------------------------------------------------------------------------

export const DEFAULT_MODELS: Record<AIProviderName, string> = {
  gemini: "gemini-2.0-flash",
  openrouter: "openrouter/auto",
  openai: "gpt-4o-mini",
  claude: "claude-sonnet-4-20250514",
  deepseek: "deepseek-chat",
  groq: "llama-3.3-70b-versatile",
  mistral: "mistral-large-latest",
  qwen: "qwen-max",
};

/**
 * Get model config by ID, falling back to the provider's default.
 */
export function getModelConfig(
  provider: AIProviderName,
  modelId?: string
): ModelConfig {
  const id = modelId || DEFAULT_MODELS[provider];
  const config = MODELS[id];
  if (!config) {
    throw new Error(`Unknown model: ${id}`);
  }
  return config;
}
