import { useEffect, useState } from "react";
import { fetchWeather } from "@/lib/weather-api";
import type { WeatherDataPoint } from "@/types/weather-api";

export function useWeather(
  lat: number | undefined,
  lng: number | undefined,
  start?: string,
  end?: string,
) {
  const [data, setData] = useState<WeatherDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      if (lat === undefined || lng === undefined) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetchWeather(lat, lng, start, end, controller.signal);
        setData(res);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        setLoading(false);
      }
    }

    loadData();

    return () => controller.abort();
  }, [lat, lng, start, end]);

  return { data, loading, error };
}
