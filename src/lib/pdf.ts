import { PDFDocument } from "pdf-lib";

export async function mergePdfBytes(files: ArrayBuffer[]): Promise<Uint8Array> {
  const output = await PDFDocument.create();
  for (const bytes of files) {
    const source = await PDFDocument.load(bytes);
    const pages = await output.copyPages(source, source.getPageIndices());
    pages.forEach((page) => output.addPage(page));
  }
  return output.save();
}

export async function splitPdfBytes(bytes: ArrayBuffer): Promise<Uint8Array[]> {
  const source = await PDFDocument.load(bytes);
  return Promise.all(source.getPageIndices().map(async (index) => {
    const output = await PDFDocument.create();
    const [page] = await output.copyPages(source, [index]);
    output.addPage(page);
    return output.save();
  }));
}

export function safeBaseName(name: string) {
  return name
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "document";
}
