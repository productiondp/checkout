import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFDFF] text-[#292828] font-sans p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-[120px] font-black leading-none opacity-[0.03] select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <h2 className="text-4xl font-black uppercase tracking-tight italic">Page Not Found</h2>
          </div>
        </div>
        
        <p className="text-lg font-medium text-slate-400">
          The page you're looking for doesn't exist or has been moved to a new strategic location.
        </p>

        <div className="pt-8">
          <Link href="/home" className="inline-flex items-center justify-center px-12 h-16 bg-[#1D1D1F] text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-2xl active:scale-95">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="pt-20 opacity-20">
           <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Checkout Operating System</p>
        </div>
      </div>
    </div>
  );
}
