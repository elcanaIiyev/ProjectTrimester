import { generateObject } from "ai";
import { z } from "zod";
import { openrouter, DEFAULT_MODEL } from "./openrouter";
import type { ExtractedCV } from "@/lib/pdf/extract";

const cvAnalysisSchema = z.object({
  candidate_name: z.string().describe("Full name extracted from the CV, or 'Unknown' if not found"),
  match_score: z.number().min(0).max(100).describe("Overall match score from 0-100"),
  summary: z.string().describe("2-3 sentence summary of why this candidate is or isn't a good fit"),
  strengths: z.array(z.string()).describe("Top 3-5 strengths relevant to the job"),
  weaknesses: z.array(z.string()).describe("Top 2-3 gaps or weaknesses relative to the job"),
});

const batchAnalysisSchema = z.object({
  results: z.array(
    cvAnalysisSchema.extend({ file_name: z.string() })
  ),
});

export type CVAnalysisResult = z.infer<typeof cvAnalysisSchema> & {
  file_name: string;
  rank: number;
};

export async function analyzeCVsAgainstJob(
  cvs: ExtractedCV[],
  jobDescription: string
): Promise<CVAnalysisResult[]> {
  const cvsText = cvs
    .map(
      (cv, i) =>
        `--- CV ${i + 1}: ${cv.fileName} ---\n${cv.text.slice(0, 6000)}`
    )
    .join("\n\n");

  const { object } = await generateObject({
    model: openrouter(DEFAULT_MODEL),
    schema: batchAnalysisSchema,
    prompt: `You are an expert recruiter AI. Analyze the following CVs against the job description and score each candidate.

JOB DESCRIPTION:
${jobDescription}

CVs TO ANALYZE:
${cvsText}

For each CV, provide:
- The candidate's full name (extracted from CV)
- The exact file_name as provided
- A match score from 0-100 (100 = perfect match)
- A concise summary (2-3 sentences) explaining the fit
- 3-5 key strengths relevant to this role
- 2-3 gaps or weaknesses

Be objective, precise, and base your assessment strictly on the CV content vs job requirements.`,
  });

  const ranked = object.results
    .sort((a, b) => b.match_score - a.match_score)
    .map((result, index) => ({ ...result, rank: index + 1 }));

  return ranked;
}
