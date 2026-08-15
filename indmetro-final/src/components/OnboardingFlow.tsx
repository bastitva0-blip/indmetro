import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin, User, Train } from "lucide-react";
import IndMetroLogo from "@/components/icons/IndMetroLogo";

const ONBOARDING_KEY = "indmetro:onboarding:v1";

interface CityOption {
  slug: string;
  name: string;
  state: string;
  color: string;
  emoji: string;
}

const CITIES: CityOption[] = [
  { slug: "delhi",      name: "Delhi",       state: "Delhi NCT",       color: "#E53935", emoji: "🏛️" },
  { slug: "mumbai",     name: "Mumbai",      state: "Maharashtra",     color: "#1E88E5", emoji: "🌊" },
  { slug: "bangalore",  name: "Bangalore",   state: "Karnataka",       color: "#43A047", emoji: "🌿" },
  { slug: "hyderabad",  name: "Hyderabad",   state: "Telangana",       color: "#FB8C00", emoji: "💎" },
  { slug: "chennai",    name: "Chennai",     state: "Tamil Nadu",      color: "#8E24AA", emoji: "🌺" },
  { slug: "kolkata",    name: "Kolkata",     state: "West Bengal",     color: "#00897B", emoji: "🎭" },
  { slug: "ahmedabad",  name: "Ahmedabad",   state: "Gujarat",         color: "#F4511E", emoji: "🏺" },
  { slug: "pune",       name: "Pune",        state: "Maharashtra",     color: "#6D4C41", emoji: "🎓" },
  { slug: "lucknow",    name: "Lucknow",     state: "Uttar Pradesh",   color: "#7B1FA2", emoji: "🕌" },
  { slug: "kanpur",     name: "Kanpur",      state: "Uttar Pradesh",   color: "#FF7043", emoji: "🏭" },
  { slug: "noida",      name: "Noida",       state: "Uttar Pradesh",   color: "#039BE5", emoji: "💻" },
  { slug: "gurgaon",    name: "Gurgaon",     state: "Haryana",         color: "#00ACC1", emoji: "🏙️" },
  { slug: "jaipur",     name: "Jaipur",      state: "Rajasthan",       color: "#E91E63", emoji: "🏯" },
  { slug: "kochi",      name: "Kochi",       state: "Kerala",          color: "#00BFA5", emoji: "⛵" },
  { slug: "nagpur",     name: "Nagpur",      state: "Maharashtra",     color: "#FF8F00", emoji: "🍊" },
  { slug: "navi_mumbai",name: "Navi Mumbai", state: "Maharashtra",     color: "#546E7A", emoji: "🏗️" },
  { slug: "meerut",     name: "Meerut",      state: "Uttar Pradesh",   color: "#558B2F", emoji: "🚄" },
  { slug: "agra",       name: "Agra",        state: "Uttar Pradesh",   color: "#6A1B9A", emoji: "🕍" },
  { slug: "indore",     name: "Indore",      state: "Madhya Pradesh",  color: "#AD1457", emoji: "🍛" },
  { slug: "bhopal",     name: "Bhopal",      state: "Madhya Pradesh",  color: "#2E7D32", emoji: "🌊" },
  { slug: "patna",      name: "Patna",       state: "Bihar",           color: "#4527A0", emoji: "🛕" },
];

type Step = "welcome" | "name" | "city" | "done";

export function OnboardingFlow({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (localStorage.getItem(ONBOARDING_KEY)) setDone(true);
    } catch {
      setDone(true);
    }
  }, []);

  const finish = (citySlug?: string) => {
    try {
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify({ name, homeCity: citySlug, ts: Date.now() }));
    } catch {}
    setDone(true);
    if (citySlug) navigate(`/${citySlug}`);
  };

  if (done) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[2000] bg-background flex flex-col">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-6 pb-2">
        {(["welcome", "name", "city"] as Step[]).map((s, i) => (
          <div
            key={s}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: step === s ? 24 : 8,
              background: step === s ? "hsl(var(--primary))" : "hsl(var(--border))",
            }}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {step === "welcome" && <StepWelcome onNext={() => setStep("name")} />}
        {step === "name" && <StepName name={name} setName={setName} onNext={() => setStep("city")} />}
        {step === "city" && <StepCity onSelect={finish} onSkip={() => finish()} />}
      </div>
    </div>
  );
}

