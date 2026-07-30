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

const PROD_DIRECT_URL = "https://pneumovision-python.onrender.com";

export const fetchWithFallback = async (endpoint: string, options?: RequestInit) => {
  try {
    const res = await fetch(`/api/backend${endpoint}`, options);
    if (res.ok) return res;
    if (res.status === 502 || res.status === 504 || res.status === 503) {
      console.warn(
        `[PneumoVision] Proxy returned ${res.status} (Render cold start). Retrying directly to Render URL...`
      );
      return await fetch(`${PROD_DIRECT_URL}${endpoint}`, options);
    }
    return res;
  } catch (err) {
    console.warn(
      "[PneumoVision] Proxy request failed. Retrying directly to Render URL...",
      err
    );
    return await fetch(`${PROD_DIRECT_URL}${endpoint}`, options);
  }
};

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
      const response = await fetchWithFallback("/predict", {
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

  return { analyzeImage, result, loading, error, resetAnalysis };
};
