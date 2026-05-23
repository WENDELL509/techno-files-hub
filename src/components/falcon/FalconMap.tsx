import { useMemo } from "react";
import { MapPin } from "lucide-react";

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface Props {
  markers: MapMarker[];
  center: { lat: number; lng: number };
  onMarkerClick?: (id: string) => void;
  activeId?: string | null;
}

/**
 * Stylized SVG "map" — no external SDK required. Plots markers projected
 * around the given center with a dark navy aesthetic and decorative road
 * lines so the screen reads as a map.
 */
export const FalconMap = ({ markers, center, onMarkerClick, activeId }: Props) => {
  const projected = useMemo(() => {
    // simple equirectangular projection scaled into 0..100 viewport
    const SCALE = 80; // degrees * SCALE → viewport units
    return markers.map((m) => {
      const x = 50 + (m.lng - center.lng) * SCALE;
      const y = 50 - (m.lat - center.lat) * SCALE;
      return { ...m, x: Math.max(6, Math.min(94, x)), y: Math.max(8, Math.min(92, y)) };
    });
  }, [markers, center]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[oklch(0.18_0.04_260)]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 0 0 0 6" fill="none" stroke="oklch(0.28 0.04 260)" strokeWidth="0.15" />
          </pattern>
          <radialGradient id="glow" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="oklch(0.72 0.19 45 / 0.25)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        <rect width="100" height="100" fill="url(#glow)" />
        {/* decorative roads */}
        <path d="M -5 70 Q 30 60 50 65 T 110 55" stroke="oklch(0.32 0.04 260)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 20 -5 Q 25 30 40 50 T 60 110" stroke="oklch(0.32 0.04 260)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M -5 30 Q 40 40 70 25 T 110 35" stroke="oklch(0.30 0.04 260)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M 70 -5 Q 75 40 80 70 T 95 110" stroke="oklch(0.30 0.04 260)" strokeWidth="1.0" fill="none" strokeLinecap="round" />
        {/* river */}
        <path d="M -5 85 Q 25 78 45 88 T 110 80" stroke="oklch(0.30 0.06 240)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      </svg>

      {/* markers */}
      {projected.map((m) => {
        const isActive = activeId === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onMarkerClick?.(m.id)}
            aria-label={m.name}
            className="absolute -translate-x-1/2 -translate-y-full animate-pin-pop"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            <span className="relative block">
              {isActive && (
                <span className="absolute inset-0 -m-2 rounded-full bg-primary/50 animate-pulse-ring" />
              )}
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full gradient-primary shadow-pin border-2 border-background">
                <MapPin className="h-4 w-4 text-primary-foreground" fill="currentColor" />
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
