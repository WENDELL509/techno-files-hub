import type { ReactNode } from "react";
import { Logo } from "./Logo";
import { MapPin, MessageCircle, Search, Home, User } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const AppShell = ({
  children,
  hideTopBar = false,
}: {
  children: ReactNode;
  hideTopBar?: boolean;
}) => {
  const location = useLocation();
  const path = location.pathname;

  const tabs: { icon: typeof Home; to: string; match: (p: string) => boolean; label: string }[] = [
    { icon: Home, to: "/", match: (p) => p === "/", label: "Home" },
    { icon: Search, to: "/search", match: (p) => p.startsWith("/search"), label: "Search" },
    { icon: MapPin, to: "/firm/vedua", match: (p) => p.startsWith("/firm"), label: "Firms" },
    { icon: MessageCircle, to: "/messages", match: (p) => p.startsWith("/messages"), label: "Messages" },
    { icon: User, to: "/", match: () => false, label: "Profile" },
  ];

  return (
    <div className="mobile-frame gradient-surface text-foreground flex flex-col">
      {!hideTopBar && (
        <header className="sticky top-0 z-40 flex items-center gap-3 px-5 pt-5 pb-3 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <Logo className="h-9 w-9" />
          <div className="leading-none">
            <h1 className="font-display text-lg text-foreground">FALCON</h1>
            <p className="text-[10px] text-primary font-poppins italic tracking-wider">
              Precision from Every Peak
            </p>
          </div>
        </header>
      )}
      <main className="flex-1 pb-24">{children}</main>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 px-4 pb-3">
        <div className="flex items-center justify-around bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-card-elegant py-2">
          {tabs.map((t, i) => {
            const Icon = t.icon;
            const active = t.match(path);
            return (
              <Link
                key={i}
                to={t.to}
                aria-label={t.label}
                className={cn(
                  "p-3 rounded-xl transition-all",
                  active
                    ? "gradient-primary text-primary-foreground shadow-pin"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
