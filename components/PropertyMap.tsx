"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import type { Property } from "@/lib/mock-properties";
import "leaflet/dist/leaflet.css";

// Classic "map pin" teardrop marker — matches the shape of the reference
// site's pins, recolored to the brand palette (amber default, dark ink
// when a card is hovered/active).
function pinIcon(active: boolean) {
  const size = active ? 40 : 32;
  const color = active ? "#23272a" : "#e28b23";

  return L.divIcon({
    className: "",
    html: `<div style="
        width:${size}px;height:${size}px;
        transition:width .2s ease,height .2s ease;
        filter:drop-shadow(0 3px 5px rgba(35,39,42,0.4));
      ">
        <svg width="${size}" height="${size}" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z"
            fill="${color}"
            stroke="#fdfbf7"
            stroke-width="1.5"
          />
          <circle cx="12" cy="12" r="5" fill="#fdfbf7" />
        </svg>
      </div>`,
    iconSize: [size, size * (32 / 24)],
    iconAnchor: [size / 2, size * (32 / 24)],
    popupAnchor: [0, -size],
  });
}

// Leaflet measures its container at init time. When the map starts out
// inside a `display:none` element (e.g. the mobile "List/Map" toggle) and
// is later shown, Leaflet doesn't know it now has real size — tiles render
// blank/cropped until something tells it to re-measure. A ResizeObserver on
// the container catches that display:none -> visible transition (and any
// later resize, like a tablet rotation) and nudges Leaflet to recalculate.
function AutoInvalidateSize() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}

function FitBounds({ properties }: { properties: Property[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length === 0) return;
    const bounds = L.latLngBounds(
      properties.map((p) => [p.lat, p.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
  }, [map, properties]);

  return null;
}

export default function PropertyMap({
  properties,
  activeSlug,
  onMarkerHover,
}: {
  properties: Property[];
  activeSlug?: string | null;
  onMarkerHover?: (slug: string | null) => void;
}) {
  const center = useMemo<[number, number]>(() => {
    if (properties.length === 0) return [36.6203, -4.4998];
    const lat =
      properties.reduce((sum, p) => sum + p.lat, 0) / properties.length;
    const lng =
      properties.reduce((sum, p) => sum + p.lng, 0) / properties.length;
    return [lat, lng];
  }, [properties]);

  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution="Tiles &copy; Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        maxZoom={19}
      />
      <ZoomControl position="topleft" />
      <AutoInvalidateSize />
      <FitBounds properties={properties} />
      {properties.map((property) => (
        <Marker
          key={property.slug}
          position={[property.lat, property.lng]}
          icon={pinIcon(property.slug === activeSlug)}
          eventHandlers={{
            mouseover: () => onMarkerHover?.(property.slug),
            mouseout: () => onMarkerHover?.(null),
          }}
        >
          <Popup className="property-popup" minWidth={200} maxWidth={220}>
            <div className="overflow-hidden rounded-2xl">
              <div
                className="h-24 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${property.image})` }}
              />
              <div className="p-3">
                <p className="line-clamp-1 font-display text-sm font-semibold text-ink-800">
                  {property.title}
                </p>
                <p className="mt-0.5 text-xs text-ink-500">
                  {property.location}
                </p>
                <p className="mt-1.5 text-xs font-semibold text-amber-600">
                  from €{property.pricePerNight}/night
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
