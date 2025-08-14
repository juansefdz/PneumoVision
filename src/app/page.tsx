import ClientLayout from "./ClientLayout";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0c1624] to-[#0a1220] text-slate-100">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-6xl w-full">
          <h1 className="text-3xl font-extrabold tracking-tight mb-8 text-center">PNEUMOVISION</h1>
          <ClientLayout />
        </div>
      </div>
    </main>
  );
}