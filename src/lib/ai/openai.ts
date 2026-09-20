// ============================================================
// DevLeveler — OpenAI Provider
// ============================================================

import type { AIProvider, ChatMessage, ChatSession } from "./types";
import { getProviderConfig } from "./provider";
import { DEFAULT_MODELS } from "./models";

// ---------------------------------------------------------------------------
// OpenAI Provider Implementation
// ---------------------------------------------------------------------------

export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(apiKey?: string, model?: string) {
    const config = getProviderConfig();
    this.apiKey = apiKey || config.apiKey;
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is not set.");
    }
    this.model = model || config.model || DEFAULT_MODELS.openai || "gpt-4o-mini";
    this.baseUrl = config.baseUrl || "https://api.openai.com/v1";
  }

  private async request(
    messages: Array<{ role: string; content: string }>,
    system?: string
  ): Promise<string> {
    const allMessages: Array<{ role: string; content: string }> = [];
    if (system) {
      allMessages.push({ role: "system", content: system });
    }
    allMessages.push(...messages);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: allMessages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async generateContent(prompt: string): Promise<string> {
    return this.request([{ role: "user", content: prompt }]);
  }

  async generateWithSystem(
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    return this.request(
      [{ role: "user", content: userPrompt }],
      systemPrompt
    );
  }

  startChat(
    history: ChatMessage[],
    systemInstruction?: string
  ): ChatSession {
    const messages = history.map((h) => ({
      role: h.role === "model" ? "assistant" : h.role,
      content: h.parts,
    }));

    return {
      sendMessage: async (message: string): Promise<string> => {
        const allMessages = [...messages, { role: "user", content: message }];
        const responseText = await this.request(allMessages, systemInstruction);
        messages.push({ role: "user", content: message });
        messages.push({ role: "assistant", content: responseText });
        return responseText;
      },
    };
  }
}
