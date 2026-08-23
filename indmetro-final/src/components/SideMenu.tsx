import { useState } from "react";
import { Info, Wallet, BookOpen, Download, ChevronLeft, Type, Zap, Bell } from "lucide-react";
import IndMetroLogo from "@/components/icons/IndMetroLogo";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useGoSmartCard } from "@/contexts/GoSmartCardContext";
import ThemeToggle from "@/components/ThemeToggle";
import AboutDialog from "@/components/AboutDialog";
import CardBalanceDialog from "@/components/CardBalanceDialog";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { useReduceMotion } from "@/hooks/use-reduce-motion";
import { useFontSize, type FontSize } from "@/hooks/use-font-size";
import { requestNotificationPermission } from "@/lib/pushNotifications";

interface SideMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenTips: () => void;
}

/** Smart card balance fill bar */
function BalanceBar({ balance }: { balance: number }) {
  const MAX_BALANCE = 500;
  const pct = Math.min(100, Math.round((balance / MAX_BALANCE) * 100));
  const color =
    pct > 50 ? "#16a34a" : pct > 20 ? "#d97706" : "#dc2626";

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Balance</span>
        <span className="font-medium" style={{ color }}>
          {pct < 20 ? "Low balance" : `${pct}%`}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

const FONT_OPTIONS: { label: string; value: FontSize }[] = [
  { label: "S", value: "sm" },
  { label: "M", value: "md" },
  { label: "L", value: "lg" },
];

export const SideMenu = ({ open, onOpenChange, onOpenTips }: SideMenuProps) => {
  const { hasGoSmartCard, setHasGoSmartCard, balance } = useGoSmartCard();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);
  const { canInstall, triggerInstall } = useInstallPrompt();
  const navigate = useNavigate();
  const [reduceMotion, toggleReduceMotion] = useReduceMotion();
  const [notifEnabled, setNotifEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem("indmetro:pushEnabled") === "true"; } catch { return false; }
  });
  const toggleNotif = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      const next = !notifEnabled;
      setNotifEnabled(next);
      try { localStorage.setItem("indmetro:pushEnabled", String(next)); } catch { /**/ }
    }
  };
  const [fontSize, setFontSize] = useFontSize();

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <IndMetroLogo size={36} />
                <div>
                  <DrawerTitle>IndMetro</DrawerTitle>
                  <p className="text-xs text-muted-foreground">India's metro companion</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </DrawerHeader>

          <div className="px-4 pb-6 space-y-4 overflow-y-auto">
            {/* Back to city picker */}
            <button
              onClick={() => { onOpenChange(false); navigate("/"); }}
              className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-2 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              All cities
            </button>
            <Separator />

            {/* Smart card toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-3">
              <div id="gosmartcard-label">
                <p className="text-sm font-medium">GoSmart Card</p>
                <p className="text-xs text-muted-foreground">10% discount on every journey</p>
              </div>
              <Switch
                checked={hasGoSmartCard}
                onCheckedChange={setHasGoSmartCard}
                aria-labelledby="gosmartcard-label"
              />
            </div>

            {/* Balance button + bar */}
            <button
              onClick={() => setBalanceOpen(true)}
              className="w-full rounded-lg px-3 py-3 hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Card balance</span>
                </span>
                <span className="text-sm font-semibold text-muted-foreground">₹{balance.toFixed(0)}</span>
              </div>
              {/* Feature 3: visual fill bar */}
              <BalanceBar balance={balance} />
            </button>

            <button
              onClick={onOpenTips}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-secondary/50 transition-colors text-left"
            >
              <Info className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Fares, hours &amp; tips</span>
            </button>

            <button
              onClick={() => setAboutOpen(true)}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-secondary/50 transition-colors text-left"
            >
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">About &amp; privacy</span>
            </button>

            <Separator />

            {/* Feature 7: Font size toggle */}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="flex items-center gap-3">
                <Type className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Text size</span>
              </span>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                {FONT_OPTIONS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setFontSize(value)}
                    className={[
                      "w-8 h-7 rounded-md text-xs font-semibold transition-colors",
                      fontSize === value
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                    aria-pressed={fontSize === value}
                    aria-label={`Font size ${value}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature 6: Reduce motion toggle */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <span className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Reduce motion</p>
                  <p className="text-xs text-muted-foreground">Disable animations</p>
                </div>
              </span>
              <Switch
                checked={reduceMotion}
                onCheckedChange={toggleReduceMotion}
                aria-label="Reduce motion"
              />
            </div>

            {/* Feature 41: Push notification toggle */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2 min-h-[44px]">
              <span className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Train alerts</p>
                  <p className="text-xs text-muted-foreground">First &amp; last train reminders</p>
                </div>
              </span>
              <Switch checked={notifEnabled} onCheckedChange={toggleNotif} aria-label="Train alerts" />
            </div>

            {canInstall && (
              <>
                <Separator />
                <button
                  onClick={triggerInstall}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-3 bg-primary/10 hover:bg-primary/20 transition-colors text-left"
                >
                  <Download className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-primary">Install IndMetro</p>
                    <p className="text-xs text-muted-foreground">Add to home screen</p>
                  </div>
                </button>
              </>
            )}

            <Separator />

            <div className="text-center space-y-1.5 pt-1">
              <p className="text-xs text-muted-foreground">Built by</p>
              <p className="text-sm font-medium">Astitva Bhardwaj</p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
      <CardBalanceDialog open={balanceOpen} onOpenChange={setBalanceOpen} />
    </>
  );
};

export default SideMenu;
