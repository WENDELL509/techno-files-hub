import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Home, HardHat, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppShell } from "@/components/falcon/AppShell";
import { Logo } from "@/components/falcon/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Falcon Geosolutions — Log In" },
      {
        name: "description",
        content:
          "Log in to Falcon Geosolutions to find and book trusted geodetic surveying firms across Davao City.",
      },
      { property: "og:title", content: "Falcon Geosolutions — Log In" },
      {
        property: "og:description",
        content: "Sign in or create a Falcon account to book a surveying firm in Davao.",
      },
    ],
  }),
  component: OnboardingFlow,
});

type Step = "login" | "role" | "signup";
type Role = "landowner" | "professional";

function OnboardingFlow() {
  const [step, setStep] = useState<Step>("login");
  const [role, setRole] = useState<Role | null>(null);
  const navigate = useNavigate();

  return (
    <AppShell hideTopBar>
      <div className="min-h-[85vh] px-6 pt-10 pb-6 flex flex-col">
        {step === "login" && (
          <LoginScreen
            onLogin={() => navigate({ to: "/search" })}
            onSignUp={() => setStep("role")}
          />
        )}
        {step === "role" && (
          <RoleScreen
            onBack={() => setStep("login")}
            onPick={(r) => {
              setRole(r);
              setStep("signup");
            }}
          />
        )}
        {step === "signup" && (
          <SignupScreen
            role={role}
            onBack={() => setStep("role")}
            onDone={() => navigate({ to: "/search" })}
          />
        )}
      </div>
    </AppShell>
  );
}

function LoginScreen({ onLogin, onSignUp }: { onLogin: () => void; onSignUp: () => void }) {
  const [show, setShow] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onLogin();
      }}
      className="flex flex-col items-center w-full max-w-sm mx-auto animate-fade-up"
    >
      <Logo className="h-20 w-20 mb-3" />
      <h1 className="font-display text-xl text-foreground">FALCON</h1>
      <p className="text-[10px] text-primary font-poppins italic tracking-wider mb-8">
        Precision from Every Peak
      </p>

      <h2 className="font-display text-2xl text-foreground self-start mb-6">
        Hi, welcome back!
      </h2>

      <div className="w-full space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="font-poppins text-xs text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="example@gmail.com"
            className="h-12 rounded-xl bg-card border-border font-poppins"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="font-poppins text-xs text-muted-foreground">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              required
              placeholder="••••••••••"
              className="h-12 rounded-xl bg-card border-border font-poppins pr-11"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <button
            type="button"
            className="text-xs text-primary font-poppins block ml-auto mt-1"
          >
            Forget Password?
          </button>
        </div>
      </div>

      <Button type="submit" variant="hero" size="xl" className="w-full mt-8 font-display">
        LOG IN
        <ArrowRight className="h-4 w-4" />
      </Button>

      <p className="mt-6 text-sm text-muted-foreground font-poppins">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSignUp}
          className="text-primary font-semibold underline-offset-2 hover:underline"
        >
          Sign Up
        </button>
      </p>
    </form>
  );
}

function RoleScreen({
  onBack,
  onPick,
}: {
  onBack: () => void;
  onPick: (r: Role) => void;
}) {
  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto animate-fade-up">
      <button
        onClick={onBack}
        className="self-start -ml-2 mb-4 p-2 text-muted-foreground hover:text-foreground"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <Logo className="h-16 w-16 mb-3" />
      <h1 className="font-display text-lg text-foreground">FALCON</h1>
      <p className="text-[10px] text-primary font-poppins italic tracking-wider mb-10">
        Precision from Every Peak
      </p>

      <h2 className="font-display text-3xl text-primary mb-2">JOIN FALCON!</h2>
      <p className="font-poppins text-sm text-muted-foreground mb-8">Are you a…</p>

      <div className="w-full space-y-4">
        <RoleCard
          icon={<Home className="h-7 w-7" />}
          title="Landowner"
          desc="I need to book a surveying firm for my property."
          onClick={() => onPick("landowner")}
        />
        <div className="text-center text-xs text-muted-foreground font-poppins">or</div>
        <RoleCard
          icon={<HardHat className="h-7 w-7" />}
          title="Professional"
          desc="I'm a licensed geodetic engineer or surveyor."
          onClick={() => onPick("professional")}
        />
      </div>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/60 transition-all text-left shadow-card-elegant"
    >
      <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center shrink-0 text-primary-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-base text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground font-poppins mt-0.5">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function SignupScreen({
  role,
  onBack,
  onDone,
}: {
  role: Role | null;
  onBack: () => void;
  onDone: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!agreed) return;
        onDone();
      }}
      className="flex flex-col w-full max-w-sm mx-auto animate-fade-up"
    >
      <button
        type="button"
        onClick={onBack}
        className="self-start -ml-2 mb-2 p-2 text-muted-foreground hover:text-foreground"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <h2 className="font-display text-2xl text-foreground">Create Account</h2>
      <p className="text-sm text-muted-foreground font-poppins mt-1 mb-6">
        Fill your information below
        {role && (
          <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary border border-primary/40 bg-primary/10 px-1.5 py-0.5 rounded-md font-semibold">
            {role}
          </span>
        )}
      </p>

      <div className="space-y-4">
        <Field id="name" label="Name" placeholder="Juan Dela Cruz" required />

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="font-poppins text-xs text-muted-foreground">
            Phone Number
          </Label>
          <div className="flex gap-2">
            <div className="h-12 px-3 rounded-xl bg-card border border-border flex items-center font-poppins text-sm shrink-0">
              +63 ▾
            </div>
            <Input
              id="phone"
              type="tel"
              required
              placeholder="Enter your Phone Number"
              className="h-12 rounded-xl bg-card border-border font-poppins"
            />
          </div>
        </div>

        <Field id="email2" label="Email" type="email" placeholder="example@gmail.com" required />

        <PasswordField
          id="pw1"
          label="Password"
          show={show}
          onToggle={() => setShow((s) => !s)}
        />
        <PasswordField
          id="pw2"
          label="Confirm Password"
          show={show2}
          onToggle={() => setShow2((s) => !s)}
        />

        <label className="flex items-start gap-2 text-xs text-muted-foreground font-poppins cursor-pointer pt-1">
          <button
            type="button"
            onClick={() => setAgreed((a) => !a)}
            aria-pressed={agreed}
            className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
              agreed ? "gradient-primary border-transparent" : "bg-card border-border"
            }`}
          >
            {agreed && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
          </button>
          <span>
            Agree with <span className="text-primary">Terms &amp; Conditions</span>
          </span>
        </label>
      </div>

      <Button
        type="submit"
        variant="hero"
        size="xl"
        disabled={!agreed}
        className="w-full mt-8 font-display disabled:opacity-50"
      >
        Sign Up
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  ...rest
}: { id: string; label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="font-poppins text-xs text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        className="h-12 rounded-xl bg-card border-border font-poppins"
        {...rest}
      />
    </div>
  );
}

function PasswordField({
  id,
  label,
  show,
  onToggle,
}: {
  id: string;
  label: string;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="font-poppins text-xs text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          required
          placeholder="••••••••••"
          className="h-12 rounded-xl bg-card border-border font-poppins pr-11"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
