"use client";

import { useState, useMemo } from "react";
import XrayDropzone from "./components/XrayDropzone";
import ResultPanel from "./components/ResultPanel";
import { useImageAnalyzer } from "./hooks/useImageAnalyzer";
import {
  Activity,
  BrainCircuit,
  Zap,
  RefreshCw,
  FileImage,
  SplitSquareHorizontal,
  ExternalLink, // Usamos este icono para el link externo
} from "lucide-react";

export default function Home() {
  const { analyzeImage, result, loading, error, resetAnalysis } =
    useImageAnalyzer();

  const [viewMode, setViewMode] = useState<
    "comparison" | "model_a" | "model_b"
  >("comparison");

  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    return currentFile ? URL.createObjectURL(currentFile) : null;
  }, [currentFile]);

  const handleFileDrop = (file: File) => {
    setCurrentFile(file);
    // Forzamos modo comparación al inicio para ver todo el potencial
    setViewMode("comparison");
    analyzeImage(file, "comparison");
  };

  const handleModeSwitch = (newMode: "comparison" | "model_a" | "model_b") => {
    if (newMode === viewMode) return;

    setViewMode(newMode);

    if (currentFile) {
      analyzeImage(currentFile, newMode);
    }
  };

  const handleReset = () => {
    setCurrentFile(null);
    resetAnalysis();
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar Superior */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm/50 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-200">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Pneumo<span className="text-blue-600">Vision</span> AI
            </span>
          </div>

          {currentFile && (
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <FileImage className="w-4 h-4" />
              <span className="truncate max-w-[200px]">{currentFile.name}</span>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 flex-grow w-full">
        {/* VISTA 1: SIN IMAGEN */}
        {!currentFile && (
          <div className="max-w-3xl mx-auto text-center space-y-10 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Diagnóstico Inteligente de Tórax
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Sube tu radiografía para comenzar. Podrás comparar el análisis
                de alta precisión (EfficientNet) con el modelo experimental en
                tiempo real.
              </p>
            </div>

            <div className="bg-white p-3 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 transition-all hover:scale-[1.01]">
              <XrayDropzone
                onFileSelected={handleFileDrop}
                isAnalyzing={loading}
              />
            </div>
          </div>
        )}

        {/* VISTA 2: CON IMAGEN */}
        {currentFile && (
          <div className="animate-in fade-in duration-500">
            {/* Toolbar de Control */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Vista:
                </span>

                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => handleModeSwitch("comparison")}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                      viewMode === "comparison"
                        ? "bg-white text-purple-600 shadow-sm ring-1 ring-black/5"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    } ${loading ? "opacity-70" : ""}`}
                  >
                    <SplitSquareHorizontal className="w-4 h-4" />
                    Comparar
                  </button>

                  <button
                    onClick={() => handleModeSwitch("model_a")}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                      viewMode === "model_a"
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    } ${loading ? "opacity-70" : ""}`}
                  >
                    <BrainCircuit className="w-4 h-4" />
                    EfficientNet
                  </button>

                  <button
                    onClick={() => handleModeSwitch("model_b")}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                      viewMode === "model_b"
                        ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    } ${loading ? "opacity-70" : ""}`}
                  >
                    <Zap className="w-4 h-4" />
                    Custom
                  </button>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="text-sm text-slate-500 hover:text-red-600 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                Subir otra imagen
              </button>
            </div>

            {/* Área de Contenido */}
            <div className="relative min-h-[500px]">
              {/* Estado: Cargando */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 gap-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden opacity-50">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Procesando"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                      <h3 className="text-xl font-bold text-slate-800">
                        Procesando Diagnóstico...
                      </h3>
                    </div>
                    <p className="text-slate-500">
                      {viewMode === "comparison"
                        ? "Ejecutando análisis dual..."
                        : "Generando mapa de calor..."}
                    </p>
                  </div>
                </div>
              )}

              {/* Estado: Error */}
              {!loading && error && (
                <div className="max-w-2xl mx-auto p-8 bg-red-50 border border-red-100 rounded-2xl text-center">
                  <div className="inline-flex bg-red-100 p-3 rounded-full mb-4">
                    <Zap className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">
                    Error en el Análisis
                  </h3>
                  <p className="text-red-600 mb-6">{error}</p>
                  <button
                    onClick={() => analyzeImage(currentFile!, viewMode)}
                    className="px-6 py-2 bg-white border border-red-200 text-red-700 font-semibold rounded-lg hover:bg-red-50"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              )}

              {/* Estado: Resultado */}
              {!loading && result && (
                <ResultPanel result={result} onReset={handleReset} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
          Desarrollado por{" "}
          <a
            href="https://www.linkedin.com/in/juansefdz/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 transition-all"
          >
            Juansefdz.DEV
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </footer>
    </main>
  );
}
