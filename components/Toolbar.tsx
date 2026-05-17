"use client";

import { useDashboardParams } from "@/hooks/use-dashboard-params";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
    <div className="flex flex-col gap-4 p-4 border rounded-md">
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
      <div className="flex items-center gap-4">
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

  useEffect(() => {
    const missingMetrics = !searchParams.has("metrics");
    const missingComputed = !searchParams.has("computed");

    if (missingMetrics || missingComputed) {
      setParams({
        ...(missingMetrics ? { metrics: ["temp", "humidity"] } : {}),
        ...(missingComputed ? { computed: ["movingAvg"] } : {}),
      });
    }
  }, [searchParams, setParams]);

  return <Content key={toolbarKey} {...params} />;
}
