import { getDocumentProxy, extractText } from "unpdf";

export interface ExtractedCV {
  fileName: string;
  text: string;
  pageCount: number;
  rawBuffer?: Buffer;
}

export async function extractTextFromPDF(
  buffer: Buffer,
  fileName: string
): Promise<ExtractedCV> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return {
    fileName,
    text: (Array.isArray(text) ? text.join("\n") : text).trim(),
    pageCount: pdf.numPages,
    rawBuffer: buffer,
  };
}

export async function extractTextFromPDFs(
  files: { buffer: Buffer; fileName: string }[]
): Promise<ExtractedCV[]> {
  const results = await Promise.allSettled(
    files.map(({ buffer, fileName }) => extractTextFromPDF(buffer, fileName))
  );

  const extracted: ExtractedCV[] = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled") {
      if (result.value.text.length === 0) {
        console.warn(`[pdf-extract] ${files[i].fileName}: no text found — will use vision mode`);
      }
      extracted.push(result.value);
    } else {
      console.error(`[pdf-extract] ${files[i].fileName}: ${String(result.reason)}`);
    }
  }
  return extracted;
}
