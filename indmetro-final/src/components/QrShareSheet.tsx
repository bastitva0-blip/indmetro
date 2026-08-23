import { useEffect, useRef, useState } from "react";
import { Share2, Copy, X, Check } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface QrShareSheetProps {
  open: boolean;
  onClose: () => void;
  citySlug: string;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  fare: number;
  durationMinutes: number;
}

export function QrShareSheet({
  open, onClose, citySlug, fromId, toId, fromName, toName, fare, durationMinutes,
}: QrShareSheetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const url = `https://indmetro.in/${citySlug}?from=${fromId}&to=${toId}`;

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    // Dynamically import qrcode to keep bundle small
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvasRef.current!, url, {
        width: 200,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      }).catch(() => { /* ignore on older browsers */ });
    }).catch(() => { /* qrcode not installed */ });
  }, [open, url]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const shareNative = async () => {
    if (!navigator.share) { copyLink(); return; }
    try {
      await navigator.share({
        title: `IndMetro — ${fromName} → ${toName}`,
        text: `🚇 ${fromName} → ${toName} · ₹${fare} · ~${durationMinutes} min`,
        url,
      });
    } catch { /* user cancelled */ }
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Share this trip</DrawerTitle>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6 flex flex-col items-center gap-5">
          {/* Trip summary */}
          <div className="w-full bg-muted/50 rounded-2xl p-4 text-center space-y-1">
            <p className="text-sm font-semibold">{fromName} → {toName}</p>
            <p className="text-xs text-muted-foreground">₹{fare} · ~{durationMinutes} min</p>
            <p className="text-xs text-muted-foreground break-all mt-1">{url}</p>
          </div>

          {/* QR code */}
          <div className="bg-white p-3 rounded-2xl shadow-md">
            <canvas ref={canvasRef} width={200} height={200} className="rounded-lg" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1 gap-2 h-11" onClick={copyLink}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy link"}
            </Button>
            <Button className="flex-1 gap-2 h-11" onClick={shareNative}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default QrShareSheet;
