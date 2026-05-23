import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/falcon/AppShell";
import { Logo } from "@/components/falcon/Logo";

export const Route = createFileRoute("/confirmation")({
  head: () => ({
    meta: [
      { title: "Request Submitted — Falcon Geosolutions" },
      {
        name: "description",
        content: "Your surveying request has been submitted. Your engineer will reach out soon.",
      },
    ],
  }),
  component: Confirmation,
});

function Confirmation() {
  const navigate = useNavigate();
  return (
    <AppShell hideTopBar>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full gradient-primary blur-3xl opacity-50 scale-150" />
          <div className="relative h-28 w-28 rounded-full gradient-primary flex items-center justify-center shadow-pin animate-pin-pop">
            <Check className="h-14 w-14 text-primary-foreground" strokeWidth={3} />
          </div>
        </div>

        <Logo className="h-10 w-10 mb-3" />
        <h1 className="font-display text-2xl text-foreground animate-fade-up">
          Thank you for using <span className="text-primary">Falcon</span>
        </h1>
        <p
          className="mt-3 text-sm text-muted-foreground font-poppins max-w-xs animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          Please wait for any updates from your Engineer.
        </p>

        <div
          className="mt-8 w-full max-w-sm rounded-2xl bg-card border border-border p-4 text-left animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="font-poppins font-semibold text-sm">In-App Chat</p>
              <p className="text-xs text-muted-foreground">
                Your firm will reach out to coordinate paper & survey status.
              </p>
            </div>
          </div>
        </div>

        <div
          className="mt-6 w-full max-w-sm space-y-3 animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          <Button
            variant="hero"
            size="xl"
            className="w-full font-display text-sm"
            onClick={() => navigate({ to: "/messages" })}
          >
            Go to Messages
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full font-poppins"
            onClick={() => navigate({ to: "/search" })}
          >
            Back to Map
          </Button>
        </div>

        <p className="mt-10 text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-poppins">
          Precision from Every Peak
        </p>
      </div>
    </AppShell>
  );
}
