import { useCallback, useRef, useState } from "react";

export type AnalyzeResult = {
    label: string;
    score?: number;
    findings?: string[];
    meta?: Record<string, any>;
};

export function useImageAnalyzer() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeResult | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // SIMULADOR OJOO 
    const simulateResult = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);
        await new Promise(r => setTimeout(r, 1200));
        setResult({
            label: "Neumonía",
            score: 0.934,
            findings: [
                "Opacidades alveolares en lóbulo inferior derecho",
                "Patrón intersticial difuso leve",
                "Cardiomediastino sin ensanchamiento"
            ],
            meta: { mocked: true }
        });
        setLoading(false);
    }, []);

    const onSelect = useCallback(async (file: File) => {
        setErrorMsg(null);
        setResult(null);

        if (!file.type.startsWith("image/")) {
            return setErrorMsg("Por favor selecciona una imagen.");
        }
        if (file.size > 10 * 1024 * 1024) {
            return setErrorMsg("La imagen no puede superar los 10 MB.");
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        simulateResult();

    }, [simulateResult]);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onSelect(file);
    }, [onSelect]);

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onSelect(file);
        e.currentTarget.value = "";
    }, [onSelect]);


    return {
        previewUrl, dragActive, loading, errorMsg, result,
        inputRef, setDragActive, setPreviewUrl, setResult,
        onDrop, onChange,
    };
}