import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getEnvironmentVariables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return { supabaseUrl, supabaseServiceKey };
}

export async function createSupabaseServerClient() {
  const { supabaseUrl, supabaseServiceKey } = getEnvironmentVariables();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => 
            cookieStore.set(name, value, options)
          );
        } catch(error) {
          console.log(error)
        }
      }
    }
  });
}