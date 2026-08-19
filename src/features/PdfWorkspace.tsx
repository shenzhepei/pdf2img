import { useEffect, useRef, useState } from "react";
import { Download, FileText, LoaderCircle, Trash2, UploadCloud } from "lucide-react";
import JSZip from "jszip";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useTranslation } from "react-i18next";
import type { ToolId } from "../components/ToolSidebar";
import { downloadBlob } from "../lib/download";
import { mergePdfBytes, safeBaseName, splitPdfBytes } from "../lib/pdf";

GlobalWorkerOptions.workerSrc = workerUrl;
type RenderedPage = { url: string; blob: Blob; name: string };

export function PdfWorkspace({ tool }: { tool: ToolId }) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [scale, setScale] = useState(1.5);
  const [quality, setQuality] = useState(0.9);

  useEffect(() => () => pages.forEach((page) => URL.revokeObjectURL(page.url)), [pages]);
  useEffect(() => {
    setFiles([]);
    setPages((current) => {
      current.forEach((page) => URL.revokeObjectURL(page.url));
      return [];
    });
    setError("");
  }, [tool]);

  const selectFiles = (incoming: FileList | File[]) => {
    const accepted = Array.from(incoming).filter((file) => file.type === "application/pdf" || /\.pdf$/i.test(file.name));
    setFiles(tool === "merge" ? accepted : accepted.slice(0, 1));
    setPages((current) => {
      current.forEach((page) => URL.revokeObjectURL(page.url));
      return [];
    });
    setError("");
  };

  const convert = async () => {
    const file = files[0];
    if (!file) return;
    const output: RenderedPage[] = [];
    const pdf = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (value) => value ? resolve(value) : reject(new Error("Image encoding failed")),
          "image/" + format,
          quality,
        );
      });
      output.push({
        blob,
        url: URL.createObjectURL(blob),
        name: safeBaseName(file.name) + "-" + String(pageNumber).padStart(2, "0") + "." + (format === "jpeg" ? "jpg" : "png"),
      });
    }
    setPages(output);
  };

  const processFiles = async () => {
    if (!files.length) return;
    setBusy(true);
    setError("");
    try {
      if (tool === "convert") {
        await convert();
      } else if (tool === "merge") {
        const bytes = await mergePdfBytes(await Promise.all(files.map((file) => file.arrayBuffer())));
        downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), "merged-document.pdf");
      } else {
        const source = files[0];
        const splitPages = await splitPdfBytes(await source.arrayBuffer());
        const zip = new JSZip();
        splitPages.forEach((bytes, index) => {
          zip.file(safeBaseName(source.name) + "-" + String(index + 1).padStart(2, "0") + ".pdf", bytes);
        });
        downloadBlob(await zip.generateAsync({ type: "blob" }), safeBaseName(source.name) + "-pages.zip");
      }
    } catch {
      setError(t("error"));
    } finally {
      setBusy(false);
    }
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    pages.forEach((page) => zip.file(page.name, page.blob));
    downloadBlob(await zip.generateAsync({ type: "blob" }), safeBaseName(files[0]?.name ?? "document") + "-images.zip");
  };

  const actionLabel = tool === "convert" ? "convertAction" : tool === "merge" ? "mergeAction" : "splitAction";
  const acceptsMultiple = tool === "merge";

  return (
    <main className="workspace">
      <div className="workspace__heading">
        <div><p className="eyebrow">{t("tools")}</p><h1>{t(tool)}</h1><p>{t(tool + "Desc")}</p></div>
        {files.length > 0 && <button className="icon-button" onClick={() => selectFiles([])} title={t("clear")} type="button"><Trash2 size={18} /></button>}
      </div>

      <section
        className={"drop-zone " + (files.length ? "has-files" : "")}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => { event.preventDefault(); selectFiles(event.dataTransfer.files); }}
      >
        <input
          accept="application/pdf,.pdf"
          hidden
          multiple={acceptsMultiple}
          onChange={(event) => event.target.files && selectFiles(event.target.files)}
          ref={inputRef}
          type="file"
        />
        {files.length ? (
          <div className="file-list">
            {files.map((file, index) => (
              <div className="file-row" key={file.name + "-" + index}>
                <span className="file-icon"><FileText size={20} /></span>
                <span><strong>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small></span>
                <span className="file-index">{String(index + 1).padStart(2, "0")}</span>
              </div>
            ))}
            {tool === "merge" && <p className="order-note">{t("reorder")}</p>}
          </div>
        ) : (
          <button className="drop-zone__button" onClick={() => inputRef.current?.click()} type="button">
            <UploadCloud size={28} /><strong>{t(acceptsMultiple ? "selectPdfs" : "selectPdf")}</strong><span>{t("dropHint")}</span>
          </button>
        )}
      </section>

      {tool === "convert" && files.length > 0 && (
        <section className="settings-band">
          <label>{t("format")}<select value={format} onChange={(event) => setFormat(event.target.value as "png" | "jpeg")}><option value="png">PNG</option><option value="jpeg">JPEG</option></select></label>
          <label>{t("scale")}<select value={scale} onChange={(event) => setScale(Number(event.target.value))}><option value="1">1x</option><option value="1.5">1.5x</option><option value="2">2x</option></select></label>
          {format === "jpeg" && <label>{t("quality")}<input max="1" min="0.5" onChange={(event) => setQuality(Number(event.target.value))} step="0.05" type="range" value={quality} /></label>}
        </section>
      )}

      {error && <p className="error-message">{error}</p>}
      {files.length > 0 && (
        <div className="action-bar">
          <span>{t("filesReady", { count: files.length })}</span>
          <button className="primary-button" disabled={busy} onClick={processFiles} type="button">
            {busy ? <LoaderCircle className="spin" size={18} /> : <Download size={18} />}
            {t(busy ? "working" : actionLabel)}
          </button>
        </div>
      )}

      {pages.length > 0 && (
        <section className="results">
          <div className="results__heading"><h2>{t("pagesReady", { count: pages.length })}</h2><button className="secondary-button" onClick={downloadAll} type="button"><Download size={17} />{t("downloadAll")}</button></div>
          <div className="preview-grid">
            {pages.map((page, index) => (
              <article className="page-preview" key={page.url}><img alt={t("pageLabel", { page: index + 1 })} src={page.url} /><span>{t("pageLabel", { page: index + 1 })}</span></article>
            ))}
          </div>
        </section>
      )}
      {!files.length && <div className="empty-state"><FileText size={32} /><h2>{t("readyTitle")}</h2><p>{t("readyBody")}</p></div>}
    </main>
  );
}
