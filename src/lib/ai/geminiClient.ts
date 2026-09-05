import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  InstagramProfile,
  InstagramMediaItem,
  AccountPerformanceSummary,
  AIContentStrategyReport,
} from '@/types';
import { buildStrategyPrompt } from './prompts';
import { generateSynthesizedStrategy } from './synthesizer';

export { generateSynthesizedStrategy };

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

/**
 * Executes Cloud AI analysis using Google Gemini
 */
export async function generateContentStrategy(
  profile: InstagramProfile,
  performance: AccountPerformanceSummary,
  recentMedia: InstagramMediaItem[]
): Promise<AIContentStrategyReport> {
  const activeApiKey = (process.env.GEMINI_API_KEY || GEMINI_API_KEY || '').trim();

  // If API key is available, use real cloud LLM
  if (activeApiKey && activeApiKey.length > 5) {
    try {
      const genAI = new GoogleGenerativeAI(activeApiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const prompt = buildStrategyPrompt(profile, performance, recentMedia);
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Clean markdown code blocks if any
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned) as Omit<AIContentStrategyReport, 'generatedAt' | 'creatorHandle'>;

      return {
        ...parsed,
        generatedAt: new Date().toISOString(),
        creatorHandle: profile.username,
      };
    } catch (err: any) {
      console.warn('Gemini API call failed or hit quota, falling back to algorithmic synthesis:', err?.message);
    }
  }

  // Fallback / Sandbox high-precision synthesized strategy based on creator category
  return generateSynthesizedStrategy(profile, performance, recentMedia);
}
