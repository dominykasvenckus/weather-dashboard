export type WeatherDataPoint = {
  time: string;
  temp: number | null;
  humidity: number | null;
  wind: number | null;
};

export type ComputedDataMap = {
  movingAvg: (number | null)[];
  min: number | null;
  max: number | null;
  trend: (number | null)[];
};
