"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Image from "next/image";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Spinner } from "../ui/spinner";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { toast } from "sonner";

const MapWithNoSSR = dynamic(() => import("../../components/map"), {
  ssr: false,
  loading: () => (
    <div className="flex w-full h-full items-center justify-center">
      <Spinner />
    </div>
  ),
});

const hazardSchema = z.object({
  title: z.string().min(3, "Title is required"),

  hazard_type: z.enum([
    "Electrical",
    "Structural",
    "Transportation",
    "Water/Drainage",
    "Public Safety",
    "Communication",
    "Other",
  ]),

  location: z.string().min(3, "Location is required"),

  description: z.string().min(10, "Description is too short"),

  status: z.literal("pending"),

  latitude: z.number(),

  longitude: z.number(),
});

type HazardFormValues = z.infer<typeof hazardSchema>;

export function CreateHazard() {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);

  const [coords, setCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HazardFormValues>({
    resolver: zodResolver(hazardSchema),
    defaultValues: {
      status: "pending",
    },
  });

  const canShowDetails = preview && coords;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const clearForm = () => {
    reset({
      status: "pending",
      title: "",
      hazard_type: undefined,
      location: "",
      description: "",
      latitude: 0,
      longitude: 0,
    });

    setPreview(null);
    setCoords(null);

    const fileInput = document.querySelector<HTMLInputElement>("#image");
    if (fileInput) fileInput.value = "";
  };

  const onSubmit = async (data: HazardFormValues) => {
    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const fileInput =
        document.querySelector<HTMLInputElement>("#image")?.files?.[0];

      let imageUrl: string | null = null;

      if (fileInput) {
        const fileName = `${user.id}/${Date.now()}-${fileInput.name}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, fileInput);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { data: hazard, error: hazardError } = await supabase
        .from("hazards")
        .insert({
          ...data,
          profile_id: user?.id,
          latitude: coords?.lat ?? null,
          longitude: coords?.lng ?? null,
        } as never)
        .select()
        .single();

      if (hazardError) throw hazardError;

      if (imageUrl) {
        const { error: imageError } = await supabase.from("images").insert([
          {
            hazard_id: hazard.hazard_id,
            url: imageUrl,
          },
        ] as any);

        if (imageError) throw imageError;
      }

      toast.success("Hazard created successfully", {
        description: `${data.title} has been submitted`,
      });

      clearForm();

      setOpen(false);

      router.refresh();
    } catch (err: any) {
      toast.error("Failed to create hazard", {
        description: err.message,
      });
    }
  };

  const handleCoordsChange = (value: { lat: number; lng: number }) => {
    setCoords(value);

    setValue("latitude", value.lat);
    setValue("longitude", value.lng);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setOpen(true)}
        >
          Create Request
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Hazard Request</DialogTitle>
          <DialogDescription>
            Report a hazard by selecting location, uploading a photo, and adding
            details.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto pr-2">
            <FieldGroup className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="image">Image</FieldLabel>

                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageChange}
                  />

                  {preview && (
                    <div className="relative mt-2 w-full h-48 rounded-md border overflow-hidden">
                      <Image
                        src={preview}
                        alt="Hazard preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  <FieldDescription>
                    Take a photo or upload an image.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel>Pick Location</FieldLabel>

                  <div className="h-64 md:h-72 w-full rounded-md overflow-hidden border">
                    <MapWithNoSSR
                      mode="single"
                      coords={coords}
                      setCoords={handleCoordsChange}
                    />
                  </div>

                  {coords && (
                    <p className="text-xs mt-1 text-gray-500">
                      Lat: {coords.lat.toFixed(6)} | Lng:{" "}
                      {coords.lng.toFixed(6)}
                    </p>
                  )}
                </Field>
              </div>

              {canShowDetails && (
                <div className="space-y-4 pt-2 border-t">
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input {...register("title")} />
                    {errors.title && (
                      <p className="text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="hazard_type">Hazard Type</FieldLabel>
                    <select
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      {...register("hazard_type")}
                    >
                      <option value="Electrical">Electrical</option>
                      <option value="Structural">Structural</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Water/Drainage">Water/Drainage</option>
                      <option value="Public Safety">Public Safety</option>
                      <option value="Communication">Communication</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="location">Location</FieldLabel>
                    <Input {...register("location")} />
                    {errors.location && (
                      <p className="text-sm text-red-500">
                        {errors.location.message}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <textarea
                      className="min-h-32 w-full rounded-md border px-3 py-2 text-sm"
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </Field>

                  <input type="hidden" {...register("status")} />
                </div>
              )}
            </FieldGroup>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
