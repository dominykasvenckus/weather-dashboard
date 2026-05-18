"use client";

import { Button } from "@/components/ui/button";
import {
  Map,
  MapMarker,
  MapTileLayer,
  MapZoomControl,
} from "@/components/ui/map";
import { useDashboardParams } from "@/hooks/use-dashboard-params";
import {
  DraftMarkerIcon,
  SavedMarkerIcon,
  SelectedMarkerIcon,
} from "@/lib/markers";
import useWeatherLocationStore from "@/storage/stores/weather-locations";
import { Coordinates } from "@/types/coordinates";
import { WeatherLocation } from "@/types/weather-location";
import { useEffect, useRef, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";

function MapController({ locations }: { locations: WeatherLocation[] }) {
  const map = useMap();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    if (locations.length > 0) {
      const bounds = locations.map((loc) => [loc.lat, loc.lng] as Coordinates);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }

    hasInitialized.current = true;
  }, [locations, map]);

  return null;
}

function MapClickHandler({
  onClick,
}: {
  onClick: (location: Coordinates) => void;
}) {
  useMapEvents({
    click(e) {
      const newLocation: Coordinates = [e.latlng.lat, e.latlng.lng];
      onClick(newLocation);
    },
  });

  return null;
}

export function LocationMap() {
  const { locations, addLocation, deleteLocation } = useWeatherLocationStore();
  const { activeLocation, setParams } = useDashboardParams();
  const [draftLocation, setDraftLocation] = useState<Coordinates | null>(null);

  const handleMapClick = (location: Coordinates) => {
    setDraftLocation(location);
    if (activeLocation) {
      setParams({ location: "" });
    }
  };

  const handleAddLocationClick = () => {
    if (draftLocation) {
      const newLocation = addLocation({
        lat: draftLocation[0],
        lng: draftLocation[1],
        name: `Location (${draftLocation[0].toFixed(2)}, ${draftLocation[1].toFixed(2)})`,
      });
      setDraftLocation(null);
      setParams({ location: `${newLocation.lat},${newLocation.lng}` });
    }
  };

  const handleRemoveLocationClick = () => {
    if (activeLocation) {
      const locationToDelete = locations.find(
        (loc) => `${loc.lat},${loc.lng}` === activeLocation,
      );
      if (locationToDelete) {
        deleteLocation(locationToDelete.id);
      }
      setParams({ location: "" });
    } else if (draftLocation) {
      setDraftLocation(null);
    }
  };

  return (
    <div className="flex flex-col border rounded-xl p-4 bg-card shadow-sm h-full md:h-157.5">
      <h2 className="text-xs font-semibold uppercase text-foreground mb-4 tracking-wider">
        Saved Locations Map
      </h2>
      <div className="relative flex-1 min-h-96 w-full rounded border border-dashed border-border overflow-hidden mb-4">
        <Map center={[50, 15]} zoom={4} className="h-full w-full">
          <MapTileLayer />
          <MapZoomControl />
          <MapController locations={locations} />
          <MapClickHandler onClick={handleMapClick} />
          {locations.map((loc) => (
            <MapMarker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={
                activeLocation === `${loc.lat},${loc.lng}` ? (
                  <SelectedMarkerIcon />
                ) : (
                  <SavedMarkerIcon />
                )
              }
              eventHandlers={{
                click: () => {
                  setParams({ location: `${loc.lat},${loc.lng}` });
                  setDraftLocation(null);
                },
              }}
            />
          ))}
          {draftLocation && (
            <MapMarker position={draftLocation} icon={<DraftMarkerIcon />} />
          )}
        </Map>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs text-foreground">
          Regular outlines are saved locations, bold are selected, and dashed
          are drafts
        </span>
        <div className="flex gap-2">
          <Button onClick={handleAddLocationClick} disabled={!draftLocation}>
            Add Location
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemoveLocationClick}
            disabled={!activeLocation && !draftLocation}
          >
            Remove Selected
          </Button>
        </div>
      </div>
    </div>
  );
}
