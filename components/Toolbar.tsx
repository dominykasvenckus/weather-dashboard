import { ComputedSeriesList } from "./computed-series-list";
import { DatePicker } from "./date-picker";
import { MetricList } from "./metric-list";
import { Button } from "./ui/button";

export function Toolbar() {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md">
      <DatePicker placeholder="Date from" />
      <DatePicker placeholder="Date to" />
      <div className="flex items-center gap-4">
        <MetricList />
        <ComputedSeriesList />
        <Button>Apply</Button>
      </div>
    </div>
  );
}