// ── Step 1: Welcome ────────────────────────────────────────────────────────────
function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 text-center">
      <div className="mb-8 animate-fade-up">
        <IndMetroLogo size={80} />
      </div>
      <h1 className="text-3xl font-bold mb-3 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        Welcome to IndMetro
      </h1>
      <p className="text-muted-foreground text-base max-w-xs mb-2 animate-fade-up" style={{ animationDelay: "0.15s" }}>
        India's unified metro companion — 21 cities, all in one app.
      </p>
      <p className="text-muted-foreground text-sm max-w-xs mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        Plan routes, track trains, check fares, find friends.
      </p>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-10 animate-fade-up" style={{ animationDelay: "0.25s" }}>
        {[
          { label: "Cities", value: "21" },
          { label: "Stations", value: "1000+" },
          { label: "Lines", value: "50+" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl py-3 px-2 text-center">
            <p className="text-xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <Button onClick={onNext} size="lg" className="w-full max-w-xs animate-fade-up" style={{ animationDelay: "0.3s" }}>
        Get started <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}

// ── Step 2: Name ───────────────────────────────────────────────────────────────
function StepName({
  name,
  setName,
  onNext,
}: {
  name: string;
  setName: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col min-h-full px-6 py-10">
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
        <User className="h-6 w-6 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-1">What's your name?</h2>
      <p className="text-muted-foreground text-sm mb-8">
        We'll personalise your experience. You can skip this.
      </p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
        className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-base outline-none focus:border-primary transition-colors mb-4"
        autoFocus
        onKeyDown={(e) => e.key === "Enter" && onNext()}
      />

      <Button onClick={onNext} size="lg" className="w-full mt-2">
        {name.trim() ? `Continue, ${name.trim().split(" ")[0]} →` : "Skip for now →"}
      </Button>
    </div>
  );
}

// ── Step 3: City ───────────────────────────────────────────────────────────────
function StepCity({
  onSelect,
  onSkip,
}: {
  onSelect: (slug: string) => void;
  onSkip: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-full px-4 py-6">
      <div className="px-2 mb-6">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-1">Your home city</h2>
        <p className="text-muted-foreground text-sm">
          Pick the metro you use most — we'll open it by default.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-6 px-0">
        {CITIES.map((city) => (
          <button
            key={city.slug}
            onClick={() => setSelected(city.slug)}
            className="text-left rounded-2xl border-2 px-3 py-3 transition-all active:scale-[0.97]"
            style={{
              borderColor: selected === city.slug ? city.color : "hsl(var(--border))",
              background: selected === city.slug ? city.color + "18" : "hsl(var(--card))",
            }}
          >
            <span className="text-2xl mb-1 block">{city.emoji}</span>
            <p className="font-semibold text-sm leading-tight">{city.name}</p>
            <p className="text-xs text-muted-foreground">{city.state}</p>
          </button>
        ))}
      </div>

      <div className="px-0 pb-8 flex flex-col gap-2">
        <Button
          onClick={() => selected && onSelect(selected)}
          size="lg"
          className="w-full"
          disabled={!selected}
        >
          <Train className="h-4 w-4 mr-2" />
          Open {selected ? CITIES.find((c) => c.slug === selected)?.name : "city"}
        </Button>
        <Button variant="ghost" onClick={onSkip} className="w-full text-muted-foreground">
          Skip, show all cities
        </Button>
      </div>
    </div>
  );
}

export default OnboardingFlow;
