import { useState, useMemo } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Upload, FileText, BadgeCheck, Zap, Calendar as CalendarIcon, Sun, Moon, Receipt, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { AppShell } from "@/components/falcon/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurveyPricingEngine, formatPHP } from "@/lib/pricing-engine";
import { useBooking } from "@/lib/booking";
import { cn } from "@/lib/utils";
import type { ReactNode, InputHTMLAttributes } from "react";

export const Route = createFileRoute("/firm/$id/book")({
  head: () => ({
    meta: [
      { title: "Booking Request — Falcon Geosolutions" },
      { name: "description", content: "Provide land details to request a surveying engagement." },
    ],
  }),
  component: BookingForm,
});

function BookingForm() {
  const navigate = useNavigate();
  const router = useRouter();
  const { id } = Route.useParams();
  const { selectedSurveys } = useBooking();
  const surveys = selectedSurveys.length ? selectedSurveys : ["Boundary", "Subdivision"];
  const [step, setStep] = useState<1 | 2>(1);
  const [urgency, setUrgency] = useState<"Standard" | "Rush">("Standard");
  const [timeOfDay, setTimeOfDay] = useState<"Morning" | "Afternoon">("Morning");
  const [date, setDate] = useState<Date | undefined>();
  const [notes, setNotes] = useState("");

  const quote = useMemo(() => {
    try {
      return SurveyPricingEngine.generateProjectQuote({
        surveyType: "RELOCATION_SURVEY",
        areaInHectares: 12.5,
        landUseType: "COMMERCIAL",
        topoInterval: 0.5,
        slopeDegrees: 22,
        disbursements: 4500,
        isHighRiskZone: true,
      });
    } catch {
      return null;
    }
  }, []);

  const billingRows = quote
    ? [
        ["Boundary Survey Fee", quote.breakdown.baseSurveyFee],
        ["Zoning Adjustment Modifier", quote.breakdown.zoningAdjustment],
        ["Contour Mapping", quote.breakdown.topographicCost],
        ["Terrain Complexity Penalty", quote.breakdown.hazardPay],
        ["Document Filing Disbursements", quote.breakdown.disbursementsOverhead],
        ["System Establishment Fee", quote.breakdown.establishmentFee],
        ["Project Contingency Buffer", quote.breakdown.contingencyBuffer],
        ["Corporate Profit Margin", quote.breakdown.firmProfit],
        ["VAT (12%)", quote.breakdown.statutoryVat],
      ] as const
    : [];

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.history.back();
    }
  };

  const goNext = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppShell hideTopBar>
      <div className="px-5 pt-5 pb-4 sticky top-0 bg-background/90 backdrop-blur-xl z-20 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={goBack}
            className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-display text-base">Booking Request</h1>
            <p className="text-[10px] text-muted-foreground font-poppins tracking-wider">
              STEP {step} OF 2 · {step === 1 ? "LAND DETAILS" : "CONTACT & SCHEDULE"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl gradient-primary p-4 shadow-pin">
          <p className="text-[10px] uppercase tracking-widest text-primary-foreground/80 font-poppins">
            You have requested
          </p>
          <p className="font-display text-sm text-primary-foreground mt-1">
            {surveys.map((s) => `${s} Survey`).join(", ")}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-background/20 backdrop-blur rounded-full px-3 py-1">
            <BadgeCheck className="h-3.5 w-3.5 text-primary-foreground" />
            <span className="text-xs font-poppins text-primary-foreground">
              Number of Surveys: {surveys.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="h-1.5 rounded-full gradient-primary" />
          <div className={cn("h-1.5 rounded-full", step === 2 ? "gradient-primary" : "bg-secondary")} />
        </div>
      </div>

      {step === 1 ? (
        <div className="px-5 pt-5 space-y-5">
          <div>
            <h2 className="font-display text-sm mb-1">Land Information</h2>
            <p className="text-xs text-muted-foreground font-poppins">
              Please provide the necessary information about the land.
            </p>
          </div>

          <Field label="Terrain Type">
            <Select>
              <FieldTrigger placeholder="Select terrain" />
              <SelectContent>
                <SelectItem value="level">Level</SelectItem>
                <SelectItem value="rolling">Rolling (Slopes 2–3°)</SelectItem>
                <SelectItem value="rugged">Rugged (Steep slopes)</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Vegetation Status">
            <Select>
              <FieldTrigger placeholder="Select vegetation" />
              <SelectContent>
                <SelectItem value="clear">Clear</SelectItem>
                <SelectItem value="heavy">Heavily vegetated</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Topographic Slope">
            <Select>
              <FieldTrigger placeholder="Select slope" />
              <SelectContent>
                <SelectItem value="below18">Below 18% slope</SelectItem>
                <SelectItem value="over18">Over 18% (50% surcharge)</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Boundary Markers" hint="4 corners standard">
              <FieldInput type="number" defaultValue={4} min={1} />
            </Field>
            <Field label="Total Lot Area" hint="square meters">
              <FieldInput type="number" placeholder="0" />
            </Field>
          </div>

          <Field label="Land Use Classification">
            <Select>
              <FieldTrigger placeholder="Select classification" />
              <SelectContent>
                <SelectItem value="agri">Agricultural / Institutional</SelectItem>
                <SelectItem value="res">Residential (Base + 50%)</SelectItem>
                <SelectItem value="ind">Industrial (Base + 120%)</SelectItem>
                <SelectItem value="com">Commercial / Mixed Use (Base + 150%)</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Urgency">
            <div className="grid grid-cols-2 gap-2 p-1 bg-input rounded-xl">
              {(["Standard", "Rush"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUrgency(u)}
                  className={cn(
                    "h-10 rounded-lg text-sm font-poppins font-medium transition-all flex items-center justify-center gap-1.5",
                    urgency === u
                      ? "gradient-primary text-primary-foreground shadow-pin"
                      : "text-muted-foreground",
                  )}
                >
                  {u === "Rush" && <Zap className="h-3.5 w-3.5" />}
                  {u}
                </button>
              ))}
            </div>
          </Field>

          <div className="pt-2">
            <h2 className="font-display text-sm mb-3">Required Documents</h2>
            <div className="grid grid-cols-2 gap-3">
              <Dropzone label="TCT / OCT / Tax Dec" />
              <Dropzone label="Valid ID" />
            </div>
          </div>

          <Button
            variant="hero"
            size="xl"
            className="w-full font-display text-sm mt-4"
            onClick={goNext}
          >
            Continue · Step 2
          </Button>
          <p className="text-center text-[10px] text-muted-foreground font-poppins pb-4">
            Submitting to firm <span className="text-primary">{id}</span>
          </p>
        </div>
      ) : (
        <div className="px-5 pt-5 space-y-5">
          <div>
            <h2 className="font-display text-sm mb-1">Contact & Schedule</h2>
            <p className="text-xs text-muted-foreground font-poppins">
              How can the surveyor reach you and when should they visit?
            </p>
          </div>

          <Field label="Full Name">
            <FieldInput placeholder="Juan Dela Cruz" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone">
              <FieldInput type="tel" placeholder="0917 000 0000" />
            </Field>
            <Field label="Email">
              <FieldInput type="email" placeholder="you@email.com" />
            </Field>
          </div>

          <Field label="Site Address" hint="Barangay, City">
            <FieldInput placeholder="55A, 7 Veloso St, Bo Obrero, Davao City" />
          </Field>

          <Field label="Preferred Date">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 w-full justify-start rounded-xl bg-input border-border font-poppins",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </Field>

          <Field label="Preferred Time">
            <div className="grid grid-cols-2 gap-2 p-1 bg-input rounded-xl">
              {(["Morning", "Afternoon"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeOfDay(t)}
                  className={cn(
                    "h-10 rounded-lg text-sm font-poppins font-medium transition-all flex items-center justify-center gap-1.5",
                    timeOfDay === t
                      ? "gradient-primary text-primary-foreground shadow-pin"
                      : "text-muted-foreground",
                  )}
                >
                  {t === "Morning" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                  {t}
                </button>
              ))}
            </div>
          </Field>

          {quote && (
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="w-full rounded-2xl border border-primary/40 bg-card p-4 flex items-center justify-between shadow-pin hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                      <Receipt className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-poppins">
                        Estimated Subtotal
                      </p>
                      <p className="font-display text-base text-primary">
                        {formatPHP(quote.totalContractPrice)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-poppins text-muted-foreground">
                    View breakdown
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-display text-primary">Billing Breakdown</SheetTitle>
                </SheetHeader>
                <div className="mt-4 divide-y divide-border">
                  {billingRows.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between py-3">
                      <span className="text-sm font-poppins text-foreground/80">{label}</span>
                      <span className="text-sm font-poppins font-medium">{formatPHP(value as number)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl gradient-primary p-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-primary-foreground/80 font-poppins">
                    Total Project Cost
                  </span>
                  <span className="font-display text-lg text-primary-foreground">
                    {formatPHP(quote.totalContractPrice)}
                  </span>
                </div>
                <p className="mt-3 text-[10px] text-muted-foreground font-poppins text-center">
                  Computed per GEPI regional tariff. Final amount may vary with verified land details.
                </p>
              </SheetContent>
            </Sheet>
          )}



          <Field label="Additional Notes">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything else the surveyor should know?"
              className="min-h-[100px] rounded-xl bg-input border-border font-poppins"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              size="xl"
              className="font-poppins"
              onClick={() => {
                setStep(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Back
            </Button>
            <Button
              variant="hero"
              size="xl"
              className="font-display text-sm"
              onClick={() => navigate({ to: "/confirmation" })}
            >
              Submit Request
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground font-poppins pb-4">
            Submitting to firm <span className="text-primary">{id}</span>
          </p>
        </div>
      )}
    </AppShell>
  );
}

const Field = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  <div>
    <div className="flex items-baseline justify-between mb-1.5">
      <Label className="text-xs font-poppins font-semibold uppercase tracking-wider text-foreground/80">
        {label}
      </Label>
      {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
    </div>
    {children}
  </div>
);

const FieldTrigger = ({ placeholder }: { placeholder: string }) => (
  <SelectTrigger className="h-12 rounded-xl bg-input border-border font-poppins">
    <SelectValue placeholder={placeholder} />
  </SelectTrigger>
);

const FieldInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <Input {...props} className="h-12 rounded-xl bg-input border-border font-poppins" />
);

const Dropzone = ({ label }: { label: string }) => (
  <button className="group flex flex-col items-center justify-center gap-2 h-28 rounded-2xl border-2 border-dashed border-border bg-card hover:border-primary hover:bg-primary/5 transition-all p-3">
    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-pin">
      <Upload className="h-4 w-4 text-primary-foreground" />
    </div>
    <span className="text-[11px] font-poppins font-medium text-center text-foreground/80 leading-tight">
      <FileText className="inline h-3 w-3 mr-1 -mt-0.5 text-primary" />
      {label}
    </span>
  </button>
);
