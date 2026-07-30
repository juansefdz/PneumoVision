"use client";

import ResultPanel from "@/app/components/ResultPanel";
import XrayDropzone from "@/app/components/XrayDropzone";
import { useImageAnalyzer } from "@/app/hooks/useImageAnalyzer";

export default function ClientLayout() {
    const { analyzeImage, result, loading, resetAnalysis } = useImageAnalyzer();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-start">
            <XrayDropzone onFileSelected={(file) => analyzeImage(file)} isAnalyzing={loading} />
            {result && <ResultPanel result={result} onReset={resetAnalysis} />}
        </div>
    );
}