import { LocationMap } from "@/components/location-map";
import { Toolbar } from "@/components/toolbar";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="p-4 ">
      <main className="flex flex-col gap-4">
        <Suspense>
          <Toolbar />
          <LocationMap />
        </Suspense>
      </main>
    </div>
  );
}
