import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black text-blue-500 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-slate-400 mb-6 max-w-md">
        The route you are trying to access does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
      >
        Back to Home
      </Link>
    </main>
  );
}
