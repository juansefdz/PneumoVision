<<<<<<< HEAD
import { AnalysisResult, ModelAnalysis } from "../hooks/useImageAnalyzer";
import {
  AlertTriangle,
  CheckCircle2,
  ScanEye,
  Zap,
  Activity,
} from "lucide-react";

interface ResultPanelProps {
  result: AnalysisResult;
  onReset: () => void;
}

const formatBase64 = (b64: string | null) => {
  if (!b64) return null;
  return b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}`;
};

const ConfidenceBar = ({ value }: { value: string | number }) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  const percentage = Math.round(numericValue * 100);
  const colorClass = percentage > 50 ? "bg-red-500" : "bg-green-500";

  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
      <div
        className={`${colorClass} h-2.5 rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
      <p className="text-xs text-right mt-1 text-slate-500">
        {percentage}% Confianza
      </p>
    </div>
  );
};

const ModelCard = ({
  title,
  data,
  icon: Icon,
  originalImage,
}: {
  title: string;
  data: ModelAnalysis | null;
  icon: any;
  originalImage?: string;
}) => {
  if (!data) return null;

  const isNormal = data.prediction.toLowerCase() === "normal";
  const heatmapSrc = formatBase64(data.heatmap);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex-1 min-w-[300px]">
      <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
        <div
          className={`p-2 rounded-lg ${
            title.includes("Efficient")
              ? "bg-purple-100 text-purple-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>

      <div
        className={`text-center p-4 rounded-xl mb-6 ${
          isNormal
            ? "bg-green-50 border border-green-100"
            : "bg-red-50 border border-red-100"
        }`}
      >
        <div className="flex justify-center mb-2">
          {isNormal ? (
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-red-600" />
          )}
        </div>
        <h4
          className={`text-2xl font-extrabold ${
            isNormal ? "text-green-700" : "text-red-700"
          }`}
        >
          {data.prediction}
        </h4>
        <p className="text-sm opacity-80 text-slate-600">Diagnóstico IA</p>
      </div>

      {heatmapSrc ? (
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
            Zona Detectada (Grad-CAM)
          </p>

          <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-square shadow-inner bg-slate-900 group">
            {originalImage && (
              <img
                src={originalImage}
                alt="Contexto Anatómico"
                className="absolute inset-0 w-full h-full object-contain opacity-50 grayscale transition-opacity duration-300 group-hover:opacity-70"
              />
            )}

            <img
              src={heatmapSrc}
              alt="Foco de Atención IA"
              className="absolute inset-0 w-full h-full object-contain opacity-90 mix-blend-screen blur-md transition-all duration-500 scale-105"
            />
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-slate-50 rounded-xl text-center border border-slate-100 flex flex-col justify-center min-h-[150px]">
          <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-400 italic">
            Análisis numérico directo.
            <br />
            Sin mapa de calor disponible.
          </p>
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-slate-600 mb-1">
          Certeza del diagnóstico
        </p>
        <ConfidenceBar value={data.confidence} />
      </div>
    </div>
  );
};

export default function ResultPanel({ result, onReset }: ResultPanelProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Resultados del Análisis
          </h2>
          <p className="text-slate-500">
            Comparación en tiempo real entre arquitecturas
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Nueva Imagen
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {result.left && (
          <ModelCard
            title="EfficientNet B0 (Standard)"
            data={result.left}
            icon={ScanEye}
            originalImage={result.original_image}
          />
        )}

        {result.right && (
          <ModelCard
            title="Custom ResNet (Experimental)"
            data={result.right}
            icon={Zap}
            originalImage={result.original_image}
          />
        )}
      </div>
    </div>
  );
}
=======
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
>>>>>>> 58567374ab86cddc3f21410f6711b1b9e260c09e
