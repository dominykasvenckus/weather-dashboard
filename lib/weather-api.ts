import type { ComputedDataMap, WeatherDataPoint } from "@/types/weather-api";
import { addDays } from "date-fns";

export async function fetchWeather(
  lat: number,
  lng: number,
  start?: string,
  end?: string,
  signal?: AbortSignal,
): Promise<WeatherDataPoint[]> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  const params = url.searchParams;

  params.set("latitude", lat.toString());
  params.set("longitude", lng.toString());
  params.set(
    "daily",
    "temperature_2m_max,relative_humidity_2m_mean,wind_speed_10m_max",
  );
  params.set("timezone", "auto");

  if (start && end) {
    params.set("start_date", start);
    params.set("end_date", end);
  } else {
    const today = new Date();
    params.set("start_date", addDays(today, -7).toISOString().split("T")[0]);
    params.set("end_date", today.toISOString().split("T")[0]);
  }

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  const { daily } = await response.json();
  const {
    time,
    temperature_2m_max,
    relative_humidity_2m_mean,
    wind_speed_10m_max,
  } = daily || {};

  return (time || []).map((t: string, i: number) => ({
    time: t,
    temp: temperature_2m_max?.[i] ?? null,
    humidity: relative_humidity_2m_mean?.[i] ?? null,
    wind: wind_speed_10m_max?.[i] ?? null,
  }));
}

export function computeSeries(
  data: WeatherDataPoint[],
  metric: keyof Omit<WeatherDataPoint, "time">,
): ComputedDataMap {
  const values = data.map((d) => d[metric]);
  const validValues = values.filter((v): v is number => v !== null);

  const min = validValues.length > 0 ? Math.min(...validValues) : null;
  const max = validValues.length > 0 ? Math.max(...validValues) : null;

  const movingAvg = values.map((_, idx, arr) => {
    if (idx < 6) return null;

    let sum = 0;
    let count = 0;
    for (let i = idx - 6; i <= idx; i++) {
      if (arr[i] !== null) {
        sum += arr[i] as number;
        count++;
      }
    }
    return count > 0 ? sum / count : null;
  });

  const trend: (number | null)[] = new Array(values.length).fill(null);
  const n = validValues.length;

  if (n > 1) {
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0;
    let localIdx = 0;

    for (const val of values) {
      if (val !== null) {
        sumX += localIdx;
        sumY += val;
        sumXY += localIdx * val;
        sumX2 += localIdx * localIdx;
        localIdx++;
      }
    }

    const denominator = n * sumX2 - sumX * sumX;

    if (denominator !== 0) {
      const slope = (n * sumXY - sumX * sumY) / denominator;
      const intercept = (sumY - slope * sumX) / n;

      localIdx = 0;
      for (let i = 0; i < values.length; i++) {
        if (values[i] !== null) {
          trend[i] = slope * localIdx + intercept;
          localIdx++;
        }
      }
    }
  }

  return { movingAvg, min, max, trend };
}
