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
  if (typeof globalThis.DOMMatrix === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).DOMMatrix = class DOMMatrix {
      constructor(_init?: string | number[]) {}
      static fromMatrix() { return new (globalThis as any).DOMMatrix(); }
      static fromFloat32Array() { return new (globalThis as any).DOMMatrix(); }
      static fromFloat64Array() { return new (globalThis as any).DOMMatrix(); }
    };
  }
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer), verbosity: 0 });
  const data = await parser.getText();
  return {
    fileName,
    text: data.text.trim(),
    pageCount: 0,
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
