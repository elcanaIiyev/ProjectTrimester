import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, FileText, Trophy, Calendar, ArrowRight } from "lucide-react";
import { DeleteJobButton } from "@/components/history/delete-job-button";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: jobs } = await supabase
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

  const analyses = jobs ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analysis History</h1>
          <p className="text-sm text-muted-foreground">
            {analyses.length > 0
              ? `${analyses.length} analysis${analyses.length === 1 ? "" : "es"} completed`
              : "No analyses yet"}
          </p>
        </div>
        <Link href="/dashboard/upload" className={cn(buttonVariants(), "gap-2")}>
          <Upload className="h-4 w-4" />
          New Analysis
        </Link>
      </div>

      {analyses.length === 0 ? (
        <Card className="flex-1">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FileText className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mb-1 font-semibold">No analyses yet</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Run your first CV analysis to see results here.
            </p>
            <Link href="/dashboard/upload" className={cn(buttonVariants(), "gap-2")}>
              Start your first analysis
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {analyses.map((job) => {
            const topCandidate = (job.cv_results as { candidate_name: string; match_score: number; rank: number }[])
              ?.sort((a, b) => a.rank - b.rank)[0];
            const snippet = job.job_description.slice(0, 120).trim();
            const displayTitle = job.job_title ?? (snippet + (job.job_description.length > 120 ? "…" : ""));

            return (
              <Link key={job.id} href={`/dashboard/history/${job.id}`}>
              <Card className="transition-all hover:shadow-md hover:border-primary/40 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base leading-snug line-clamp-2">
                        {displayTitle}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        {new Date(job.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge variant={job.status === "completed" ? "default" : "secondary"}>
                        {job.status}
                      </Badge>
                      <DeleteJobButton jobId={job.id} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{job.cv_count} CV{job.cv_count !== 1 ? "s" : ""} analysed</span>
                    </div>
                    {topCandidate && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span>
                          Top match:{" "}
                          <span className="font-medium text-foreground">
                            {topCandidate.candidate_name}
                          </span>{" "}
                          <Badge variant="outline" className="ml-1 text-xs">
                            {topCandidate.match_score}%
                          </Badge>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end pt-1">
                    <span className="flex items-center gap-1 text-xs text-primary">
                      View results <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
