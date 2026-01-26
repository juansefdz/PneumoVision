"use client";

import { useState } from "react";

export interface ModelAnalysis {
  model_name: string;
  prediction: string;
  confidence: string;
  heatmap: string | null;
}

export interface AnalysisResult {
  left: ModelAnalysis | null;
  right: ModelAnalysis | null;
  original_image: string;
}

export const useImageAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = async (
    file: File,
    mode: "comparison" | "model_a" | "model_b" = "comparison",
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Error de conexión con el servidor");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        left: data.left,
        right: data.right,
        original_image: URL.createObjectURL(file),
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "No se pudo procesar la imagen");
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setError(null);
  };

  return { analyzeImage, result, loading, error, resetAnalysis };
};
