"use client";

import { useDashboardParams } from "@/hooks/use-dashboard-params";
import { useWeather } from "@/hooks/use-weather";
import { computeSeries } from "@/lib/weather-api";
import type { WeatherDataPoint } from "@/types/weather-api";
import useWeatherLocationStore from "@/storage/stores/weather-locations";
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { DatePicker } from "./date-picker";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function MetricChart({
  metricId,
  data,
  computed,
  title,
}: {
  metricId: string;
  data: WeatherDataPoint[];
  computed: string[];
  title: string;
}) {
  let mappedKey: keyof Omit<WeatherDataPoint, "time"> = "temp";
  let label = "Temperature";

  if (metricId === "humidity") {
    mappedKey = "humidity";
    label = "Humidity";
  } else if (metricId === "wind") {
    mappedKey = "wind";
    label = "Wind Speed";
  }

  const computedSeries = computeSeries(data, mappedKey);
  const dates = data.map((d) => d.time);
  const rawValues = data.map((d) => d[mappedKey]);

  const datasets: ChartData<"line">["datasets"] = [
    {
      label: `Raw ${label}`,
      data: rawValues,
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      tension: 0.2,
      borderWidth: 1.5,
      pointRadius: 2,
    },
  ];

  if (computed.includes("movingAvg")) {
    datasets.push({
      label: "7-Day Moving Avg",
      data: computedSeries.movingAvg,
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderDash: [5, 5],
      tension: 0.3,
      borderWidth: 2,
      pointRadius: 0,
    });
  }

  if (computed.includes("minMax")) {
    datasets.push({
      label: "Min",
      data: dates.map(() => computedSeries.min),
      borderColor: "rgba(75, 192, 192, 0.7)",
      borderDash: [2, 2],
      borderWidth: 1,
      pointRadius: 0,
      fill: false,
    });
    datasets.push({
      label: "Max",
      data: dates.map(() => computedSeries.max),
      borderColor: "rgba(255, 159, 64, 0.7)",
      borderDash: [2, 2],
      borderWidth: 1,
      pointRadius: 0,
      fill: false,
    });
  }

  if (computed.includes("trend")) {
    datasets.push({
      label: "Linear Trend",
      data: computedSeries.trend,
      borderColor: "rgba(153, 102, 255, 1)",
      backgroundColor: "rgba(153, 102, 255, 0.5)",
      borderWidth: 2,
      pointRadius: 0,
    });
  }

  const chartData: ChartData<"line"> = {
    labels: dates,
    datasets,
  };

  return (
    <div className="h-75 w-full border rounded p-4 bg-background">
      <h3 className="text-center font-medium mb-4">
        {label} - {title}
      </h3>
      <div className="h-57.5 w-full">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: "index",
              intersect: false,
            },
          }}
        />
      </div>
    </div>
  );
}

export function LocationDetail() {
  const { activeLocation, startDate, endDate, metrics, computed } =
    useDashboardParams();
  const { locations } = useWeatherLocationStore();
  const [localStart, setLocalStart] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined,
  );
  const [localEnd, setLocalEnd] = useState<Date | undefined>(
    endDate ? new Date(endDate) : undefined,
  );
  const [appliedLocalStart, setAppliedLocalStart] = useState<
    string | undefined
  >(startDate);
  const [appliedLocalEnd, setAppliedLocalEnd] = useState<string | undefined>(
    endDate,
  );
  const [prevGlobalStart, setPrevGlobalStart] = useState(startDate);
  const [prevGlobalEnd, setPrevGlobalEnd] = useState(endDate);

  const active =
    locations.find((l) => `${l.lat},${l.lng}` === activeLocation) || null;

  if (startDate !== prevGlobalStart) {
    setPrevGlobalStart(startDate);
    setLocalStart(startDate ? new Date(startDate) : undefined);
    setAppliedLocalStart(startDate);
  }

  if (endDate !== prevGlobalEnd) {
    setPrevGlobalEnd(endDate);
    setLocalEnd(endDate ? new Date(endDate) : undefined);
    setAppliedLocalEnd(endDate);
  }

  const handleApplyOverride = () => {
    setAppliedLocalStart(localStart ? format(localStart, "yyyy-MM-dd") : "");
    setAppliedLocalEnd(localEnd ? format(localEnd, "yyyy-MM-dd") : "");
  };

  const effectiveStart = appliedLocalStart || startDate;
  const effectiveEnd = appliedLocalEnd || endDate;

  const { data, loading, error } = useWeather(
    active?.lat,
    active?.lng,
    effectiveStart,
    effectiveEnd,
  );

  if (!activeLocation || !active) {
    return (
      <div className="flex flex-col gap-4 p-4 border rounded-xl bg-card shadow-sm items-center justify-center text-foreground h-full md:h-157.5">
        Select a location
      </div>
    );
  }

  const handleResetToGlobal = () => {
    setLocalStart(startDate ? new Date(startDate) : undefined);
    setLocalEnd(endDate ? new Date(endDate) : undefined);
    setAppliedLocalStart(startDate);
    setAppliedLocalEnd(endDate);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-xl bg-card shadow-sm h-full md:min-h-157.5">
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold uppercase text-foreground tracking-wider">
          Selected location
        </h2>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{active.name}</h3>
          <span className="text-xs text-foreground">
            Global date by default, local override allowed
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <DatePicker
            placeholder="Local From"
            value={localStart}
            onChange={setLocalStart}
          />
          <DatePicker
            placeholder="Local To"
            value={localEnd}
            onChange={setLocalEnd}
          />
          <div className="flex gap-2">
            <Button variant="default" onClick={handleApplyOverride}>
              Override
            </Button>
            <Button variant="secondary" onClick={handleResetToGlobal}>
              Reset to Global
            </Button>
          </div>
        </div>
      </div>
      {loading && (
        <div className="flex justify-center p-8">
          <Spinner className="w-8 h-8" />
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 mt-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-lg shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              Failed to load weather data
            </span>
            <span className="text-xs opacity-90">{error}</span>
          </div>
        </div>
      )}
      {!loading && !error && data.length === 0 && (
        <div className="flex flex-1 items-start justify-center mt-4 text-muted-foreground">
          <p>No weather data found for this period</p>
        </div>
      )}
      {!loading && !error && data.length > 0 && metrics.length === 0 && (
        <div className="flex flex-1 items-start justify-center mt-4 text-muted-foreground">
          <p>Select at least one metric to view data</p>
        </div>
      )}
      {!loading && !error && data.length > 0 && metrics.length > 0 && (
        <div className="flex flex-col gap-2 mt-4">
          {metrics.map((metricId) => (
            <MetricChart
              key={metricId}
              metricId={metricId}
              data={data}
              computed={computed}
              title={active.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
