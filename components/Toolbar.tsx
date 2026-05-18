"use client";

import { useDashboardParams } from "@/hooks/use-dashboard-params";
import { format, subDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ComputedSeriesList } from "./computed-series-list";
import { DatePicker } from "./date-picker";
import { MetricList } from "./metric-list";
import { Button } from "./ui/button";

type ContentProps = {
  metrics: string[];
  computed: string[];
  startDate: string;
  endDate: string;
  setParams: ReturnType<typeof useDashboardParams>["setParams"];
};

function Content({
  metrics,
  computed,
  startDate,
  endDate,
  setParams,
}: ContentProps) {
  const [draftMetrics, setDraftMetrics] = useState<string[]>(metrics);
  const [draftComputed, setDraftComputed] = useState<string[]>(computed);
  const [draftStart, setDraftStart] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined,
  );
  const [draftEnd, setDraftEnd] = useState<Date | undefined>(
    endDate ? new Date(endDate) : undefined,
  );

  const handleApplyClick = () => {
    setParams({
      metrics: draftMetrics,
      computed: draftComputed,
      start: draftStart ? format(draftStart, "yyyy-MM-dd") : "",
      end: draftEnd ? format(draftEnd, "yyyy-MM-dd") : "",
    });
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-xl bg-card shadow-sm">
      <DatePicker
        placeholder="Date From"
        value={draftStart}
        onChange={setDraftStart}
      />
      <DatePicker
        placeholder="Date To"
        value={draftEnd}
        onChange={setDraftEnd}
      />
      <div className="flex flex-wrap items-center gap-2">
        <MetricList value={draftMetrics} setValue={setDraftMetrics} />
        <ComputedSeriesList value={draftComputed} setValue={setDraftComputed} />
        <Button onClick={handleApplyClick}>Apply</Button>
      </div>
    </div>
  );
}

export function Toolbar() {
  const searchParams = useSearchParams();
  const params = useDashboardParams();
  const { metrics, computed, startDate, endDate, setParams } = params;
  const toolbarKey = `${metrics.join(",")}-${computed.join(",")}-${startDate}-${endDate}`;
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    const missingMetrics = !searchParams.has("metrics");
    const missingComputed = !searchParams.has("computed");
    const missingStart = !searchParams.has("start");
    const missingEnd = !searchParams.has("end");

    if (missingMetrics || missingComputed || missingStart || missingEnd) {
      const today = new Date();
      const lastWeek = subDays(today, 7);

      setParams({
        ...(missingMetrics ? { metrics: ["temp", "humidity"] } : {}),
        ...(missingComputed ? { computed: ["movingAvg"] } : {}),
        ...(missingStart ? { start: format(lastWeek, "yyyy-MM-dd") } : {}),
        ...(missingEnd ? { end: format(today, "yyyy-MM-dd") } : {}),
      });
    }

    hasInitialized.current = true;
  }, [searchParams, setParams]);

  return <Content key={toolbarKey} {...params} />;
}
