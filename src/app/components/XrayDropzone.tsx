"use client";

import { useRef, useCallback } from "react";
import type { useImageAnalyzer } from "@/app/hooks/useImageAnalyzer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faTrashCan } from '@fortawesome/free-solid-svg-icons';

type Analyzer = ReturnType<typeof useImageAnalyzer>;

type XrayDropzoneProps = Analyzer & {
    isFlipped: boolean;
    handleFlip: () => void;
};

const EXAMPLE_HEATMAP_URL = "/example-heatmap.png";

export default function XrayDropzone(props: XrayDropzoneProps) {
    const {
        previewUrl, dragActive, loading, errorMsg, result, setResult,
        inputRef, setDragActive, setPreviewUrl, onDrop, onChange,
        isFlipped, handleFlip
    } = props;

    const dragCounterRef = useRef(0);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current++;
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current--;
        if (dragCounterRef.current === 0) {
            setDragActive(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        dragCounterRef.current = 0;
        const file = e.dataTransfer.files?.[0];
        if (file) {
            onDrop(e);
            if (isFlipped) handleFlip();
        }
    }, [onDrop, isFlipped, handleFlip]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(e);
            if (isFlipped) handleFlip();
        }
    }, [onChange, isFlipped, handleFlip]);

    return (
        <section
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={[
                "relative rounded-2xl border-2 border-dashed p-4 sm:p-6",
                "bg-gradient-to-br from-slate-900 to-slate-800/70",
                "h-full flex flex-col cursor-pointer transition-all duration-300",
                "min-h-[400px]",
                dragActive ? "border-sky-400 shadow-[0_0_0_3px_rgba(56,189,248,.25)" : "border-slate-600",
            ].join(" ")}
        >
            <div className="flex-1 relative grid place-items-center overflow-hidden rounded-xl perspective-1000">
                {!previewUrl ? (
                    <div className="text-center transition-opacity duration-300">
                        <p className="text-lg sm:text-xl font-semibold">Inserta radiografía de tórax</p>
                        <p className="text-sm text-slate-400">Arrastra aquí o haz clic para seleccionar</p>
                        <div className="mt-3 inline-block rounded border border-slate-600 px-3 py-1 text-xs text-slate-400">
                            JPG · PNG · WebP · máx. 10 MB
                        </div>
                    </div>
                ) : (
                    // El contenedor de la animación de volteo
                    <div className="relative w-full h-full transform-style-3d">
                        {/* La cara frontal (radiografía original) */}
                        <div className={`absolute w-full h-full backface-hidden transition-all duration-500 flex items-center justify-center ${isFlipped ? 'rotate-y-180 opacity-0' : 'rotate-y-0 opacity-100'}`}>
                            <img
                                src={previewUrl}
                                alt="Radiografía de tórax subida por el usuario"
                                className="max-h-full max-w-full object-contain rounded-xl"
                            />
                        </div>
                        {/* La cara trasera (mapa de calor) */}
                        <div className={`absolute w-full h-full backface-hidden transition-all duration-500 flex items-center justify-center ${isFlipped ? 'rotate-y-0 opacity-100' : 'rotate-y-180 opacity-0'}`}>
                            <img
                                src={EXAMPLE_HEATMAP_URL} // IMAGEN RESULTADO DEL BACK
                                alt="Radiografía de tórax con mapa de calor"
                                className="max-h-full max-w-full object-contain rounded-xl"
                            />
                        </div>
                    </div>
                )}
            </div>

            {previewUrl && result && (
                <div className="mt-4 flex flex-wrap gap-2 justify-end">
                    <button
                        className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium hover:bg-sky-700 transition-colors"
                        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                    >
                        <FontAwesomeIcon icon={faRotateLeft} className="mr-2" />
                        Cambiar imagen
                    </button>
                    <button
                        className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600 transition-colors"
                        onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setResult(null); }}
                    >
                        <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
                        Limpiar
                    </button>
                </div>
            )}

            {loading && (
                <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin-slow">
                        <svg className="h-10 w-10 text-sky-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <span className="text-sm text-slate-300">Analizando imagen…</span>
                </div>
            )}

            {errorMsg && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-rose-900/40 px-4 py-2 text-sm text-rose-200 ring-1 ring-rose-500/40 animate-fade-in-up transition-opacity">
                    <span className="font-semibold mr-2">Error:</span>
                    {errorMsg}
                </div>
            )}

            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} className="hidden" />
        </section>
    );
}