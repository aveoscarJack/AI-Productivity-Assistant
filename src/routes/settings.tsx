import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Trash2, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PageHeader } from "@/components/page-header";
import { useTheme } from "@/components/theme-provider";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — AI Workplace" }] }),
  component: SettingsPage,
});

const ACCENTS = [
  { name: "Blue", value: "255" },
  { name: "Indigo", value: "270" },
  { name: "Cyan", value: "220" },
  { name: "Violet", value: "285" },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [font, setFont] = useState([16]);
  const [notif, setNotif] = useState(true);
  const [accent, setAccent] = useState("255");

  function applyAccent(hue: string) {
    setAccent(hue);
    document.documentElement.style.setProperty("--primary", `oklch(0.55 0.2 ${hue})`);
    document.documentElement.style.setProperty("--primary-glow", `oklch(0.72 0.18 ${hue})`);
    document.documentElement.style.setProperty("--ring", `oklch(0.55 0.2 ${hue})`);
    toast.success("Accent updated");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader icon={SettingsIcon} title="Settings" description="Customize your workspace" />

      <Card className="glass-card">
        <CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Theme and colors</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Toggle light or dark theme</p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex flex-wrap gap-2">
              {ACCENTS.map(a => (
                <button key={a.value} onClick={() => applyAccent(a.value)}
                  className={`h-10 w-10 rounded-xl border-2 transition-all ${accent === a.value ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ background: `oklch(0.55 0.2 ${a.value})` }}
                  title={a.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Font Size: {font[0]}px</Label>
            <Slider value={font} onValueChange={setFont} min={12} max={20} step={1} />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>AI Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><Label>Enable notifications</Label><p className="text-xs text-muted-foreground">Get notified when AI outputs are ready</p></div>
            <Switch checked={notif} onCheckedChange={setNotif} />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Save history</Label><p className="text-xs text-muted-foreground">Store recent generations locally</p></div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-destructive/30">
        <CardHeader><CardTitle className="text-destructive">Danger Zone</CardTitle></CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => toast.success("History cleared")}>
            <Trash2 className="h-4 w-4" /> Clear All History
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
