"use client";

import { useCallback, useState } from "react";
import { UploadCloud, FileImage } from "lucide-react";

interface XrayDropzoneProps {
  onFileSelected: (file: File) => void;
  isAnalyzing: boolean;
}

export default function XrayDropzone({
  onFileSelected,
  isAnalyzing,
}: XrayDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onFileSelected(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer transition-all duration-300 ease-in-out
        border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center
        text-center min-h-[300px] bg-slate-50
        ${
          isDragging
            ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
            : "border-slate-300 hover:border-blue-400 hover:bg-slate-100"
        }
        ${isAnalyzing ? "opacity-50 pointer-events-none" : "opacity-100"}
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isAnalyzing}
      />

      <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:shadow-md transition-all">
        <UploadCloud
          className={`w-10 h-10 ${
            isDragging ? "text-blue-600" : "text-slate-400"
          }`}
        />
      </div>

      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        Arrastra tu Radiografía Aquí
      </h3>
      <p className="text-sm text-slate-500 max-w-xs">
        Soporta DICOM, JPEG, PNG. El sistema analizará automáticamente patrones
        de neumonía.
      </p>
    </div>
  );
}
