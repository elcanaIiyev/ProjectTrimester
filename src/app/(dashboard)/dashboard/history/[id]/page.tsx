import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResultsTable } from "@/components/results/results-table";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import type { CVAnalysisResult } from "@/lib/ai/analyze";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function HistoryDetailPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: job } = await supabase
    .from("analysis_jobs")
    .select(`
      id,
      job_title,
      job_description,
      status,
      cv_count,
      created_at,
      cv_results (
        id,
        candidate_name,
        file_name,
        match_score,
        summary,
        strengths,
        weaknesses,
        rank
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!job) notFound();

  const results: CVAnalysisResult[] = (
    (job.cv_results as CVAnalysisResult[]) ?? []
  ).sort((a, b) => a.rank - b.rank);

  const displayTitle =
    job.job_title ?? job.job_description.slice(0, 100) + (job.job_description.length > 100 ? "…" : "");

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-start gap-4">
        <Link
          href="/dashboard/history"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 shrink-0")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold line-clamp-2">{displayTitle}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(job.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              {job.cv_count} CV{job.cv_count !== 1 ? "s" : ""} analysed
            </span>
            <Badge variant={job.status === "completed" ? "default" : "secondary"}>
              {job.status}
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{job.job_description}</p>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Ranked Candidates</CardTitle>
          <CardDescription>{results.length} candidate{results.length !== 1 ? "s" : ""} ranked by match score</CardDescription>
        </CardHeader>
        <CardContent>
          {results.length > 0 ? (
            <ResultsTable results={results} jobId={job.id} />
          ) : (
            <p className="text-sm text-muted-foreground">No results found for this analysis.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
