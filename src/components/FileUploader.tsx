"use client";

import { useCallback, useState } from "react";
import { UploadCloud, File, X, Check } from "lucide-react";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
}

export default function FileUploader({
  onFilesSelected,
  accept,
  multiple = false,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const filesArray = Array.from(e.dataTransfer.files).filter((file) =>
          accept.split(",").some((type) => {
            const acceptType = type.trim();
            if (acceptType.startsWith(".")) {
              return file.name.endsWith(acceptType);
            }
            return file.type.match(new RegExp(acceptType.replace("*", ".*")));
          })
        );
        if (filesArray.length > 0) {
          if (!multiple) {
            onFilesSelected([filesArray[0]]);
          } else {
            onFilesSelected(filesArray);
          }
        }
      }
    },
    [accept, multiple, onFilesSelected]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(multiple ? filesArray : [filesArray[0]]);
    }
  };

  return (
    <div
      className={`glass-card p-12 text-center border-dashed border-2 relative transition-all duration-300 ${
        isDragOver
          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
          : "border-slate-300 dark:border-slate-700 hover:border-blue-400"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleChange}
      />
      <div className="flex flex-col items-center justify-center pointer-events-none">
        <UploadCloud
          className={`w-16 h-16 mb-4 transition-colors ${
            isDragOver ? "text-blue-500" : "text-slate-400 dark:text-slate-500"
          }`}
        />
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Drag & Drop your files here
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          or click to browse {accept.replace(/\./g, "").toUpperCase()} files
        </p>
      </div>
    </div>
  );
}
