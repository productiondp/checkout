"use client";
export const runtime = 'edge';
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.signOut().then(() => {
        router.replace("/");
      });
    } else {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="animate-spin text-red-500" size={32} />
      <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Terminating Session...</p>
    </div>
  );
}


