"use client";
import { Spinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";
import { useState } from "react";

const MapWithNoSSR = dynamic(() => import("../../components/map"), {
  ssr: false,
  loading: () => (
    <div className="flex w-full h-full items-center justify-center">
      <Spinner />
    </div>
  ),
});

function LocationPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number }[]>([]);

  return (
    <MapWithNoSSR coords={coords} setCoords={setCoords} clickable={false} />
  );
}

export default LocationPage;
