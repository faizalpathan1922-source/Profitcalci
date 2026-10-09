import { GoogleGenAI } from '@google/genai';

/**
 * Checks whether a valid Gemini API key is configured.
 */
export function getGeminiApiKey(): string | null {
  // Check client-side env vars
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any)?.__GEMINI_API_KEY__;
  if (envKey && envKey !== 'MY_GEMINI_API_KEY' && envKey.trim().length > 10) {
    return envKey;
  }
  return null;
}

export function isGeminiConfigured(): boolean {
  return getGeminiApiKey() !== null;
}

export interface AiGenerationResult {
  success: boolean;
  content?: string;
  error?: string;
  isUnconfigured?: boolean;
}

/**
 * Generates content using Google Gemini API.
 * Strict Rule: If API is not configured, NEVER return fake/mocked content.
 */
export async function generateWithGemini(prompt: string, systemInstruction?: string): Promise<AiGenerationResult> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return {
      success: false,
      isUnconfigured: true,
      error: 'GEMINI_API_KEY is not configured in environment secrets. Real AI generation is required — fake content is disabled.',
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });

    if (!response.text) {
      return {
        success: false,
        error: 'Empty response returned by Gemini model.',
      };
    }

    return {
      success: true,
      content: response.text,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to generate content with Gemini API.',
    };
  }
}
