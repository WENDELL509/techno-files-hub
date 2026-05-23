import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";
import { AppShell } from "@/components/falcon/AppShell";
import { Input } from "@/components/ui/input";
import { FIRMS } from "@/lib/firms";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Falcon Geosolutions" },
      {
        name: "description",
        content: "In-app chat with your geodetic engineers. Coordinate paperwork and survey status.",
      },
    ],
  }),
  component: Messages,
});

// Static seed previews so the inbox feels alive.
const SEED_PREVIEWS: Record<string, { text: string; time: string; unread?: boolean }> = {
  vedua: { text: "Booking received — we'll confirm schedule by tomorrow.", time: "now", unread: true },
};

const FALLBACK_PREVIEWS = [
  { text: "Thanks for reaching out. Sending the quote shortly.", time: "2h" },
  { text: "We're available this Friday for the site visit.", time: "1d" },
  { text: "Could you share the lot's TCT number?", time: "2d" },
  { text: "Survey completed — drafting the plan now.", time: "3d" },
  { text: "Welcome to Falcon. How can we help?", time: "5d" },
];

function Messages() {
  const navigate = useNavigate();

  const threads = FIRMS.map((f, i) => {
    const seed = SEED_PREVIEWS[f.id] ?? FALLBACK_PREVIEWS[i % FALLBACK_PREVIEWS.length];
    return {
      id: f.id,
      name: f.name,
      engineer: f.engineer ?? "Geodetic Engineer",
      preview: seed.text,
      time: seed.time,
      unread: "unread" in seed ? seed.unread : false,
      initial: f.name.charAt(0).toUpperCase(),
    };
  });

  return (
    <AppShell hideTopBar>
      <div className="px-5 pt-5 pb-4 sticky top-0 bg-background/90 backdrop-blur-xl z-20 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate({ to: "/" })}
            className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-display text-base">Messages</h1>
            <p className="text-[10px] text-muted-foreground font-poppins tracking-wider">
              IN-APP CHAT · {threads.length} CONVERSATIONS
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages"
            className="pl-11 h-11 rounded-2xl bg-input border-border font-poppins"
          />
        </div>
      </div>

      <div className="px-3 pt-3 space-y-1">
        {threads.map((t, i) => (
          <button
            key={t.id}
            onClick={() => navigate({ to: "/firm/$id", params: { id: t.id } })}
            className="w-full text-left flex items-center gap-3 p-3 rounded-2xl hover:bg-card transition-all animate-fade-up"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="relative shrink-0">
              <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center font-display text-base text-primary-foreground shadow-pin">
                {t.initial}
              </div>
              {t.unread && (
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-poppins font-semibold text-sm truncate">{t.name}</p>
                <span className="text-[10px] text-muted-foreground shrink-0">{t.time}</span>
              </div>
              <p className="text-[11px] text-primary font-poppins truncate">{t.engineer}</p>
              <p
                className={`text-xs truncate mt-0.5 ${
                  t.unread ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {t.preview}
              </p>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-poppins pb-4">
        Precision from Every Peak
      </p>
    </AppShell>
  );
}
