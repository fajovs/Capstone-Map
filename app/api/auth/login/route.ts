// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ session: data.session });
}