export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractTextFromPDFs } from "@/lib/pdf/extract";
import { analyzeCVsAgainstJob } from "@/lib/ai/analyze";

export async function POST(request: Request) {
  try {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const jobDescription = formData.get("jobDescription");
  const cvFiles = formData.getAll("cvs") as File[];

  if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
    return NextResponse.json({ error: "Job description is required" }, { status: 400 });
  }

  if (!cvFiles.length) {
    return NextResponse.json({ error: "At least one CV is required" }, { status: 400 });
  }

  const pdfFiles = await Promise.all(
    cvFiles.map(async (file) => ({
      buffer: Buffer.from(await file.arrayBuffer()),
      fileName: file.name,
    }))
  );

  const extractedCVs = await extractTextFromPDFs(pdfFiles);

  if (!extractedCVs.length) {
    console.error("[analyze] All PDFs failed extraction. Files:", pdfFiles.map(f => f.fileName));
    return NextResponse.json(
      {
        error:
          "Could not extract text from the uploaded PDFs. Make sure the files are text-based PDFs (not scanned images). Check the server logs for details.",
      },
      { status: 422 }
    );
  }

  console.log(`[analyze] Extracted ${extractedCVs.length}/${pdfFiles.length} PDFs successfully`);

  const rankedResults = await analyzeCVsAgainstJob(extractedCVs, jobDescription);

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  const { data: job, error: jobError } = await supabase
    .from("analysis_jobs")
    .insert({
      user_id: user.id,
      job_description: jobDescription,
      status: "completed",
      cv_count: extractedCVs.length,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (jobError) {
    console.error("Failed to save analysis job:", jobError);
    return NextResponse.json({ results: rankedResults });
  }

  await supabase.from("cv_results").insert(
    rankedResults.map((r) => ({
      job_id: job.id,
      user_id: user.id,
      candidate_name: r.candidate_name,
      file_name: r.file_name,
      match_score: r.match_score,
      summary: r.summary,
      strengths: r.strengths,
      weaknesses: r.weaknesses,
      rank: r.rank,
      raw_text: extractedCVs.find((cv) => cv.fileName === r.file_name)?.text ?? "",
    }))
  );

  return NextResponse.json({
    job_id: job.id,
    results: rankedResults,
  });
  } catch (err) {
    console.error("[analyze] Unhandled error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
