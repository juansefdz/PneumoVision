"use client";
import type { AnalyzeResult } from "@/app/hooks/useImageAnalyzer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

type ResultPanelProps = {
    result: AnalyzeResult | null;
    loading: boolean;
    handleFlip: () => void;
};

export default function ResultPanel({ result, loading, handleFlip }: ResultPanelProps) {
    return (
        <aside className="rounded-2xl border-2 border-dashed border-slate-600 p-6 bg-slate-900/80 h-full flex flex-col justify-center text-center">
            <div className="min-h-[400px] flex flex-col justify-center">
                {loading ? (
                    <div className="animate-pulse">
                        <div className="mx-auto h-8 w-56 bg-slate-700/60 rounded-full" />
                        <div className="mt-6 space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-4 w-full bg-slate-700/40 rounded-full" />
                            ))}
                        </div>
                    </div>
                ) : result ? (
                    <div className="transition-opacity duration-500 opacity-100 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-semibold">Diagnóstico preliminar</h3>
                            <p className="mt-2 text-3xl font-bold text-sky-400">{result.label}</p>
                            {typeof result.score === "number" && (
                                <div className="mt-4">
                                    <p className="text-sm text-slate-400">Confianza</p>
                                    <div className="relative h-2 w-full max-w-xs mx-auto mt-1 rounded-full bg-slate-700 overflow-hidden ">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-sky-400 rounded-full transition-all duration-700 ease-out"
                                            style={{ width: `${result.score * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-slate-400 mt-2 text-lg">{(result.score * 100).toFixed(1)}%</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6">
                            <button
                                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium hover:bg-indigo-700 transition-colors w-full"
                                onClick={handleFlip}
                            >
                                <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
                                Ver mapa de calor
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="transition-opacity duration-500 opacity-100">
                        <h3 className="text-xl font-semibold">Resultado del análisis</h3>
                        <p className="text-slate-400 mt-2">
                            Sube una radiografía a la izquierda para ver aquí el diagnóstico y la confianza.
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
}