"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Button } from "./ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { Hazard } from "@/types/hazard";
import { Badge } from "./ui/badge";

import type { Database } from "@/types/supabase";

const hazardTypes = [
  "All",
  "Electrical",
  "Structural",
  "Transportation",
  "Water/Drainage",
  "Public Safety",
  "Communication",
  "Other",
];

const hazardColors: Record<string, string> = {
  Electrical: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Structural: "bg-red-100 text-red-700 border-red-200",
  Transportation: "bg-blue-100 text-blue-700 border-blue-200",
  "Water/Drainage": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Public Safety": "bg-orange-100 text-orange-700 border-orange-200",
  Communication: "bg-purple-100 text-purple-700 border-purple-200",
  Other: "bg-gray-100 text-gray-700 border-gray-200",
};

async function getData(type: string): Promise<Hazard[]> {
  const supabase = getSupabaseBrowserClient();

  let query = supabase
    .from("hazards")
    .select(
      `
      *,
      images (*)
    `,
    )
    .eq("status", "under-maintenance")
    .order("created_at", { ascending: false });

  if (type !== "All") {
    query = query.eq("hazard_type", type);
  }

  const { data, error } =
    await query.returns<Database["public"]["Tables"]["hazards"]["Row"][]>();

  if (error) throw error;

  return (data ?? []) as Hazard[];
}

export function MapSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [hazards, setHazards] = React.useState<Hazard[]>([]);
  const [selectedType, setSelectedType] = React.useState("All");

  const supabase = getSupabaseBrowserClient();

  React.useEffect(() => {
    setMounted(true);

    const loadData = async () => {
      const data = await getData(selectedType);
      setHazards(data);
    };

    loadData();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase, selectedType]);

  if (!mounted) {
    return (
      <Sidebar {...props} className="w-[360px]">
        <SidebarHeader className="h-12" />
        <SidebarContent className="gap-0" />
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar {...props} className="z-[50]">
      <SidebarHeader className="space-y-4 shrink-0">
        <div className="p-4 pt-10 font-bold text-lg">Under-Maintenance</div>

        <div className="px-4">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Filter by hazard type" />
            </SelectTrigger>

            <SelectContent>
              {hazardTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SidebarHeader>

      {/* CONTENT (SCROLLABLE) */}
      <SidebarContent className="flex-1 overflow-y-auto p-4 space-y-3">
        {hazards.length === 0 && (
          <div className="text-xs text-muted-foreground">No hazards found.</div>
        )}

        {hazards.map((item) => (
          <Card key={item.hazard_id}>
            <CardContent className="p-2">
              <div className="flex gap-3">
                <div className="relative min-w-[60px] h-[60px] overflow-hidden rounded-md border">
                  <Image
                    src={(item as any).images?.[0]?.url || "/placeholder.jpg"}
                    alt={item.title}
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold truncate">
                      {item.title}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground truncate">
                    {item.location}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] text-muted-foreground">
                      {new Date(
                        item.started_at || item.created_at,
                      ).toLocaleDateString()}
                    </div>

                    <Badge className={hazardColors[item.hazard_type]}>
                      {item.hazard_type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="p-4 shrink-0">
        {user ? (
          <Link href="/user" className="w-full">
            <Button className="w-full text-sm" variant="outline">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/login" className="w-full">
            <Button className="w-full text-sm">Login Account</Button>
          </Link>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
