import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export function MetricList() {
  return (
    <div className="flex items-center gap-4 rounded-md border p-2">
      <span className="text-sm text-muted-foreground font-medium">
        Metrics:
      </span>
      <div className="flex items-center gap-2">
        <Checkbox id="temp" defaultChecked />
        <Label htmlFor="temp" className="text-sm font-normal">
          Temp
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="humidity" defaultChecked />
        <Label htmlFor="humidity" className="text-sm font-normal">
          Humidity
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="wind" />
        <Label htmlFor="wind" className="text-sm font-normal">
          Wind
        </Label>
      </div>
    </div>
  );
}
