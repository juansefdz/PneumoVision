"use client";

import { useState, useEffect, useRef } from "react";

export interface ModelAnalysis {
  model_name: string;
  prediction: string;
  confidence: string | number;
  heatmap: string | null;
}

export interface AnalysisResult {
  left: ModelAnalysis | null;
  right: ModelAnalysis | null;
  original_image: string;
}

// Usar la ruta proxy del mismo origen (/api/backend) para evitar que bloqueadores de navegador (AdBlock) o antivirus filtren peticiones a dominios externos.
const API_BASE_URL = "/api/backend";

export const useImageAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const activeObjUrlRef = useRef<string | null>(null);

  const cleanupObjectUrl = () => {
    if (activeObjUrlRef.current) {
      URL.revokeObjectURL(activeObjUrlRef.current);
      activeObjUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanupObjectUrl();
    };
  }, []);

  const analyzeImage = async (
    file: File,
    mode: "comparison" | "model_a" | "model_b" = "comparison"
  ) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = "Server connection error";
        try {
          const errData = await response.json();
          errorMsg = errData.detail || errData.error || errorMsg;
        } catch {
          errorMsg = `Server error (${response.status})`;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      cleanupObjectUrl();
      const newObjUrl = URL.createObjectURL(file);
      activeObjUrlRef.current = newObjUrl;

      setResult({
        left: data.left,
        right: data.right,
        original_image: newObjUrl,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    cleanupObjectUrl();
    setResult(null);
    setError(null);
  };

  return { analyzeImage, result, loading, error, resetAnalysis, API_BASE_URL };
};
