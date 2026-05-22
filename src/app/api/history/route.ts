export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: jobs, error } = await supabase
      .from("analysis_jobs")
      .select(`
        id,
        job_title,
        job_description,
        status,
        cv_count,
        created_at,
        completed_at,
        cv_results (
          id,
          candidate_name,
          file_name,
          match_score,
          rank
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[history] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ jobs: jobs ?? [] });
  } catch (err) {
    console.error("[history] Unhandled error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { job_description, cv_count, results } = body as {
      job_description: string;
      cv_count: number;
      results: {
        file_name: string;
        candidate_name: string;
        match_score: number;
        summary: string;
        strengths: string[];
        weaknesses: string[];
        rank: number;
      }[];
    };

    if (!job_description || !results?.length) {
      return NextResponse.json({ error: "job_description and results are required" }, { status: 400 });
    }

    await supabase.from("profiles").upsert(
      { id: user.id, email: user.email, full_name: user.user_metadata?.full_name ?? null },
      { onConflict: "id", ignoreDuplicates: true }
    );

    const { data: job, error: jobError } = await supabase
      .from("analysis_jobs")
      .insert({
        user_id: user.id,
        job_description,
        status: "completed",
        cv_count: cv_count ?? results.length,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (jobError) {
      console.error("[history] Failed to insert job:", jobError);
      return NextResponse.json({ error: jobError.message }, { status: 500 });
    }

    await supabase.from("cv_results").insert(
      results.map((r) => ({
        job_id: job.id,
        user_id: user.id,
        candidate_name: r.candidate_name,
        file_name: r.file_name,
        match_score: r.match_score,
        summary: r.summary,
        strengths: r.strengths,
        weaknesses: r.weaknesses,
        rank: r.rank,
      }))
    );

    return NextResponse.json({ job_id: job.id });
  } catch (err) {
    console.error("[history] Unhandled POST error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
