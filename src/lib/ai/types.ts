// ============================================================
// DevLeveler — AI Provider Types
// ============================================================

export interface ChatMessage {
  role: "user" | "model";
  parts: string;
}

export interface ChatSession {
  sendMessage(message: string): Promise<string>;
}

export interface AIProvider {
  /** Generate content from a single prompt */
  generateContent(prompt: string): Promise<string>;

  /** Generate content with system instruction + user prompt */
  generateWithSystem(
    systemPrompt: string,
    userPrompt: string
  ): Promise<string>;

  /** Start a multi-turn chat session */
  startChat(
    history: ChatMessage[],
    systemInstruction?: string
  ): ChatSession;
}

export type AIProviderName =
  | "gemini"
  | "openrouter"
  | "openai"
  | "claude"
  | "deepseek"
  | "groq"
  | "mistral"
  | "qwen";

export interface AIProviderConfig {
  provider: AIProviderName;
  apiKey: string;
  model?: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface AIRequestOptions {
  timeout?: number;
  maxRetries?: number;
}
