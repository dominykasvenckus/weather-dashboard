import { LocationDetail } from "@/components/location-detail";
import { LocationMap } from "@/components/location-map";
import { Toolbar } from "@/components/toolbar";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="p-4 ">
      <main className="flex flex-col gap-4">
        <Suspense>
          <Toolbar />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <LocationMap />
            <LocationDetail />
          </div>
        </Suspense>
      </main>
    </div>
  );
}
