"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trophy, TrendingUp, TrendingDown, FileText } from "lucide-react";
import type { CVAnalysisResult } from "@/lib/ai/analyze";

interface ResultsTableProps {
  results: CVAnalysisResult[];
  jobId?: string;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-green-500/10 text-green-600 dark:text-green-400"
      : score >= 60
      ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
      : "bg-red-500/10 text-red-500";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold ${color}`}>
      {score}%
    </span>
  );
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-500" />;
  if (rank === 2) return <Trophy className="h-4 w-4 text-slate-400" />;
  if (rank === 3) return <Trophy className="h-4 w-4 text-amber-600" />;
  return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>;
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (!results.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {results.length} candidate{results.length > 1 ? "s" : ""} ranked
        </h3>
        <Badge variant="secondary">Sorted by match score</Badge>
      </div>

      <div className="space-y-3">
        {results.map((result) => (
          <Card key={result.file_name} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <RankIcon rank={result.rank} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{result.candidate_name}</CardTitle>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      {result.file_name}
                    </div>
                  </div>
                </div>
                <ScoreBadge score={result.match_score} />
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              <p className="text-sm text-muted-foreground">{result.summary}</p>

              <Separator />

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Strengths
                  </div>
                  <ul className="space-y-1">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
                    <TrendingDown className="h-3.5 w-3.5" />
                    Gaps
                  </div>
                  <ul className="space-y-1">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
