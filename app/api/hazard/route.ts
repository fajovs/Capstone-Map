import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";



export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("hazards")
      .select("*")
      .order("date_created", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const formData = await req.formData();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const title = String(formData.get("title") || "");
  const status = String(formData.get("status") || "pending");
  const location = String(formData.get("location") || "");
  const hazard_type = String(formData.get("hazard_type") || "");
  const description = String(formData.get("description") || "");
  const longitude = Number(formData.get("longitude"));
  const latitude = Number(formData.get("latitude"));
  const profile_id = user?.id;
  const image = formData.get("image") as File | null;
  

  const { data: hazard, error: hazardError } = await supabase
    .from("hazards")
    .insert({
      title,
      status,
      location,
      hazard_type,
      description,
      longitude,
      latitude,
      profile_id,
      started_at: null,
      resolved_at: null,
    })
    .select()
    .single();

  if (hazardError) {
    return NextResponse.json(
      { error: hazardError.message },
      { status: 400 }
    );
  }

  let imageData = null;

  if (image) {
    const fileName = `${Date.now()}-${image.name}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, image);

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 400 }
      );
    }

    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    const { data: img, error: imgError } = await supabase
      .from("images")
      .insert({
        hazard_id: hazard.hazard_id,
        url: imageUrl,
        date_created: new Date().toISOString(),
      })
      .select()
      .single();

    if (imgError) {
      return NextResponse.json(
        { error: imgError.message },
        { status: 400 }
      );
    }

    imageData = img;
  }

  return NextResponse.json({
    hazard,
    image: imageData,
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const hazard_id = searchParams.get("hazard_id");

  if (!hazard_id) {
    return NextResponse.json(
      { error: "Missing hazard_id" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("hazards")
    .delete()
    .eq("hazard_id", hazard_id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Hazard deleted successfully",
  });
}