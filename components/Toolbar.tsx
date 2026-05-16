import { ComputedSeriesList } from "./ComputedSeriesList";
import { DatePicker } from "./DatePicker";
import { MetricList } from "./MetricList";
import { Button } from "./ui/button";

export default function Toolbar() {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md">
      <DatePicker placeholder="Date From" />
      <DatePicker placeholder="Date To" />
      <div className="flex items-center gap-4">
        <MetricList />
        <ComputedSeriesList />
        <Button>Apply</Button>
      </div>
    </div>
  );
}
