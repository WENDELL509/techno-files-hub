import { useState } from "react";
import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { ArrowLeft, Phone, Mail, MapPin, Clock, Star, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/falcon/AppShell";
import { bookingStore } from "@/lib/booking";
import { getFirm } from "@/lib/firms";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { title: "Property Boundary", color: "from-primary to-primary-glow", items: ["Relocation", "Boundary", "Verification"] },
  { title: "Land Division", color: "from-primary to-accent", items: ["Subdivision", "Consolidation", "Sub-Consol"] },
  { title: "Legal Titling", color: "from-accent to-primary", items: ["Cadastral", "Original"] },
  { title: "Specialized", color: "from-accent to-primary-glow", items: ["As-Built", "Hydrographic", "Topographic", "Alignment"] },
];

export const Route = createFileRoute("/firm/$id")({
  loader: ({ params }) => {
    const firm = getFirm(params.id);
    if (!firm) throw notFound();
    return { firm };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.firm.name} — Falcon Geosolutions` },
          {
            name: "description",
            content: `Book a survey with ${loaderData.firm.name} in Davao City. Services: ${loaderData.firm.services.join(", ")}.`,
          },
          { property: "og:title", content: `${loaderData.firm.name} — Falcon` },
          {
            property: "og:description",
            content: `Geodetic surveying services in Davao City.`,
          },
        ]
      : [],
  }),
  component: FirmProfile,
});

function FirmProfile() {
  const { firm } = Route.useLoaderData();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(firm.services.slice(0, 2));

  const toggle = (s: string) =>
    setSelected((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const onBook = () => {
    bookingStore.set({ selectedSurveys: selected, firmId: firm.id });
    navigate({ to: "/firm/$id/book", params: { id: firm.id } });
  };

  return (
    <AppShell hideTopBar>
      <div className="relative px-5 pt-5 pb-6 gradient-surface">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate({ to: "/" })}
            className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <div className="text-center">
          <div className="inline-flex h-20 w-20 rounded-2xl gradient-primary items-center justify-center shadow-pin mb-3 mx-auto">
            <MapPin className="h-10 w-10 text-primary-foreground" fill="currentColor" />
          </div>
          <h1 className="font-display text-xl text-foreground">{firm.name}</h1>
          {firm.tagline && (
            <p className="text-xs text-primary font-poppins tracking-widest mt-1 uppercase">
              {firm.tagline}
            </p>
          )}
          <div className="mt-3 inline-flex items-center gap-1.5 bg-card/60 border border-border rounded-full px-3 py-1">
            <Star className="h-3.5 w-3.5 text-primary fill-current" />
            <span className="text-xs font-poppins font-semibold">{firm.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({firm.reviews ?? 0} reviews)
            </span>
          </div>
          {firm.engineer && (
            <div className="mt-5 p-4 rounded-2xl bg-card border border-border">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Geodetic Engineer
              </p>
              <p className="font-display text-base mt-1 text-primary">{firm.engineer}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 mt-2 space-y-2">
        {firm.phone && <ContactRow icon={Phone} label="Phone" value={firm.phone} />}
        {firm.address && <ContactRow icon={MapPin} label="Address" value={firm.address} />}
        {firm.email && <ContactRow icon={Mail} label="Email" value={firm.email} />}
        {firm.hours && <ContactRow icon={Clock} label="Operating Hours" value={firm.hours} />}
      </div>

      <div className="px-5 mt-7">
        <h2 className="font-display text-base mb-1">Select Survey Type</h2>
        <p className="text-xs text-muted-foreground font-poppins mb-4">
          Choose one or more services for your inquiry.
        </p>

        <div className="space-y-5">
          {CATEGORIES.map((c) => (
            <div key={c.title}>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("h-2 w-2 rounded-full bg-gradient-to-r", c.color)} />
                <h3 className="font-poppins font-semibold text-sm uppercase tracking-wider text-foreground/90">
                  {c.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {c.items.map((s) => {
                  const active = selected.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggle(s)}
                      className={cn(
                        "px-4 h-9 rounded-full text-xs font-poppins font-medium border transition-all",
                        active
                          ? "gradient-primary text-primary-foreground border-transparent shadow-pin"
                          : "bg-secondary/50 text-foreground border-border hover:border-primary/50",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[440px] px-5 z-40">
        <Button
          variant="hero"
          size="xl"
          className="w-full font-display text-sm"
          onClick={onBook}
          disabled={selected.length === 0}
        >
          Book a Request {selected.length > 0 && `· ${selected.length}`}
        </Button>
      </div>
    </AppShell>
  );
}

const ContactRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-2xl bg-card border border-border">
    <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-poppins">
        {label}
      </p>
      <p className="text-sm font-poppins text-foreground break-words">{value}</p>
    </div>
  </div>
);
