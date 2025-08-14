"use client";

import { useImageAnalyzer } from "@/app/hooks/useImageAnalyzer";

export default function ImageDropzone() {
    const {
        previewUrl,
        dragActive,
        loading,
        errorMsg,
        result,
        inputRef,
        setDragActive,
        onDrop,
        onChange,
    } = useImageAnalyzer();

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
            onDrop={onDrop}
            className="border-2 border-dashed rounded-lg p-6"
            onClick={() => inputRef.current?.click()}
        >
            {previewUrl ? (
                <img src={previewUrl} alt="preview" className="w-full h-auto" />
            ) : (
                <p>Arrastra o haz clic para subir</p>
            )}

            {loading && <p>Cargando...</p>}
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            {result && <p>Resultado: {result.label}</p>}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={onChange}
                className="hidden"
            />
        </div>
    );
}
