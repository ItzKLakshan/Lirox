"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileUploader from "@/components/FileUploader";
import { Image as ImageIcon, Trash2, Download, ArrowRight, Loader2, Plus } from "lucide-react";

export default function ImageToPDF() {
  const [images, setImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setImages((prev) => [...prev, ...newFiles]);
    setResultUrl(null);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const newImages = [...prev];
      [newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ];
      return newImages;
    });
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const imageFile of images) {
        const imageBytes = await imageFile.arrayBuffer();
        
        let pdfImage;
        if (imageFile.type === "image/jpeg" || imageFile.type === "image/jpg") {
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else if (imageFile.type === "image/png") {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
          continue; // skip unsupported
        }

        const { width, height } = pdfImage.scale(1);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (error) {
      console.error("Error creating PDF from images:", error);
      alert("Failed to convert images to PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cleanup = () => {
    setImages([]);
    setResultUrl(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <ImageIcon className="w-8 h-8 text-emerald-600" />
          Image to PDF
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Convert JPG and PNG images into a PDF document easily.
        </p>
      </div>

      {!resultUrl && (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          accept=".jpg,.jpeg,.png"
          multiple={true}
        />
      )}

      {images.length > 0 && !resultUrl && (
        <div className="glass-card p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Selected Images ({images.length})
            </h3>
            <button
              onClick={() => document.querySelector("input")?.click()}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add More
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {images.map((img, index) => (
              <div
                key={`${img.name}-${index}`}
                className="group relative bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-square flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(img)}
                  alt={img.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-2 bg-white/20 hover:bg-white/40 rounded-lg text-white disabled:opacity-30 transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-500/80 hover:bg-red-600/90 rounded-lg text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={convertToPdf}
              disabled={isProcessing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  Convert to PDF
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {resultUrl && (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center mt-8 space-y-6 bg-gradient-to-b from-emerald-50/50 to-white dark:from-slate-800 dark:to-slate-900 border-emerald-100 dark:border-emerald-900">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Conversion Complete!
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Your images have been packaged into a beautiful PDF.
            </p>
          </div>
          <div className="flex gap-4 w-full max-w-sm">
            <a
              href={resultUrl}
              download="images.pdf"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md px-6 py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download
            </a>
            <button
              onClick={cleanup}
              className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
