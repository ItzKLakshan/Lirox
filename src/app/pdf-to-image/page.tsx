"use client";

import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import FileUploader from "@/components/FileUploader";
import { FileImage, Download, ArrowRight, Loader2, File } from "lucide-react";

// Configure pdf.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export default function PDFToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    setFile(newFiles[0]);
    setImages([]);
  };

  const extractImages = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const extractedImages: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;
          const imageUrl = canvas.toDataURL("image/png");
          extractedImages.push(imageUrl);
        }
      }

      setImages(extractedImages);
    } catch (error) {
      console.error("Error extracting images from PDF:", error);
      alert("Failed to convert PDF to images.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cleanup = () => {
    setFile(null);
    setImages([]);
  };

  const downloadImage = (url: string, index: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `page-${index + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <FileImage className="w-8 h-8 text-rose-600" />
          PDF to Image
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Convert each page of your PDF into high-quality PNG images.
        </p>
      </div>

      {!file && (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          accept=".pdf"
          multiple={false}
        />
      )}

      {file && images.length === 0 && (
        <div className="glass-card p-8 mt-8">
          <div className="flex items-center space-x-4 mb-8 bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl">
            <div className="bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 p-3 rounded-lg">
              <File className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {file.name}
              </h3>
              <p className="text-sm text-slate-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={cleanup}
              className="ml-auto text-sm text-rose-500 hover:text-rose-600 font-medium"
            >
              Cancel
            </button>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={extractImages}
              disabled={isProcessing}
              className="bg-rose-600 hover:bg-rose-700 text-white shadow-md px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Images...
                </>
              ) : (
                <>
                  Convert to Images
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="glass-card p-8 mt-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Success!
              </h2>
              <p className="text-slate-500 text-sm">
                Extracted {images.length} images.
              </p>
            </div>
            <button
              onClick={cleanup}
              className="text-sm font-medium text-rose-500 hover:text-rose-600"
            >
              Convert Another
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((imgUrl, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`Page ${index + 1}`}
                  className="w-full h-auto object-contain bg-slate-100 dark:bg-slate-900 aspect-[3/4]"
                />
                <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Page {index + 1}
                  </span>
                  <button
                    onClick={() => downloadImage(imgUrl, index)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
