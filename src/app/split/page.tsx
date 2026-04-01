"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileUploader from "@/components/FileUploader";
import { SplitSquareHorizontal, Download, ArrowRight, Loader2, File } from "lucide-react";

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFilesSelected = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    const selectedFile = newFiles[0];
    setFile(selectedFile);
    setResultUrl(null);

    // Get page count
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPageCount(pdfDoc.getPageCount());
      setRangeInput(`1-${pdfDoc.getPageCount()}`);
    } catch (e) {
      console.error(e);
      alert("Invalid PDF file");
      setFile(null);
    }
  };

  const splitPdf = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      // Parse ranges (e.g., "1,3,5-7")
      const ranges = rangeInput.split(",").map((s) => s.trim());
      const indicesToExtract = new Set<number>();

      for (const range of ranges) {
        if (range.includes("-")) {
          const [startStr, endStr] = range.split("-");
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          if (!isNaN(start) && !isNaN(end) && start > 0 && end <= pageCount) {
            for (let i = start; i <= end; i++) indicesToExtract.add(i - 1);
          }
        } else {
          const num = parseInt(range, 10);
          if (!isNaN(num) && num > 0 && num <= pageCount) {
            indicesToExtract.add(num - 1);
          }
        }
      }

      if (indicesToExtract.size === 0) {
        alert("Please enter a valid page range.");
        setIsProcessing(false);
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const sortedIndices = Array.from(indicesToExtract).sort((a, b) => a - b);
      const copiedPages = await newPdf.copyPages(pdf, sortedIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (error) {
      console.error("Error splitting PDFs:", error);
      alert("Failed to split PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cleanup = () => {
    setFile(null);
    setPageCount(0);
    setResultUrl(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <SplitSquareHorizontal className="w-8 h-8 text-indigo-600" />
          Split PDF
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Extract specific pages from your PDF quickly and securely.
        </p>
      </div>

      {!file && !resultUrl && (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          accept=".pdf"
          multiple={false}
        />
      )}

      {file && !resultUrl && (
        <div className="glass-card p-8 mt-8">
          <div className="flex items-center space-x-4 mb-8 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 p-3 rounded-lg">
              <File className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {file.name}
              </h3>
              <p className="text-sm text-slate-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {pageCount} Pages
              </p>
            </div>
            <button
              onClick={cleanup}
              className="ml-auto text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Pages to Extract (e.g., 1-5, 8, 11-13)
            </label>
            <input
              type="text"
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder="1, 3-5"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
            />
            <p className="text-xs text-slate-500">
              Your document has {pageCount} pages total.
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={splitPdf}
              disabled={isProcessing || !rangeInput.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Extract Pages
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {resultUrl && (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center mt-8 space-y-6 bg-gradient-to-b from-indigo-50/50 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
            <SplitSquareHorizontal className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Extraction Complete!
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Your new document with the extracted pages is ready.
            </p>
          </div>
          <div className="flex gap-4 w-full max-w-sm">
            <a
              href={resultUrl}
              download={`split-${file?.name || "document.pdf"}`}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md px-6 py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download
            </a>
            <button
              onClick={cleanup}
              className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Split More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
