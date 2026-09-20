// ============================================================
// DevLeveler — Gemini AI Provider
// ============================================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider, ChatMessage, ChatSession } from "./types";
import { getProviderConfig } from "./provider";
import { DEFAULT_MODELS } from "./models";

// ---------------------------------------------------------------------------
// Gemini Provider Implementation
// ---------------------------------------------------------------------------

export class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey?: string, model?: string) {
    const config = getProviderConfig();
    const key = apiKey || config.apiKey;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not set.");
    }
    this.genAI = new GoogleGenerativeAI(key);
    this.modelName = model || config.model || DEFAULT_MODELS.gemini;
  }

  private getModel() {
    return this.genAI.getGenerativeModel({ model: this.modelName });
  }

  async generateContent(prompt: string): Promise<string> {
    const model = this.getModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async generateWithSystem(
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: systemPrompt,
    });
    const result = await model.generateContent(userPrompt);
    return result.response.text();
  }

  startChat(
    history: ChatMessage[],
    systemInstruction?: string
  ): ChatSession {
    const modelParams: { model: string; systemInstruction?: string } = {
      model: this.modelName,
    };
    if (systemInstruction) {
      modelParams.systemInstruction = systemInstruction;
    }

    const model = this.genAI.getGenerativeModel(modelParams);

    const chat = model.startChat({
      history: history.map((h) => ({
        role: h.role,
        parts: [{ text: h.parts }],
      })),
    });

    return {
      sendMessage: async (message: string): Promise<string> => {
        const result = await chat.sendMessage(message);
        return result.response.text();
      },
    };
  }
}
