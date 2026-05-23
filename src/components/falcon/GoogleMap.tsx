import { useEffect, useRef, useState } from "react";
import { FalconMap, type MapMarker } from "./FalconMap";

declare global {
  interface Window {
    google: any;
    initFalconMap?: () => void;
    __falconMapReady?: Promise<void>;
  }
}

interface Props {
  markers: MapMarker[];
  center: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (id: string) => void;
  activeId?: string | null;
}

const DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0b1a2b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b1a2b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8aa0b8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1b2f47" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9fb3c8" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#06121f" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#22364f" }] },
];

function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.maps) return Promise.resolve();
  if (window.__falconMapReady) return window.__falconMapReady;

  window.__falconMapReady = new Promise<void>((resolve, reject) => {
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!key) return reject(new Error("Google Maps key missing"));

    window.initFalconMap = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=initFalconMap${channel ? `&channel=${channel}` : ""}`;
    s.async = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return window.__falconMapReady;
}

export const GoogleMap = ({ markers, center, zoom = 13, onMarkerClick, activeId }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [failed, setFailed] = useState(false);

  // initial load
  useEffect(() => {
    let cancelled = false;
    loadMaps()
      .then(() => {
        if (cancelled || !ref.current) return;
        mapRef.current = new window.google.maps.Map(ref.current, {
          center,
          zoom,
          disableDefaultUI: true,
          zoomControl: true,
          styles: DARK_STYLE,
          backgroundColor: "#0b1a2b",
          gestureHandling: "greedy",
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sync markers
  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = markers.map((m) => {
      const isActive = activeId === m.id;
      const marker = new window.google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map: mapRef.current,
        title: m.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isActive ? 12 : 9,
          fillColor: "#ff6a1a",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
      marker.addListener("click", () => onMarkerClick?.(m.id));
      return marker;
    });
  }, [markers, activeId, onMarkerClick]);

  if (failed) {
    return (
      <FalconMap
        markers={markers}
        center={center}
        onMarkerClick={onMarkerClick}
        activeId={activeId}
      />
    );
  }

  return <div ref={ref} className="absolute inset-0 w-full h-full" />;
};
