"use client";

import { useState, useRef } from "react";

interface ImageDropzoneProps {
    onFileSelected?: (file: File) => void;
    loading?: boolean;
    errorMsg?: string | null;
}

export default function ImageDropzone({ onFileSelected, loading, errorMsg }: ImageDropzoneProps) {
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFile = (file: File) => {
        setPreviewUrl(URL.createObjectURL(file));
        if (onFileSelected) {
            onFileSelected(file);
        }
    };

    return (
        <div
            onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => {
                e.preventDefault();
                setDragActive(false);
            }}
            onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFile(e.dataTransfer.files[0]);
                }
            }}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400"
            }`}
            onClick={() => inputRef.current?.click()}
        >
            {previewUrl ? (
                <img src={previewUrl} alt="preview" className="w-full h-auto max-h-48 object-contain mx-auto" />
            ) : (
                <p className="text-slate-600">Arrastra o haz clic para subir radiografía</p>
            )}

            {loading && <p className="text-sm text-blue-600 mt-2">Cargando...</p>}
            {errorMsg && <p className="text-sm text-red-500 mt-2">{errorMsg}</p>}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]);
                    }
                }}
                className="hidden"
            />
        </div>
    );
}
