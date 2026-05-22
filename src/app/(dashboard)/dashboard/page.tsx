import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Upload, FileText, BarChart3, Clock, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const firstName = user.user_metadata?.full_name?.split(" ")[0] ?? "there";

  const [{ count: totalJobs }, { data: cvStats }, { data: recentJobs }] = await Promise.all([
    supabase
      .from("analysis_jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("analysis_jobs")
      .select("cv_count")
      .eq("user_id", user.id),
    supabase
      .from("analysis_jobs")
      .select(`id, job_title, job_description, cv_count, created_at, cv_results(candidate_name, match_score, rank)`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const totalCVs = (cvStats ?? []).reduce((sum, j) => sum + (j.cv_count ?? 0), 0);
  const timeSaved = Math.round(totalCVs * 0.25);

  const stats = [
    { title: "Total Analyses", value: String(totalJobs ?? 0), desc: "Completed analyses", icon: BarChart3 },
    { title: "CVs Processed", value: String(totalCVs), desc: "Resumes analysed so far", icon: FileText },
    { title: "Time Saved", value: `${timeSaved}h`, desc: "Estimated hours saved", icon: Clock },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {firstName}</h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s an overview of your CV matching activity.
          </p>
        </div>
        <Link href="/dashboard/upload" className={cn(buttonVariants(), "gap-2")}>
          <Upload className="h-4 w-4" />
          New Analysis
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent analyses */}
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>Your most recent CV matching results</CardDescription>
          </div>
          {(recentJobs?.length ?? 0) > 0 && (
            <Link href="/dashboard/history" className={cn(buttonVariants({ variant: "outline" }), "gap-2 text-sm")}>
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {!recentJobs?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <FileText className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="mb-1 font-semibold">No analyses yet</h3>
              <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                Upload CVs and a job description to get your first AI-powered match results.
              </p>
              <Link href="/dashboard/upload" className={cn(buttonVariants(), "gap-2")}>
                Start your first analysis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {recentJobs.map((job) => {
                const top = (job.cv_results as { candidate_name: string; match_score: number; rank: number }[])
                  ?.sort((a, b) => a.rank - b.rank)[0];
                const title = job.job_title ?? job.job_description.slice(0, 80) + "…";
                return (
                  <div key={job.id} className="flex items-center justify-between py-3 text-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium line-clamp-1">{title}</span>
                      <span className="text-xs text-muted-foreground">
                        {job.cv_count} CVs · {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {top && (
                      <Badge variant="outline" className="shrink-0 ml-4">
                        {top.candidate_name} — {top.match_score}%
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
