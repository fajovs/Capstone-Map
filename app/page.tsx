'use client'

import { redirect } from "next/navigation";
import LocationPage from "./location-list/page";



export default function Home() {
  redirect("/location-list");
}
