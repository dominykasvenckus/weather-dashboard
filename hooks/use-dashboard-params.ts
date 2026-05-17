import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useDashboardParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const metrics = searchParams.get("metrics")?.split(",") || [];
  const computed = searchParams.get("computed")?.split(",") || [];
  const startDate = searchParams.get("start") || "";
  const endDate = searchParams.get("end") || "";
  const activeLocation = searchParams.get("location") || "";

  const setParams = (params: {
    metrics?: string[];
    computed?: string[];
    start?: string;
    end?: string;
    location?: string;
  }) => {
    const current = new URLSearchParams(searchParams.toString());

    const setArrayParam = (key: string, arr?: string[]) => {
      if (arr !== undefined) {
        if (arr.length > 0) current.set(key, arr.join(","));
        else current.delete(key);
      }
    };

    const setStringParam = (key: string, str?: string) => {
      if (str !== undefined) {
        if (str) current.set(key, str);
        else current.delete(key);
      }
    };

    setArrayParam("metrics", params.metrics);
    setArrayParam("computed", params.computed);
    setStringParam("start", params.start);
    setStringParam("end", params.end);
    setStringParam("location", params.location);

    const search = current.toString();
    const query = search ? `?${search}` : "";
    const url = `${pathname}${query}`;

    router.replace(url, { scroll: false });
  };

  return {
    metrics,
    computed,
    startDate,
    endDate,
    activeLocation,
    setParams,
  };
}
