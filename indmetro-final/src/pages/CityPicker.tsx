import { useNavigate } from "react-router-dom";
import { MapPin, Search, ChevronRight, Clock } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import IndMetroLogo from "@/components/icons/IndMetroLogo";

interface City {
  slug: string;
  name: string;
  state: string;
  lineCount: number;
  stationCount: string;
  liveStations: number;
  totalStations: number;
  status: "operational" | "partial" | "wip";
  color: string;
  emoji: string;
}

const CITIES: City[] = [
  { slug: "delhi",       name: "Delhi",       state: "Delhi NCT",      lineCount: 10, stationCount: "271+ live",        liveStations: 271, totalStations: 286, status: "operational", color: "#E53935", emoji: "🏛️" },
  { slug: "mumbai",      name: "Mumbai",      state: "Maharashtra",    lineCount: 5,  stationCount: "69 live",           liveStations: 69,  totalStations: 79,  status: "operational", color: "#1E88E5", emoji: "🌊" },
  { slug: "bangalore",   name: "Bangalore",   state: "Karnataka",      lineCount: 3,  stationCount: "81 live",           liveStations: 81,  totalStations: 81,  status: "operational", color: "#43A047", emoji: "🌿" },
  { slug: "hyderabad",   name: "Hyderabad",   state: "Telangana",      lineCount: 3,  stationCount: "58 live",           liveStations: 58,  totalStations: 57,  status: "operational", color: "#FB8C00", emoji: "💎" },
  { slug: "chennai",     name: "Chennai",     state: "Tamil Nadu",     lineCount: 2,  stationCount: "39 live + 11 UC",   liveStations: 39,  totalStations: 50,  status: "partial",     color: "#8E24AA", emoji: "🌺" },
  { slug: "kolkata",     name: "Kolkata",     state: "West Bengal",    lineCount: 4,  stationCount: "54 live",           liveStations: 54,  totalStations: 65,  status: "operational", color: "#00897B", emoji: "🎭" },
  { slug: "ahmedabad",   name: "Ahmedabad",   state: "Gujarat",        lineCount: 2,  stationCount: "34 live",           liveStations: 34,  totalStations: 45,  status: "operational", color: "#F4511E", emoji: "🏺" },
  { slug: "pune",        name: "Pune",        state: "Maharashtra",    lineCount: 2,  stationCount: "30 live",           liveStations: 30,  totalStations: 23,  status: "operational", color: "#6D4C41", emoji: "🎓" },
  { slug: "lucknow",     name: "Lucknow",     state: "Uttar Pradesh",  lineCount: 2,  stationCount: "21 live + 12 WIP", liveStations: 21,  totalStations: 33,  status: "partial",     color: "#7B1FA2", emoji: "🕌" },
  { slug: "kanpur",      name: "Kanpur",      state: "Uttar Pradesh",  lineCount: 1,  stationCount: "14 live + 8 WIP",  liveStations: 14,  totalStations: 22,  status: "partial",     color: "#FF7043", emoji: "🏭" },
  { slug: "noida",       name: "Noida",       state: "Uttar Pradesh",  lineCount: 1,  stationCount: "21 live",           liveStations: 21,  totalStations: 21,  status: "operational", color: "#039BE5", emoji: "💻" },
  { slug: "gurgaon",     name: "Gurgaon",     state: "Haryana",        lineCount: 1,  stationCount: "11 live",           liveStations: 11,  totalStations: 11,  status: "operational", color: "#00ACC1", emoji: "🏙️" },
  { slug: "jaipur",      name: "Jaipur",      state: "Rajasthan",      lineCount: 1,  stationCount: "11 live",           liveStations: 11,  totalStations: 11,  status: "operational", color: "#E91E63", emoji: "🏯" },
  { slug: "kochi",       name: "Kochi",       state: "Kerala",         lineCount: 1,  stationCount: "25 live",           liveStations: 25,  totalStations: 25,  status: "operational", color: "#00BFA5", emoji: "⛵" },
  { slug: "nagpur",      name: "Nagpur",      state: "Maharashtra",    lineCount: 2,  stationCount: "37 live",           liveStations: 37,  totalStations: 36,  status: "operational", color: "#FF8F00", emoji: "🍊" },
  { slug: "navi_mumbai", name: "Navi Mumbai", state: "Maharashtra",    lineCount: 1,  stationCount: "11 live",           liveStations: 11,  totalStations: 11,  status: "operational", color: "#546E7A", emoji: "🏗️" },
  { slug: "meerut",      name: "Meerut",      state: "Uttar Pradesh",  lineCount: 1,  stationCount: "12 live + 1 UC",   liveStations: 12,  totalStations: 13,  status: "partial",     color: "#558B2F", emoji: "🚄" },
  { slug: "agra",        name: "Agra",        state: "Uttar Pradesh",  lineCount: 2,  stationCount: "6 live + 21 UC",   liveStations: 6,   totalStations: 27,  status: "partial",     color: "#6A1B9A", emoji: "🕍" },
  { slug: "indore",      name: "Indore",      state: "Madhya Pradesh", lineCount: 1,  stationCount: "5 live + 24 UC",   liveStations: 5,   totalStations: 29,  status: "partial",     color: "#AD1457", emoji: "🍛" },
  { slug: "bhopal",      name: "Bhopal",      state: "Madhya Pradesh", lineCount: 2,  stationCount: "8 live + 21 UC",   liveStations: 8,   totalStations: 29,  status: "partial",     color: "#2E7D32", emoji: "🌊" },
  { slug: "patna",       name: "Patna",       state: "Bihar",          lineCount: 2,  stationCount: "4 live + 20 UC",   liveStations: 4,   totalStations: 24,  status: "partial",     color: "#4527A0", emoji: "🛕" },
];

