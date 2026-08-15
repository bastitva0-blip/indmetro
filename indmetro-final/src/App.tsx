import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoSmartCardProvider } from "@/contexts/GoSmartCardContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazy, Suspense } from "react";
import NotFound from "@/pages/NotFound";
import { OnboardingFlow } from "@/components/OnboardingFlow";

const CityPicker    = lazy(() => import("@/pages/CityPicker"));
const LucknowApp    = lazy(() => import("@/pages/LucknowApp"));
const KanpurApp     = lazy(() => import("@/pages/KanpurIndex"));
const AgraApp       = lazy(() => import("@/pages/AgraIndex"));
const JaipurApp     = lazy(() => import("@/pages/JaipurIndex"));
const BhopalApp     = lazy(() => import("@/pages/BhopalIndex"));
const PatnaApp      = lazy(() => import("@/pages/PatnaIndex"));
const KochiApp      = lazy(() => import("@/pages/KochiIndex"));
const IndoreApp     = lazy(() => import("@/pages/IndoreIndex"));
const NaviMumbaiApp = lazy(() => import("@/pages/NaviMumbaiIndex"));
const NoidaApp      = lazy(() => import("@/pages/NoidaIndex"));
const GurgaonApp    = lazy(() => import("@/pages/GurgaonIndex"));
const AhmedabadApp  = lazy(() => import("@/pages/AhmedabadIndex"));
const PuneApp       = lazy(() => import("@/pages/PuneIndex"));
const NagpurApp     = lazy(() => import("@/pages/NagpurIndex"));
const MumbaiApp     = lazy(() => import("@/pages/MumbaiIndex"));
const MeerutApp     = lazy(() => import("@/pages/MeerutIndex"));
const BangaloreApp  = lazy(() => import("@/pages/BangaloreIndex"));
const HyderabadApp  = lazy(() => import("@/pages/HyderabadIndex"));
const ChennaiApp    = lazy(() => import("@/pages/ChennaiIndex"));
const DelhiApp      = lazy(() => import("@/pages/DelhiIndex"));
const KolkataApp    = lazy(() => import("@/pages/KolkataIndex"));

const Spinner = () => (
  <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
    Loading…
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <GoSmartCardProvider>
          <TooltipProvider delayDuration={200}>
            <BrowserRouter>
              <OnboardingFlow>
                <Suspense fallback={<Spinner />}>
                  <Routes>
                    <Route path="/"           element={<CityPicker />} />
                    <Route path="/lucknow"    element={<LucknowApp />} />
                    <Route path="/kanpur"     element={<KanpurApp />} />
                    <Route path="/agra"       element={<AgraApp />} />
                    <Route path="/jaipur"     element={<JaipurApp />} />
                    <Route path="/bhopal"     element={<BhopalApp />} />
                    <Route path="/patna"      element={<PatnaApp />} />
                    <Route path="/kochi"      element={<KochiApp />} />
                    <Route path="/indore"     element={<IndoreApp />} />
                    <Route path="/navi_mumbai" element={<NaviMumbaiApp />} />
                    <Route path="/noida"      element={<NoidaApp />} />
                    <Route path="/gurgaon"    element={<GurgaonApp />} />
                    <Route path="/ahmedabad"  element={<AhmedabadApp />} />
                    <Route path="/pune"       element={<PuneApp />} />
                    <Route path="/nagpur"     element={<NagpurApp />} />
                    <Route path="/mumbai"     element={<MumbaiApp />} />
                    <Route path="/meerut"     element={<MeerutApp />} />
                    <Route path="/bangalore"  element={<BangaloreApp />} />
                    <Route path="/hyderabad"  element={<HyderabadApp />} />
                    <Route path="/chennai"    element={<ChennaiApp />} />
                    <Route path="/delhi"      element={<DelhiApp />} />
                    <Route path="/kolkata"    element={<KolkataApp />} />
                    <Route path="*"           element={<NotFound />} />
                  </Routes>
                </Suspense>
              </OnboardingFlow>
            </BrowserRouter>
          </TooltipProvider>
        </GoSmartCardProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
