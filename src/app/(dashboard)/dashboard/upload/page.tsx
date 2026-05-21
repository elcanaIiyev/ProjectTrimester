import { UploadTool } from "@/components/upload/upload-tool";

export default function UploadPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">New Analysis</h1>
        <p className="text-sm text-muted-foreground">
          Upload CVs and provide a job description to get AI-ranked candidates.
        </p>
      </div>
      <UploadTool />
    </div>
  );
}
