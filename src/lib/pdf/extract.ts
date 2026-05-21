import { PDFParse } from "pdf-parse";

export interface ExtractedCV {
  fileName: string;
  text: string;
  pageCount: number;
}

export async function extractTextFromPDF(
  buffer: Buffer,
  fileName: string
): Promise<ExtractedCV> {
  const parser = new PDFParse({ data: new Uint8Array(buffer), verbosity: 0 });
  const data = await parser.getText();
  return {
    fileName,
    text: data.text.trim(),
    pageCount: 0,
  };
}

export async function extractTextFromPDFs(
  files: { buffer: Buffer; fileName: string }[]
): Promise<ExtractedCV[]> {
  const results = await Promise.allSettled(
    files.map(({ buffer, fileName }) => extractTextFromPDF(buffer, fileName))
  );

  return results
    .map((result, i) => {
      if (result.status === "fulfilled") return result.value;
      console.error(`Failed to parse ${files[i].fileName}:`, result.reason);
      return {
        fileName: files[i].fileName,
        text: "",
        pageCount: 0,
      };
    })
    .filter((cv) => cv.text.length > 0);
}
