import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export const APP_VERSION = "2.1.0";

interface ChangeEntry {
  emoji: string;
  text: string;
}

const CHANGELOG: ChangeEntry[] = [
  { emoji: "↕️",  text: "Swap origin & destination with one tap in the route planner" },
  { emoji: "💰",  text: "Fare animates smoothly when route changes" },
  { emoji: "⚡",  text: "Skeleton loaders — no more empty spinners" },
  { emoji: "📴",  text: "Offline banner tells you when you lose & regain connection" },
  { emoji: "📳",  text: "Haptic feedback on route found, journey start & arrival" },
  { emoji: "🕐",  text: "Recently visited cities float to the top of the city picker" },
  { emoji: "🔴",  text: "Live station count & status chips on every city card" },
  { emoji: "🔋",  text: "Smart card balance shows as a visual fill bar" },
  { emoji: "🔤",  text: "Text size toggle — Small, Medium, or Large" },
  { emoji: "✨",  text: "Reduce Motion setting for those who prefer less animation" },
];

const LS_KEY = "indmetro:lastSeenVersion";

export function WhatsNewSheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(LS_KEY);
      if (seen !== APP_VERSION) setOpen(true);
    } catch { /* ignore */ }
  }, []);

  const dismiss = () => {
    setOpen(false);
    try { localStorage.setItem(LS_KEY, APP_VERSION); } catch { /* ignore */ }
  };

  return (
    <Drawer open={open} onOpenChange={(o) => { if (!o) dismiss(); }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-lg">What's new in IndMetro {APP_VERSION}</DrawerTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Here's what we shipped in this update</p>
        </DrawerHeader>

        <div className="px-4 pb-2 space-y-2.5 max-h-[55vh] overflow-y-auto">
          {CHANGELOG.map((entry, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xl leading-none mt-0.5 shrink-0">{entry.emoji}</span>
              <p className="text-sm text-foreground/90 leading-snug">{entry.text}</p>
            </div>
          ))}
        </div>

        <div className="px-4 pb-6 pt-4">
          <Button onClick={dismiss} className="w-full rounded-xl h-11">
            Got it 👍
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default WhatsNewSheet;
