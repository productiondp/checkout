
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-red-500 font-mono p-4">
      <h1 className="text-6xl font-black mb-4 uppercase italic">404 - Node Not Found</h1>
      <p className="text-xl opacity-80 uppercase">The requested coordinate does not exist in the Sentinel network.</p>
      <a href="/home" className="mt-8 px-6 py-2 border-2 border-red-500 hover:bg-red-500 hover:text-black transition-all uppercase font-black">
        Return to Core
      </a>
    </div>
  );
}
