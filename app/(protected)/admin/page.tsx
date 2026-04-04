'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";


export default function AdminPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error.message);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
  
        <h1 className="text-xl font-bold">Admin Page</h1>

  );
}