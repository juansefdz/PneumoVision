import ClientLayout from "./ClientLayout";
import Image from "next/image";

export default function Page() {
  return (
    <main className="relative isolate min-h-screen bg-gradient-to-b from-[#0c1624] to-[#0a1220] text-slate-100 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none select-none fixed inset-0 z-0 flex items-start justify-center"
      >
        <div className="relative w-full h-full mt-8">
          <Image
            src="/logo.png"
            alt=""
            fill
            sizes="200vmin"
            className="object-contain opacity-25 drop-shadow-[0_0_40px_#00e7ff]"
            priority
          />
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4">
        <div className="mt-6 mb-6">
          <h1
            className="relative text-6xl sm:text-7xl font-extrabold tracking-tight 
             text-transparent bg-clip-text 
             bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-200
             text-center
             [text-shadow:0_0_6px_#22d3ee,0_0_12px_rgba(14,165,233,0.6)]"
          >
            PNEUMOVISION
          </h1>
        </div>

        <div className="w-full max-w-6xl">
          <ClientLayout />
        </div>
      </div>
    </main>
  );
}
