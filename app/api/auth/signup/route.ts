// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function POST(req: NextRequest) {
  const { email, password, fullName } = await req.json();
  const supabase = await createSupabaseServerClient();

  try {
    const { data: userData, error: createUserError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role: process.env.ROLE_USER_DEFAULT,
        },
      });

    if (createUserError || !userData.user?.id) {
      return NextResponse.json(
        { error: createUserError?.message || "Failed to create user" },
        { status: 400 }
      );
    }

    const userId = userData.user.id;

    await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName,
      role: "user",
    });

    return NextResponse.json({
      message: "User created successfully!",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}