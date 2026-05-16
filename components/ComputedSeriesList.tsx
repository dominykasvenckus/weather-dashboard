import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export function ComputedSeriesList() {
  return (
    <div className="flex items-center gap-4 rounded-md border p-2">
      <span className="text-sm text-muted-foreground font-medium">
        Computed:
      </span>
      <div className="flex items-center gap-2">
        <Checkbox id="movingAvg" defaultChecked />
        <Label htmlFor="movingAvg" className="text-sm font-normal">
          Moving Avg
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="minMax" />
        <Label htmlFor="minMax" className="text-sm font-normal">
          Min/Max
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="trend" />
        <Label htmlFor="trend" className="text-sm font-normal">
          Trend
        </Label>
      </div>
    </div>
  );
}
