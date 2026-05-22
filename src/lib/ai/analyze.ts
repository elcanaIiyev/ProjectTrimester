import { generateText } from "ai";
import { openrouter, FREE_MODEL_FALLBACKS } from "./openrouter";
import type { ExtractedCV } from "@/lib/pdf/extract";

export interface CVAnalysisResult {
  file_name: string;
  candidate_name: string;
  match_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  rank: number;
}

interface RawResult {
  file_name: string;
  candidate_name: string;
  match_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
}

function extractJSON(text: string): unknown {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenceMatch ? fenceMatch[1] : text;
  const start = raw.indexOf("{") !== -1 ? raw.indexOf("{") : raw.indexOf("[");
  const end = Math.max(raw.lastIndexOf("}"), raw.lastIndexOf("]"));
  if (start === -1 || end === -1) throw new Error("No JSON found in response");
  return JSON.parse(raw.slice(start, end + 1));
}

export async function analyzeCVsAgainstJob(
  cvs: ExtractedCV[],
  jobDescription: string
): Promise<CVAnalysisResult[]> {
  const cvsText = cvs
    .map((cv, i) => `--- CV ${i + 1} | file_name: "${cv.fileName}" ---\n${cv.text.slice(0, 6000)}`)
    .join("\n\n");

  const prompt = `You are an expert recruiter AI. Analyze the following CVs against the job description and return a JSON object.

JOB DESCRIPTION:
${jobDescription}

CVs TO ANALYZE:
${cvsText}

Respond with ONLY a valid JSON object in this exact format (no markdown, no explanation):
{
  "results": [
    {
      "file_name": "<exact file_name from the CV header>",
      "candidate_name": "<full name from CV or 'Unknown'>",
      "match_score": <integer 0-100>,
      "summary": "<2-3 sentence fit summary>",
      "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
      "weaknesses": ["<gap 1>", "<gap 2>"]
    }
  ]
}`;

  let text = "";
  let lastError: unknown;
  for (const model of FREE_MODEL_FALLBACKS) {
    try {
      console.log(`[analyze] Trying model: ${model}`);
      const result = await generateText({
        model: openrouter(model),
        prompt,
        maxRetries: 1,
      });
      text = result.text;
      console.log(`[analyze] Success with model: ${model}`);
      break;
    } catch (err) {
      console.warn(`[analyze] Model ${model} failed:`, err instanceof Error ? err.message : err);
      lastError = err;
    }
  }

  if (!text) throw lastError ?? new Error("All models failed");

  const parsed = extractJSON(text) as { results: RawResult[] };

  if (!parsed?.results?.length) {
    throw new Error("AI returned no results");
  }

  return parsed.results
    .sort((a, b) => b.match_score - a.match_score)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}
