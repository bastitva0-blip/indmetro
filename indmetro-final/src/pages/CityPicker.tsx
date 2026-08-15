import { useNavigate } from "react-router-dom";
import { Train, MapPin, Clock, CheckCircle2, Wrench } from "lucide-react";

interface City {
  slug: string;
  name: string;
  state: string;
  lineCount: number;
  stationCount: string;
  status: "operational" | "partial" | "wip";
}

const CITIES: City[] = [
  { slug: "lucknow", name: "Lucknow", state: "Uttar Pradesh", lineCount: 2, stationCount: "21 live + 12 WIP", status: "operational" },
  { slug: "kanpur", name: "Kanpur", state: "Uttar Pradesh", lineCount: 1, stationCount: "14 live + 8 WIP", status: "operational" },
  { slug: "agra", name: "Agra", state: "Uttar Pradesh", lineCount: 2, stationCount: "6 live + 21 UC", status: "operational" },
  { slug: "delhi", name: "Delhi", state: "Delhi NCT", lineCount: 10, stationCount: "271+ live", status: "operational" },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", lineCount: 1, stationCount: "11 live", status: "operational" },
  { slug: "kochi", name: "Kochi", state: "Kerala", lineCount: 1, stationCount: "25 live", status: "operational" },
  { slug: "bangalore", name: "Bangalore", state: "Karnataka", lineCount: 3, stationCount: "81 live", status: "operational" },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", lineCount: 3, stationCount: "58 live", status: "operational" },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", lineCount: 2, stationCount: "39 live + 11 UC", status: "operational" },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", lineCount: 5, stationCount: "69 live", status: "operational" },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", lineCount: 4, stationCount: "50 live", status: "operational" },
  { slug: "pune", name: "Pune", state: "Maharashtra", lineCount: 2, stationCount: "30 live", status: "operational" },
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat", lineCount: 2, stationCount: "34 live", status: "operational" },
  { slug: "nagpur", name: "Nagpur", state: "Maharashtra", lineCount: 2, stationCount: "37 live", status: "operational" },
  { slug: "gurgaon", name: "Gurgaon", state: "Haryana", lineCount: 1, stationCount: "11 live", status: "operational" },
  { slug: "noida", name: "Noida", state: "Uttar Pradesh", lineCount: 1, stationCount: "21 live", status: "operational" },
  { slug: "patna", name: "Patna", state: "Bihar", lineCount: 2, stationCount: "3 live + 23 UC", status: "operational" },
  { slug: "indore", name: "Indore", state: "Madhya Pradesh", lineCount: 1, stationCount: "5 live + 24 UC", status: "operational" },
  { slug: "bhopal", name: "Bhopal", state: "Madhya Pradesh", lineCount: 2, stationCount: "8 live + 21 UC", status: "operational" },
  { slug: "navi_mumbai", name: "Navi Mumbai", state: "Maharashtra", lineCount: 1, stationCount: "11 live", status: "operational" },
  { slug: "meerut", name: "Meerut", state: "Uttar Pradesh", lineCount: 1, stationCount: "12 live + 1 UC", status: "operational" },
];

const StatusBadge = ({ status }: { status: City["status"] }) => {
  if (status === "operational")
    return (
      <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
        <CheckCircle2 className="w-3 h-3" /> Live
      </span>
    );
  if (status === "partial")
    return (
      <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 font-medium">
        <Clock className="w-3 h-3" /> Partial
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
      <Wrench className="w-3 h-3" /> Coming soon
    </span>
  );
};

export default function CityPicker() {
  const navigate = useNavigate();

  const handleCityClick = (city: City) => {
    if (city.status === "operational") {
      navigate(`/${city.slug}`);
    }
  };

  const operational = CITIES.filter((c) => c.status === "operational");
  const rest = CITIES.filter((c) => c.status !== "operational");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="px-4 pt-12 pb-6 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Train className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">IndMetro</h1>
            <p className="text-xs text-muted-foreground">India's unified metro guide</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-12">
        {/* Operational cities */}
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Available now
        </p>
        <div className="flex flex-col gap-3 mb-8">
          {operational.map((city) => (
            <button
              key={city.slug}
              onClick={() => handleCityClick(city)}
              className="w-full text-left bg-card border border-border rounded-2xl px-4 py-4 hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-[0.98] shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-base">{city.name}</p>
                  <p className="text-xs text-muted-foreground">{city.state}</p>
                </div>
                <StatusBadge status={city.status} />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {city.stationCount} stations
                </span>
                <span className="text-xs text-muted-foreground">
                  {city.lineCount} line{city.lineCount > 1 ? "s" : ""}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Coming soon */}
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Coming soon
        </p>
        <div className="grid grid-cols-2 gap-2">
          {rest.map((city) => (
            <div
              key={city.slug}
              className="bg-muted/40 border border-border rounded-xl px-3 py-3 opacity-70"
            >
              <p className="font-medium text-sm">{city.name}</p>
              <p className="text-xs text-muted-foreground">{city.state}</p>
              <StatusBadge status={city.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
