"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileUploader from "@/components/FileUploader";
import { Files, Trash2, Download, ArrowRight, Loader2 } from "lucide-react";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResultUrl(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const newFiles = [...prev];
      [newFiles[index - 1], newFiles[index]] = [
        newFiles[index],
        newFiles[index - 1],
      ];
      return newFiles;
    });
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);

      // Save to history feature can be added here
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("Failed to merge PDFs. Ensure they are valid.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cleanup = () => {
    setFiles([]);
    setResultUrl(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <Files className="w-8 h-8 text-blue-600" />
          Merge PDF
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Combine multiple PDF files into one easily. Drag and drop to reorder.
        </p>
      </div>

      {!resultUrl && (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          accept=".pdf"
          multiple={true}
        />
      )}

      {files.length > 0 && !resultUrl && (
        <div className="glass-card p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Selected Files ({files.length})
          </h3>
          <ul className="space-y-3 mb-6">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-lg shrink-0">
                    <Files className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-xs md:max-w-md">
                    {file.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs text-slate-500 mr-2">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={mergePdfs}
              disabled={files.length < 2 || isProcessing}
              className="glass-button px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Merge Files
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {resultUrl && (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center mt-8 space-y-6 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
            <Files className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Merge Complete!
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Your PDFs have been successfully combined into a single file.
            </p>
          </div>
          <div className="flex gap-4 w-full max-w-sm">
            <a
              href={resultUrl}
              download="merged-result.pdf"
              className="flex-1 glass-button px-6 py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download
            </a>
            <button
              onClick={cleanup}
              className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Merge More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
