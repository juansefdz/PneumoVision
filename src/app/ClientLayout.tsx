"use client";

import { useState, useCallback } from "react";
import ResultPanel from "@/app/components/ResultPanel";
import XrayDropzone from "@/app/components/XrayDropzone";
import { useImageAnalyzer } from "@/app/hooks/useImageAnalyzer";

export default function ClientLayout() {
    const analyzer = useImageAnalyzer();
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = useCallback(() => {
        setIsFlipped(prev => !prev);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-start">
            <XrayDropzone {...analyzer} isFlipped={isFlipped} handleFlip={handleFlip} />
            <ResultPanel result={analyzer.result} loading={analyzer.loading} handleFlip={handleFlip} />
        </div>
    );
}