import { useState } from "react";
import { AnalysisResult, ModelAnalysis } from "../hooks/useImageAnalyzer";
import {
  AlertTriangle,
  CheckCircle2,
  ScanEye,
  Zap,
  Activity,
  Sliders,
  Printer,
  ShieldCheck,
  ShieldAlert,
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
  const percentage = Math.min(100, Math.max(0, Math.round(numericValue * 100)));
  const isHighConfidence = percentage >= 85;

  return (
    <div className="space-y-1.5 mt-3">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-slate-500">Diagnostic Certainty</span>
        <span className={percentage > 50 ? "text-slate-900 font-bold" : "text-slate-600"}>
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 border border-slate-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            percentage > 50
              ? isHighConfidence
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm"
                : "bg-gradient-to-r from-blue-500 to-indigo-500"
              : "bg-gradient-to-r from-amber-500 to-rose-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const ModelCard = ({
  title,
  subtitle,
  data,
  icon: Icon,
  originalImage,
  opacity,
  blendMode,
}: {
  title: string;
  subtitle: string;
  data: ModelAnalysis | null;
  icon: any;
  originalImage?: string;
  opacity: number;
  blendMode: "screen" | "multiply" | "normal";
}) => {
  if (!data) return null;

  const isNormal = data.prediction.toLowerCase() === "normal";
  const heatmapSrc = formatBase64(data.heatmap);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex-1 min-w-[320px] transition-all hover:shadow-2xl hover:border-slate-200">
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl ${
              title.includes("Advanced") || title.includes("ResNet")
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-purple-600 text-white shadow-lg shadow-purple-200"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 leading-tight">{title}</h3>
            <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
          </div>
        </div>
      </div>

      <div
        className={`text-center p-5 rounded-2xl mb-6 border transition-all ${
          isNormal
            ? "bg-emerald-50/70 border-emerald-200/80 text-emerald-900"
            : "bg-rose-50/70 border-rose-200/80 text-rose-900"
        }`}
      >
        <div className="flex justify-center mb-2">
          {isNormal ? (
            <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          ) : (
            <div className="p-2 bg-rose-100 rounded-full text-rose-600">
              <AlertTriangle className="w-7 h-7" />
            </div>
          )}
        </div>
        <h4 className="text-3xl font-black tracking-tight">{data.prediction}</h4>
        <p className="text-xs font-semibold opacity-75 mt-1 uppercase tracking-wider">
          AI Classified Result
        </p>
      </div>

      {heatmapSrc ? (
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Grad-CAM Heatmap Overlay
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              {Math.round(opacity * 100)}% Opacity
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-square shadow-inner bg-slate-950 group">
            {originalImage && (
              <img
                src={originalImage}
                alt="Anatomical X-Ray"
                className="absolute inset-0 w-full h-full object-contain opacity-75 grayscale transition-opacity duration-300 group-hover:opacity-90"
              />
            )}

            <img
              src={heatmapSrc}
              alt="GradCAM Attention Focus"
              style={{
                opacity: opacity,
                mixBlendMode: blendMode === "screen" ? "screen" : blendMode === "multiply" ? "multiply" : "normal",
              }}
              className="absolute inset-0 w-full h-full object-contain transition-all duration-200"
            />
          </div>
        </div>
      ) : (
        <div className="mb-6 p-6 bg-slate-50 rounded-2xl text-center border border-slate-100 flex flex-col justify-center items-center min-h-[220px]">
          <Activity className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-600">Full Numerical Analysis</p>
          <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
            No active heatmap for this mode.
          </p>
        </div>
      )}

      <div>
        <ConfidenceBar value={data.confidence} />
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-400">Clinical Risk:</span>
        {!isNormal ? (
          <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
            <ShieldAlert className="w-3.5 h-3.5" />
            Radiological Confirmation Required
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            No Pathological Patterns Found
          </span>
        )}
      </div>
    </div>
  );
};

export default function ResultPanel({ result, onReset }: ResultPanelProps) {
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.85);
  const [blendMode, setBlendMode] = useState<"screen" | "multiply" | "normal">("screen");

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
      {/* Results Header & Control Toolbar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Diagnostic Results
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Dual comparative evaluation between custom AI architecture and pre-trained benchmark
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* GradCAM Opacity Slider */}
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <Sliders className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
              GradCAM Opacity:
            </span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={heatmapOpacity}
              onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
              className="w-24 accent-blue-600 cursor-pointer"
            />
          </div>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            Print Report
          </button>

          <button
            onClick={onReset}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 transition-all"
          >
            Analyze Another Image
          </button>
        </div>
      </div>

      {/* Model Cards Comparison */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {result.right && (
          <ModelCard
            title="PneumoResNet SE Advanced"
            subtitle="Custom AI Model (Proprietary)"
            data={result.right}
            icon={Zap}
            originalImage={result.original_image}
            opacity={heatmapOpacity}
            blendMode={blendMode}
          />
        )}

        {result.left && (
          <ModelCard
            title="EfficientNet B0 Standard"
            subtitle="Pre-trained Model (Benchmark)"
            data={result.left}
            icon={ScanEye}
            originalImage={result.original_image}
            opacity={heatmapOpacity}
            blendMode={blendMode}
          />
        )}
      </div>
    </div>
  );
}
