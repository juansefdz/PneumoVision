"use client";

import { useEffect } from "react";
import {
  X,
  BrainCircuit,
  Activity,
  Layers,
  Sparkles,
  Linkedin,
  ExternalLink,
  CheckCircle2,
  Cpu,
} from "lucide-react";

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectInfoModal({
  isOpen,
  onClose,
}: ProjectInfoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 z-10 overflow-hidden my-8 animate-in zoom-in-95 duration-300">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all focus:outline-none"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Activity className="w-6 h-6 text-blue-200" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white/90">
              Project Architecture & Overview
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            PneumoVision AI
          </h2>
          <p className="text-sm text-blue-100 mt-1 max-w-lg leading-relaxed">
            Intelligent Diagnostic Support System & Explainable Artificial Intelligence (GradCAM) for Chest Radiography.
          </p>
        </div>

        {/* Content Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto text-slate-600 leading-relaxed text-sm">
          {/* Section 1: Purpose */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-blue-600" />
              Project Purpose & Objective
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              PneumoVision AI was engineered as a dual-benchmark platform to compare custom deep convolutional architectures against pre-trained transfer learning models in detecting acute pulmonary conditions (Pneumonia vs Normal).
            </p>
          </div>

          {/* Section 2: Dataset & Testing */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-purple-600" />
              Dataset & Validation Benchmark
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Tested Dataset:</strong> Trained and evaluated on <strong>5,856 Chest X-Ray images</strong> (Pediatric Chest Radiographs).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Preprocessing:</strong> Symmetric Letterboxing to <code className="bg-slate-200 px-1 rounded">224x224</code> maintaining anatomical aspect ratios.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Hardware Acceleration:</strong> Model training executed on <strong>NVIDIA GeForce RTX 5060 Ti GPU</strong> via Keras 3 & PyTorch CUDA 12.8.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 3: Key Features */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Core Highlights & Explainability
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Equipped with real-time <strong>GradCAM (Gradient-weighted Class Activation Mapping)</strong> heatmaps to provide visual explainability, allowing medical personnel and developers to see exact neural attention regions.
            </p>
          </div>

          {/* Section 4: Contact & LinkedIn Call-to-Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 text-center space-y-4">
            <div className="inline-flex bg-blue-600 text-white p-3 rounded-2xl shadow-md shadow-blue-200">
              <Linkedin className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-extrabold text-slate-900">
                Let's Connect & Collaborate!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Hi! I'm <strong>Juansefdz</strong>, developer of PneumoVision AI. I build high-performance AI, Deep Learning pipelines, and modern Web Applications. Open for technical opportunities, feedback, and collaboration!
              </p>
            </div>

            <a
              href="https://www.linkedin.com/in/juansefdz/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-200 transition-all hover:scale-105"
            >
              <Linkedin className="w-4 h-4" />
              Connect on LinkedIn
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
