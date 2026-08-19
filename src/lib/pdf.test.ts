import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { mergePdfBytes, safeBaseName, splitPdfBytes } from "./pdf";

async function samplePdf(pages: number) {
  const pdf = await PDFDocument.create();
  Array.from({ length: pages }, () => pdf.addPage([200, 200]));
  return pdf.save();
}

describe("PDF operations", () => {
  it("merges every source page", async () => {
    const merged = await mergePdfBytes([
      (await samplePdf(1)).buffer as ArrayBuffer,
      (await samplePdf(2)).buffer as ArrayBuffer,
    ]);
    expect((await PDFDocument.load(merged)).getPageCount()).toBe(3);
  });

  it("splits pages into individual documents", async () => {
    const pages = await splitPdfBytes((await samplePdf(2)).buffer as ArrayBuffer);
    expect(pages).toHaveLength(2);
    expect((await PDFDocument.load(pages[0])).getPageCount()).toBe(1);
  });

  it("creates safe download names", () => {
    expect(safeBaseName("My report (final).PDF")).toBe("My-report-final");
    expect(safeBaseName("---.pdf")).toBe("document");
  });
});
