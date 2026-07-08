import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, Shield, Scale, AlertTriangle, Keyboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help & Ethics — AI Workplace" }] }),
  component: HelpPage,
});

function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader icon={HelpCircle} title="Help & Responsible AI" description="Using AI at work, responsibly" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Privacy Notice</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Your inputs are sent to our AI provider to generate responses. We do not sell or share your data with third parties.</p>
            <p>Avoid sharing sensitive personal, financial, or confidential business data in prompts.</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Scale className="h-5 w-5 text-primary" /> Ethical AI Statement</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>We are committed to fair, transparent, and accountable AI. AI assists — it does not replace — human judgment.</p>
            <p>All AI-generated content should be reviewed by a human before being used in professional or public settings.</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" /> Bias Warning</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            AI models are trained on large datasets that may reflect societal biases. Outputs may unintentionally reinforce stereotypes.
            Review generated content critically, especially when it involves people, decisions, or evaluations.
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Keyboard className="h-5 w-5 text-primary" /> Keyboard Shortcuts</CardTitle>
            <CardDescription>Move faster with your keyboard</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {[
              { k: "Enter", d: "Send message in chat" },
              { k: "Shift + Enter", d: "New line" },
              { k: "⌘/Ctrl + K", d: "Focus search" },
              { k: "⌘/Ctrl + B", d: "Toggle sidebar" },
            ].map(s => (
              <div key={s.k} className="flex items-center justify-between">
                <span className="text-muted-foreground">{s.d}</span>
                <Badge variant="outline" className="font-mono">{s.k}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle>Frequently Asked Questions</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          {[
            { q: "Is my data stored?", a: "History is stored locally in your browser unless you clear it in Settings." },
            { q: "Which AI model powers this?", a: "We use a fast, capable general-purpose model tuned for professional use cases." },
            { q: "Can I edit AI outputs?", a: "Yes — every generated output is editable directly in the app before you copy or download it." },
            { q: "Is this suitable for regulated industries?", a: "Always follow your organization's compliance requirements; avoid pasting regulated data." },
          ].map((f, i) => (
            <div key={i}>
              <p className="font-medium">{f.q}</p>
              <p className="text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
