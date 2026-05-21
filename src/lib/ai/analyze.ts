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

const singleAnalysisSchema = z.object({
  candidate_name: cvAnalysisSchema.shape.candidate_name,
  match_score: cvAnalysisSchema.shape.match_score,
  summary: cvAnalysisSchema.shape.summary,
  strengths: cvAnalysisSchema.shape.strengths,
  weaknesses: cvAnalysisSchema.shape.weaknesses,
  file_name: z.string(),
});

const batchAnalysisSchema = z.object({
  results: z.array(singleAnalysisSchema),
});

export type CVAnalysisResult = z.infer<typeof singleAnalysisSchema> & {
  rank: number;
};

export async function analyzeCVsAgainstJob(
  cvs: ExtractedCV[],
  jobDescription: string
): Promise<CVAnalysisResult[]> {
  const textCVs = cvs.filter((cv) => cv.text.length > 0);
  const imageCVs = cvs.filter((cv) => cv.text.length === 0 && cv.rawBuffer);

  const allResults: z.infer<typeof singleAnalysisSchema>[] = [];

  if (textCVs.length > 0) {
    const cvsText = textCVs
      .map((cv, i) => `--- CV ${i + 1}: ${cv.fileName} ---\n${cv.text.slice(0, 6000)}`)
      .join("\n\n");

    const { object } = await generateObject({
      model: openrouter(DEFAULT_MODEL),
      schema: batchAnalysisSchema,
      prompt: `You are an expert recruiter AI. Analyze the following CVs against the job description and score each candidate.

JOB DESCRIPTION:
${jobDescription}

CVs TO ANALYZE:
${cvsText}

For each CV provide: candidate full name, the exact file_name, match score 0-100, 2-3 sentence summary, 3-5 strengths, 2-3 gaps. Be objective.`,
    });

    allResults.push(...object.results);
  }

  for (const cv of imageCVs) {
    const base64 = cv.rawBuffer!.toString("base64");

    const messages = [
      {
        role: "user" as const,
        content: [
          {
            type: "file" as const,
            data: base64,
            mediaType: "application/pdf" as const,
          },
          {
            type: "text" as const,
            text: `You are an expert recruiter AI. Analyze this CV (file: ${cv.fileName}) against the job description below and provide your assessment.

JOB DESCRIPTION:
${jobDescription}

Provide: candidate full name, file_name="${cv.fileName}", match score 0-100, 2-3 sentence summary, 3-5 strengths, 2-3 gaps. Be objective.`,
          },
        ],
      },
    ];

    const { object } = await generateObject({
      model: openrouter(DEFAULT_MODEL),
      schema: singleAnalysisSchema,
      messages,
    });

    allResults.push(object);
  }

  const ranked = allResults
    .sort((a, b) => b.match_score - a.match_score)
    .map((result, index) => ({ ...result, rank: index + 1 }));

  return ranked;
}
