export type UserRole = "recruiter" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AnalysisJob {
  id: string;
  user_id: string;
  job_description: string;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
}

export interface CvResult {
  id: string;
  job_id: string;
  file_name: string;
  file_url: string;
  score: number;
  explanation: string;
  strengths: string[];
  weaknesses: string[];
  rank: number;
  created_at: string;
}

export interface AnalysisResult {
  job: AnalysisJob;
  results: CvResult[];
}

export interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
  status: "idle" | "uploading" | "done" | "error";
  error?: string;
}
