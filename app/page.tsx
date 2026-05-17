"use client";

import { LocationMap } from "@/components/location-map";
import { Toolbar } from "@/components/toolbar";

export default function Home() {
  return (
    <div className="p-4 ">
      <main className="flex flex-col gap-4">
        <Toolbar />
        <LocationMap />
      </main>
    </div>
  );
}
