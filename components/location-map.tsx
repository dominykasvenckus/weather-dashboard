"use client";

import { Button } from "@/components/ui/button";
import {
  Map,
  MapMarker,
  MapTileLayer,
  MapZoomControl,
} from "@/components/ui/map";
import {
  DraftMarkerIcon,
  SavedMarkerIcon,
  SelectedMarkerIcon,
} from "@/lib/markers";
import useWeatherLocationStore from "@/storage/stores/weather-locations";
import { Coordinates, WeatherLocation } from "@/types/weather-location";
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
  const [draftLocation, setDraftLocation] = useState<Coordinates | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleMapClick = (location: Coordinates) => {
    setDraftLocation(location);
    setSelectedId(null);
  };

  const handleAddLocationClick = () => {
    if (draftLocation) {
      const newLocation = addLocation({
        lat: draftLocation[0],
        lng: draftLocation[1],
        name: `Location ${locations.length + 1}`,
      });
      setDraftLocation(null);
      setSelectedId(newLocation.id);
    }
  };

  const handleRemoveLocationClick = () => {
    if (selectedId) {
      deleteLocation(selectedId);
      setSelectedId(null);
    } else if (draftLocation) {
      setDraftLocation(null);
    }
  };

  return (
    <div className="flex flex-col w-full border rounded-md p-4 bg-background shadow-sm">
      <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-4 tracking-wider">
        Saved locations map
      </h2>
      <div className="relative h-96 w-full rounded border border-dashed border-border overflow-hidden mb-4">
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
                selectedId === loc.id ? (
                  <SelectedMarkerIcon />
                ) : (
                  <SavedMarkerIcon />
                )
              }
              eventHandlers={{
                click: () => {
                  setSelectedId(loc.id);
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
        <span className="text-xs text-muted-foreground">
          Regular outlines are saved locations, bold are selected, and dashed
          are drafts
        </span>
        <div className="flex gap-2">
          <Button onClick={handleAddLocationClick} disabled={!draftLocation}>
            Add location
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemoveLocationClick}
            disabled={selectedId === null && !draftLocation}
          >
            Remove selected
          </Button>
        </div>
      </div>
    </div>
  );
}
