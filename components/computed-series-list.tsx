import { Dispatch, SetStateAction } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const COMPUTED_OPTIONS = [
  { id: "movingAvg", label: "Moving Avg" },
  { id: "minMax", label: "Min/Max" },
  { id: "trend", label: "Trend" },
] as const;

type ComputedSeriesListProps = {
  value: string[];
  setValue: Dispatch<SetStateAction<string[]>>;
};

export function ComputedSeriesList({
  value,
  setValue,
}: ComputedSeriesListProps) {
  const toggleComputed = (id: string, checked: boolean) => {
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
        Computed:
      </span>
      {COMPUTED_OPTIONS.map(({ id, label }) => (
        <div key={id} className="flex items-center gap-2">
          <Checkbox
            id={id}
            checked={value.includes(id)}
            onCheckedChange={(c) => toggleComputed(id, c === true)}
          />
          <Label htmlFor={id} className="text-sm font-normal">
            {label}
          </Label>
        </div>
      ))}
    </div>
  );
}
