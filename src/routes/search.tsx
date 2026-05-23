import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, MapPin, Star, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/falcon/AppShell";
import { GoogleMap } from "@/components/falcon/GoogleMap";
import { FIRMS, FILTERS, DAVAO_CENTER, type Category } from "@/lib/firms";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Firms — Falcon Geosolutions" },
      {
        name: "description",
        content:
          "Search and book trusted geodetic surveying firms across Davao City — boundary, cadastral, GIS, topographic and more.",
      },
      { property: "og:title", content: "Search Surveying Firms — Falcon Geosolutions" },
      {
        property: "og:description",
        content: "Find, compare and book licensed surveying firms in Davao City.",
      },
    ],
  }),
  component: MapSearch,
});

function MapSearch() {
  const [active, setActive] = useState<Category | null>("Property Boundary");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return FIRMS.filter((f) => {
      const matchCat = !active || f.categories.includes(active);
      const matchQ = !query || f.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [active, query]);

  return (
    <AppShell>
      <h1 className="sr-only">Find a surveying firm in Davao</h1>
      <div className="relative h-[55vh]">
        <GoogleMap
          markers={filtered.map((f) => ({ id: f.id, name: f.name, lat: f.lat, lng: f.lng }))}
          center={DAVAO_CENTER}
          onMarkerClick={(id) => navigate({ to: "/firm/$id", params: { id } })}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />

        <div className="absolute top-4 inset-x-4 z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for Surveying Firms"
              className="pl-11 h-12 rounded-2xl bg-card/95 backdrop-blur-xl border-border shadow-card-elegant font-poppins"
            />
          </div>

          <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto no-scrollbar px-4 pb-2">
            {FILTERS.map((f) => (
              <Button
                key={f}
                variant={active === f ? "chipActive" : "chip"}
                size="chip"
                onClick={() => setActive(active === f ? null : f)}
                className="font-poppins shrink-0"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        <button
          className="absolute bottom-6 right-5 h-12 w-12 rounded-full bg-card border border-border shadow-card-elegant flex items-center justify-center text-primary"
          aria-label="Locate me"
        >
          <Navigation className="h-5 w-5" />
        </button>
      </div>

      <section className="-mt-6 relative z-10 rounded-t-3xl bg-card border-t border-border px-5 pt-5 pb-6 shadow-card-elegant">
        <div className="mx-auto h-1 w-12 rounded-full bg-muted mb-4" />
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-display text-base">Nearby Firms</h2>
          <span className="text-xs text-muted-foreground font-poppins">
            {filtered.length} results
          </span>
        </div>

        <div className="space-y-3">
          {filtered.map((f, i) => (
            <button
              key={f.id}
              onClick={() => navigate({ to: "/firm/$id", params: { id: f.id } })}
              className="w-full text-left flex items-center gap-3 p-3 rounded-2xl bg-background-elevated border border-border hover:border-primary/50 transition-all animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-poppins font-semibold text-sm truncate">{f.name}</p>
                  <span
                    className={`shrink-0 text-[9px] uppercase tracking-wider font-poppins font-semibold px-1.5 py-0.5 rounded-md border ${
                      f.area === "Rural"
                        ? "text-accent border-accent/40 bg-accent/10"
                        : "text-primary border-primary/40 bg-primary/10"
                    }`}
                  >
                    {f.area}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {f.services.join(" · ")}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{f.distance}</span>
                  <span className="flex items-center gap-0.5 text-xs text-primary">
                    <Star className="h-3 w-3 fill-current" /> {f.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground font-poppins py-6">
              No firms match this filter.
            </p>
          )}
        </div>
      </section>
    </AppShell>
  );
}
