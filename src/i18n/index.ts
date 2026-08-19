import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { readLanguage } from "./language";

const resources = {
  en: { translation: {
    appName: "PDF Toolbox", privacy: "Files never leave your browser", tools: "Tools",
    convert: "PDF to images", convertDesc: "Render every page as a PNG or JPEG.",
    merge: "Merge PDFs", mergeDesc: "Combine files in the order you choose.",
    split: "Split PDF", splitDesc: "Export each page as a separate PDF.",
    selectPdf: "Choose PDF", selectPdfs: "Choose PDF files", dropHint: "or drop files here",
    output: "Output", format: "Image format", quality: "JPEG quality", scale: "Resolution",
    pagesReady: "{{count}} pages ready", filesReady: "{{count}} files selected",
    convertAction: "Convert pages", mergeAction: "Merge files", splitAction: "Split pages",
    downloadAll: "Download all", working: "Processing...", readyTitle: "Ready when you are",
    readyBody: "Select local PDF files to begin. Processing stays on this device.",
    error: "That PDF could not be processed. It may be damaged or password protected.",
    clear: "Clear", file: "File", size: "Size", pages: "Pages", language: "Language",
    reorder: "Files are merged in the order shown.", pageLabel: "Page {{page}}",
  } },
  "zh-CN": { translation: {
    appName: "PDF 工具箱", privacy: "文件不会离开你的浏览器", tools: "工具",
    convert: "PDF 转图片", convertDesc: "将每一页转换为 PNG 或 JPEG 图片。",
    merge: "合并 PDF", mergeDesc: "按选择顺序将多个文件合并为一个 PDF。",
    split: "拆分 PDF", splitDesc: "将每一页导出为单独的 PDF 文件。",
    selectPdf: "选择 PDF", selectPdfs: "选择多个 PDF", dropHint: "或将文件拖放到此处",
    output: "输出设置", format: "图片格式", quality: "JPEG 质量", scale: "清晰度",
    pagesReady: "已生成 {{count}} 页", filesReady: "已选择 {{count}} 个文件",
    convertAction: "转换页面", mergeAction: "合并文件", splitAction: "拆分页面",
    downloadAll: "全部下载", working: "正在处理...", readyTitle: "从这里开始",
    readyBody: "选择本地 PDF 文件开始处理，所有操作都在当前设备完成。",
    error: "无法处理此 PDF，它可能已损坏或受密码保护。",
    clear: "清空", file: "文件", size: "大小", pages: "页数", language: "语言",
    reorder: "文件将按列表顺序合并。", pageLabel: "第 {{page}} 页",
  } },
};

void i18n.use(initReactI18next).init({
  resources,
  lng: readLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
