"use client";

import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TORREMOLINOS: [number, number] = [36.6203, -4.4998];

function pinIcon() {
  const size = 34;
  return L.divIcon({
    className: "",
    html: `<div style="
        width:${size}px;height:${size}px;
        filter:drop-shadow(0 3px 5px rgba(35,39,42,0.4));
      ">
        <svg width="${size}" height="${size}" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z"
            fill="#e28b23"
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

export default function ContactMapInner() {
  return (
    <MapContainer
      center={TORREMOLINOS}
      zoom={13}
      scrollWheelZoom={false}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution="Tiles &copy; Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        maxZoom={19}
      />
      <ZoomControl position="topleft" />
      <Marker position={TORREMOLINOS} icon={pinIcon()}>
        <Popup>
          <div className="text-sm font-medium text-ink-800">
            La Conciergerie Del Sol
          </div>
          <div className="text-xs text-ink-500">
            Torremolinos, Costa del Sol
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
