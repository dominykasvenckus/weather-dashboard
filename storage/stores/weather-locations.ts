import { WeatherLocation } from "@/types/weather-location";
import { createStore } from "../storage";

type WeatherLocationStore = {
  locations: WeatherLocation[];
  addLocation: (location: Omit<WeatherLocation, "id">) => WeatherLocation;
  deleteLocation: (id: string) => void;
};

const useWeatherLocationStore = createStore<WeatherLocationStore>(
  "weatherLocations",
  (set) => ({
    locations: [],
    addLocation: (location) => {
      const newLocation = { ...location, id: crypto.randomUUID() };
      set((state) => ({ locations: [...state.locations, newLocation] }));
      return newLocation;
    },
    deleteLocation: (id) =>
      set((state) => ({
        locations: state.locations.filter((location) => location.id !== id),
      })),
  }),
);

export default useWeatherLocationStore;