const RECENTS_KEY = "indmetro:recentCities";
const MAX_RECENTS = 5;

function readRecents(): string[] {
  try {
    const v = localStorage.getItem(RECENTS_KEY);
    return v ? JSON.parse(v) : [];
  } catch { return []; }
}

function saveRecent(slug: string) {
  try {
    const prev = readRecents().filter((s) => s !== slug);
    localStorage.setItem(RECENTS_KEY, JSON.stringify([slug, ...prev].slice(0, MAX_RECENTS)));
  } catch { /* ignore */ }
}

/** Feature 8: status chip */
function StatusChip({ city }: { city: City }) {
  if (city.status === "operational") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700 dark:text-green-400">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
        {city.liveStations} stations
      </span>
    );
  }
  if (city.status === "partial") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 dark:text-amber-400">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
        {city.liveStations}/{city.totalStations} live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground inline-block" />
      Coming soon
    </span>
  );
}

export default function CityPicker() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Feature 5: recently visited
  const [recents, setRecents] = useState<string[]>([]);
  useEffect(() => { setRecents(readRecents()); }, []);

  const handleNavigate = useCallback((slug: string) => {
    saveRecent(slug);
    navigate(`/${slug}`);
  }, [navigate]);

  const clearRecents = () => {
    try { localStorage.removeItem(RECENTS_KEY); } catch { /* ignore */ }
    setRecents([]);
  };

  const recentCities = recents.map((s) => CITIES.find((c) => c.slug === s)).filter(Boolean) as City[];

  const filtered = CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
  );

  const operational = filtered.filter((c) => c.status !== "wip");
  const wip = filtered.filter((c) => c.status === "wip");

  let homeCity: string | null = null;
  let userName: string | null = null;
  try {
    const ob = localStorage.getItem("indmetro:onboarding:v1");
    if (ob) {
      const parsed = JSON.parse(ob);
      homeCity = parsed.homeCity ?? null;
      userName = parsed.name ?? null;
    }
  } catch { /* ignore */ }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="px-4 pt-10 pb-5 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="flex items-center gap-3 mb-4">
          <IndMetroLogo size={44} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight leading-tight">IndMetro</h1>
            <p className="text-xs text-muted-foreground">India's unified metro guide</p>
          </div>
        </div>

        {userName && (
          <p className="text-sm text-muted-foreground mb-3">
            Hey <span className="font-medium text-foreground">{userName}</span> 👋 pick your city
          </p>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city or state…"
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="px-4 pb-16">
        {/* Home city quick access */}
        {homeCity && !search && (() => {
          const c = CITIES.find((x) => x.slug === homeCity);
          if (!c) return null;
          return (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Your city</p>
              <button
                onClick={() => handleNavigate(c.slug)}
                className="w-full text-left rounded-2xl border-2 mb-5 overflow-hidden active:scale-[0.98] transition-all shadow-sm"
                style={{ borderColor: c.color + "60" }}
              >
                <div className="px-4 py-3 flex items-center gap-3" style={{ background: c.color + "15" }}>
                  <span className="text-3xl">{c.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-base">{c.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground">{c.state}</p>
                      <StatusChip city={c} />
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </button>
            </>
          );
        })()}

        {/* Feature 5: Recently visited cities */}
        {recentCities.length > 0 && !search && (
          <>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Recent
              </p>
              <button
                onClick={clearRecents}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-3 mb-4 -mx-4 px-4 scrollbar-none">
              {recentCities.map((city) => (
                <button
                  key={city.slug}
                  onClick={() => handleNavigate(city.slug)}
                  className="flex-shrink-0 w-28 text-left rounded-2xl border border-border bg-card px-3 py-3 active:scale-[0.97] transition-all shadow-sm"
                  style={{ borderTopColor: city.color, borderTopWidth: 3 }}
                >
                  <span className="text-xl block mb-1.5">{city.emoji}</span>
                  <p className="font-semibold text-xs leading-tight">{city.name}</p>
                  <div className="mt-1">
                    <StatusChip city={city} />
                  </div>
                  <Clock className="h-3 w-3 text-muted-foreground mt-1.5" />
                </button>
              ))}
            </div>
          </>
        )}

        {/* All cities grid */}
        {operational.length > 0 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              {search ? `Results (${operational.length})` : "All cities"}
            </p>
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {operational.map((city) => (
                <button
                  key={city.slug}
                  onClick={() => handleNavigate(city.slug)}
                  className="text-left rounded-2xl border border-border bg-card px-3 py-3.5 hover:border-primary/40 transition-all active:scale-[0.97] shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{city.emoji}</span>
                    <span className="h-2 w-2 rounded-full mt-1" style={{ background: city.color }} />
                  </div>
                  <p className="font-semibold text-sm leading-tight">{city.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{city.state}</p>
                  {/* Feature 8: status chip in grid card */}
                  <div className="mt-2">
                    <StatusChip city={city} />
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">{city.lineCount} line{city.lineCount !== 1 ? "s" : ""}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Coming soon */}
        {wip.length > 0 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Coming soon</p>
            <div className="grid grid-cols-2 gap-2">
              {wip.map((city) => (
                <div key={city.slug} className="bg-muted/40 border border-border rounded-xl px-3 py-3 opacity-60">
                  <span className="text-xl mb-1 block">{city.emoji}</span>
                  <p className="font-medium text-sm">{city.name}</p>
                  <p className="text-xs text-muted-foreground">{city.state}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No cities found for "{search}"</p>
            <p className="text-xs text-muted-foreground mt-1">Check the spelling and try again</p>
          </div>
        )}
      </div>
    </div>
  );
}
