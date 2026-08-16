import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainFront, ShieldCheck, ExternalLink, Linkedin, Heart, Globe } from "lucide-react";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutDialog = ({ open, onOpenChange }: AboutDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrainFront className="h-5 w-5 text-primary" /> About IndMetro
          </DialogTitle>
          <DialogDescription>India's unified metro companion — all 21 cities, one app.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="why">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="why">Why</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
          </TabsList>

          <TabsContent value="why" className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              India now has 21 metro systems across cities as different as Lucknow,
              Kochi, and Delhi. Every city has its own fares, headways, smart card,
              and quirks — but there is no single app that handles all of them well.
              Official sites are built for press releases, not commuters.
            </p>
            <p>
              <strong className="text-foreground">IndMetro</strong> gives every city
              the same three things a rider actually needs: when the next train is,
              what the fare will be, and the fastest route there. City-specific smart
              card names, fare slabs, peak hours, interchange logic — all handled
              correctly, per city.
            </p>
            <p>
              No ads, no accounts, no clutter. Works fully offline once loaded.
              IndMetro is an independent project, not affiliated with any metro
              authority.
            </p>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <div className="flex gap-2.5 rounded-lg bg-secondary/30 p-3">
              <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p>
                IndMetro is an independent app. It is not affiliated with UPMRC,
                DMRC, BMRCL, or any other metro authority. Timings and fares are
                sourced from each city's official operator website.
              </p>
            </div>
            <p>
              <strong className="text-foreground">No accounts, no servers.</strong> IndMetro
              has no backend or database of any kind. Your smart card preference,
              balance tracker, journey history, and theme choice are all stored
              locally in your browser and never sent anywhere.
            </p>
            <p>
              <strong className="text-foreground">Card balance tracker</strong> is a manual
              log you control entirely. It does not read your physical smart card —
              it keeps a running total based on amounts you enter yourself,
              on this device only.
            </p>
            <p>
              <strong className="text-foreground">Location</strong> is used only,
              with your permission, to find your nearest station. Your coordinates
              never leave your device.
            </p>
            <p>
              Map tiles load from OpenStreetMap's public servers, which may log
              standard request metadata (like your IP) per their own practices.
              We do not control that.
            </p>
            <p>No analytics, no ads, no third-party trackers. Ever.</p>
          </TabsContent>

          <TabsContent value="credits" className="space-y-4">
            <div className="text-center space-y-1.5 pt-1">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1">
                <TrainFront className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">Astitva Bhardwaj</p>
              <p className="text-xs text-muted-foreground">Designer &amp; developer of IndMetro</p>
              <div className="flex items-center justify-center gap-3 mt-1">
                <a
                  href="https://www.linkedin.com/in/astitva-bhardwajlu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://indmetro.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" /> indmetro.in <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground leading-relaxed">
              <Heart className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <p>
                Built independently from scratch — route planning, live train simulation,
                city-specific fare logic, offline PWA support, interactive maps, and
                Journey Mode across all 21 Indian metro systems. Because every metro
                rider in India deserves a commute app that actually works.
              </p>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Started as LkoMetro (Lucknow only) · Expanded to IndMetro v2 · 21 cities
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;
