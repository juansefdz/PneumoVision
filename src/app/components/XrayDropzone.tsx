"use client";

import { useState } from "react";
import { UploadCloud, Sparkles, FileText, CheckCircle, AlertTriangle } from "lucide-react";

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

  const generateSampleXray = (type: "normal" | "pneumonia") => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dark chest background
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, 512, 512);

    // Rib / Lung contours
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 6;

    // Left Lung
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.ellipse(160, 260, 90, 160, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Right Lung
    ctx.beginPath();
    ctx.ellipse(352, 260, 90, 160, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Spine / Sternum
    ctx.fillStyle = "#475569";
    ctx.fillRect(246, 60, 20, 400);

    // If pneumonia, create localized opaque infiltrate
    if (type === "pneumonia") {
      const grad = ctx.createRadialGradient(350, 280, 10, 350, 280, 80);
      grad.addColorStop(0, "rgba(248, 250, 252, 0.9)");
      grad.addColorStop(0.4, "rgba(226, 232, 240, 0.6)");
      grad.addColorStop(1, "rgba(30, 41, 59, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(350, 280, 80, 0, 2 * Math.PI);
      ctx.fill();
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `sample_${type}_xray.png`, {
          type: "image/png",
        });
        onFileSelected(file);
      }
    }, "image/png");
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer transition-all duration-300 ease-out
          border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center
          text-center min-h-[320px] bg-slate-50/80 backdrop-blur-sm
          ${
            isDragging
              ? "border-blue-500 bg-blue-50/60 scale-[1.01] shadow-lg shadow-blue-100"
              : "border-slate-300 hover:border-blue-500 hover:bg-slate-100/80"
          }
          ${isAnalyzing ? "opacity-50 pointer-events-none" : "opacity-100"}
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isAnalyzing}
        />

        <div className="bg-white p-5 rounded-2xl shadow-md shadow-slate-200/60 mb-5 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
          <UploadCloud
            className={`w-10 h-10 transition-colors ${
              isDragging
                ? "text-blue-600"
                : "text-slate-400 group-hover:text-white"
            }`}
          />
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Drag & Drop Your Chest X-Ray Here
        </h3>
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-4">
          Supports <span className="font-semibold text-slate-700">JPEG, PNG, WEBP</span> formats. Dual AI analysis with GradCAM medical attention gradients.
        </p>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <Sparkles className="w-3.5 h-3.5" />
          Click or drag to upload
        </div>
      </div>

      {/* Demo Sample Buttons */}
      <div className="pt-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
          Don't have an X-ray? Try an instant demo sample:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => generateSampleXray("normal")}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-all shadow-sm hover:shadow"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Try Normal X-Ray Sample
          </button>

          <button
            type="button"
            onClick={() => generateSampleXray("pneumonia")}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-all shadow-sm hover:shadow"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Try Pneumonia X-Ray Sample
          </button>
        </div>
      </div>
    </div>
  );
}
