"use client";

import { useState, useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { toast } from "sonner";
import { Loader2, Upload, X, FileText, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultsTable } from "@/components/results/results-table";
import type { UploadedFile } from "@/types";
import type { CVAnalysisResult } from "@/lib/ai/analyze";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<CVAnalysisResult[]>([]);
  const [jobId, setJobId] = useState<string | undefined>();

  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    if (rejected.length > 0) {
      toast.error("Only PDF files are supported.");
    }

    const newFiles: UploadedFile[] = accepted.map((file) => ({
      file,
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      status: "idle",
    }));

    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const unique = newFiles.filter((f) => !existingNames.has(f.name));
      if (unique.length < newFiles.length) {
        toast.info("Duplicate files skipped.");
      }
      return [...prev, ...unique];
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
  });

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleAnalyze() {
    if (files.length === 0) {
      toast.error("Please upload at least one CV.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description.");
      return;
    }

    setIsAnalyzing(true);
    setResults([]);
    setJobId(undefined);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((p) => (p >= 85 ? 85 : p + 5));
    }, 800);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("cvs", f.file));
      formData.append("jobDescription", jobDescription);

      const res = await fetch("/api/analyze", { method: "POST", body: formData });

      let data: { error?: string; results?: CVAnalysisResult[]; job_id?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server error (${res.status}) — check the terminal logs`);
      }

      if (!res.ok) {
        throw new Error(data.error ?? `Analysis failed (${res.status})`);
      }

      const results = data.results ?? [];
      clearInterval(interval);
      setProgress(100);
      setResults(results);
      setJobId(data.job_id);
      toast.success(`Analysis complete — ${results.length} candidates ranked`);
    } catch (err) {
      clearInterval(interval);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Inputs */}
      <div className="flex flex-col gap-6">
        {/* CV Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload CVs
            </CardTitle>
            <CardDescription>
              Drag and drop PDF resumes or click to browse. Upload up to 50 files.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-sm font-medium text-primary">Drop PDFs here...</p>
              ) : (
                <>
                  <p className="text-sm font-medium">Drop PDF files here</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    or <span className="text-primary underline-offset-2 hover:underline">click to browse</span>
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">PDF only &middot; Max 10 MB per file</p>
                </>
              )}
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{files.length} file{files.length > 1 ? "s" : ""} selected</p>
                  <button
                    onClick={() => setFiles([])}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Remove all
                  </button>
                </div>
                <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">PDF</Badge>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>
              Describe the role so our AI knows what to match against.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="paste">
              <TabsList className="mb-4">
                <TabsTrigger value="paste">Paste text</TabsTrigger>
                <TabsTrigger value="upload" disabled>Upload file (soon)</TabsTrigger>
              </TabsList>
              <TabsContent value="paste">
                <div className="space-y-1.5">
                  <Label htmlFor="job-desc" className="sr-only">Job description</Label>
                  <Textarea
                    id="job-desc"
                    placeholder="Paste the full job description here — include required skills, responsibilities, and qualifications for the best results..."
                    className="min-h-40 resize-none"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  <p className="text-right text-xs text-muted-foreground">
                    {jobDescription.length} characters
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right: Analyze + Results placeholder */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Analyze &amp; Match
            </CardTitle>
            <CardDescription>
              Our AI will read every CV and rank candidates by fit.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 rounded-lg bg-muted/50 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">CVs ready</span>
                <span className="font-medium">{files.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Job description</span>
                <span className="font-medium">
                  {jobDescription.trim() ? "Ready" : "Missing"}
                </span>
              </div>
            </div>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Analysing CVs...</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <Button
              className="w-full gap-2"
              onClick={handleAnalyze}
              disabled={isAnalyzing || files.length === 0 || !jobDescription.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analysing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyse &amp; Match CVs
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Ranked candidates will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <ResultsTable results={results} jobId={jobId} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Sparkles className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload CVs and a job description, then click &quot;Analyse &amp; Match&quot; to see ranked results.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
