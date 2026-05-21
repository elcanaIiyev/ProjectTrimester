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
        {[
          {
            title: "Total Analyses",
            value: "0",
            desc: "Start your first analysis",
            icon: BarChart3,
          },
          {
            title: "CVs Processed",
            value: "0",
            desc: "Resumes analysed so far",
            icon: FileText,
          },
          {
            title: "Time Saved",
            value: "0h",
            desc: "Estimated hours saved",
            icon: Clock,
          },
        ].map((stat) => (
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

      {/* Empty state / recent analyses */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
          <CardDescription>Your most recent CV matching results</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
