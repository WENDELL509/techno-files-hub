import { useState } from "react";
import { Link, Outlet, createFileRoute, useLocation, useNavigate, notFound } from "@tanstack/react-router";
import { ArrowLeft, Phone, Mail, MapPin, Clock, Star, Share2, Mail as MailIcon, HardHat, Settings, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(firm.services.slice(0, 2));
  const [ratings, setRatings] = useState<{ Punctuality: number; Professionalism: number; Service: number }>({
    Punctuality: 0,
    Professionalism: 0,
    Service: 0,
  });
  const [feedback, setFeedback] = useState("");
  const currentStatus = 1; // 0..3

  const toggle = (s: string) =>
    setSelected((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const onBook = () => {
    bookingStore.set({ selectedSurveys: selected, firmId: firm.id });
    navigate({ to: "/firm/$id/book", params: { id: firm.id } });
  };

  if (location.pathname.endsWith("/book")) {
    return <Outlet />;
  }

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

      {/* Status Tracker */}
      <div className="px-5 mt-8">
        <h2 className="font-display text-base mb-3">Status</h2>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Received", icon: MailIcon },
            { label: "Conduct Field", icon: HardHat },
            { label: "Processing", icon: Settings },
            { label: "Done", icon: Package },
          ].map((s, i) => {
            const Icon = s.icon;
            const reached = i <= currentStatus;
            return (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center border",
                    reached
                      ? "gradient-primary border-transparent shadow-pin"
                      : "bg-secondary/50 border-border",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      reached ? "text-primary-foreground" : "text-muted-foreground",
                    )}
                  />
                </div>
                <span className="text-[10px] font-poppins text-center text-foreground/80 leading-tight">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rate */}
      <div className="px-5 mt-7">
        <h2 className="font-display text-base mb-3">Rate</h2>
        <div className="rounded-2xl bg-card border border-border divide-y divide-border">
          {(["Punctuality", "Professionalism", "Service"] as const).map((k) => (
            <div key={k} className="flex items-center justify-between p-3">
              <span className="text-sm font-poppins text-foreground">{k}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRatings((p) => ({ ...p, [k]: n }))}
                    aria-label={`${k} ${n} star`}
                  >
                    <Star
                      className={cn(
                        "h-5 w-5 transition-colors",
                        n <= ratings[k]
                          ? "text-primary fill-current"
                          : "text-muted-foreground",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="px-5 mt-7">
        <h2 className="font-display text-base mb-3">Feedback</h2>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your experience with this firm..."
          className="min-h-[100px] rounded-2xl bg-input border-border font-poppins"
        />
        <Button
          variant="outline"
          className="w-full mt-3 font-poppins"
          onClick={() => {
            toast.success("Feedback submitted", {
              description: "Thanks for rating this firm.",
            });
            setFeedback("");
          }}
        >
          Submit Feedback
        </Button>
      </div>

      {/* Bottom spacer so sticky CTA doesn't cover content */}
      <div className="h-32" />

      {/* Booking CTA */}
      <div className="fixed bottom-24 left-1/2 z-[70] w-full max-w-[440px] -translate-x-1/2 px-5 pb-3 pointer-events-none">
        <div className="pointer-events-auto">
          <Button
            asChild
            variant="hero"
            size="xl"
            className="w-full font-display text-sm shadow-pin"
            disabled={selected.length === 0}
          >
            <Link
              to="/firm/$id/book"
              params={{ id: firm.id }}
              onClick={(event) => {
                if (selected.length === 0) {
                  event.preventDefault();
                  return;
                }
                onBook();
              }}
            >
              Book a Request {selected.length > 0 && `· ${selected.length}`}
            </Link>
          </Button>
        </div>
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
