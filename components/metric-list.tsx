import { Dispatch, SetStateAction } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const METRIC_OPTIONS = [
  { id: "temp", label: "Temp" },
  { id: "humidity", label: "Humidity" },
  { id: "wind", label: "Wind" },
] as const;

type MetricListProps = {
  value: string[];
  setValue: Dispatch<SetStateAction<string[]>>;
};

export function MetricList({ value, setValue }: MetricListProps) {
  const toggleMetric = (id: string, checked: boolean) => {
    setValue((prev) => {
      if (checked) {
        if (prev.includes(id)) {
          return prev;
        }
        return [...prev, id];
      } else {
        return prev.filter((v) => v !== id);
      }
    });
  };

  return (
    <div className="flex items-center gap-4 rounded-md border p-2">
      <span className="text-sm text-muted-foreground font-medium">
        Metrics:
      </span>
      {METRIC_OPTIONS.map(({ id, label }) => (
        <div key={id} className="flex items-center gap-2">
          <Checkbox
            id={id}
            checked={value.includes(id)}
            onCheckedChange={(c) => toggleMetric(id, c === true)}
          />
          <Label htmlFor={id} className="text-sm font-normal">
            {label}
          </Label>
        </div>
      ))}
    </div>
  );
}
