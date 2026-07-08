import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Copy, Download, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { runAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — AI Workplace" }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function summarize() {
    if (!notes.trim()) { toast.error("Paste your meeting notes first"); return; }
    setLoading(true);
    try {
      const res = await runAI({
        data: {
          system:
            "Summarize the following meeting notes into clearly labeled sections using Markdown headings: **Executive Summary**, **Key Discussion Points**, **Decisions Made**, **Action Items** (with responsible person and deadline as a table if possible), **Risks**, and **Next Meeting**. Be concise, structured, and highlight priorities.",
          messages: [{ role: "user", content: notes }],
        },
      });
      setOutput(res.text);
      toast.success("Summary ready!");
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader icon={FileText} title="Meeting Notes Summarizer" description="Turn raw notes into structured summaries" />
      <AIDisclaimer />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader><CardTitle>Meeting Notes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your raw meeting notes here..." rows={20} />
            <Button onClick={summarize} disabled={loading} className="gradient-primary text-primary-foreground">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Summarize
            </Button>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader><CardTitle>Structured Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={output} onChange={(e) => setOutput(e.target.value)} rows={20} placeholder="Executive summary, action items, decisions, and more will appear here." className="font-mono text-sm" />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }} disabled={!output}>
                <Copy className="h-4 w-4" /> Copy
              </Button>
              <Button variant="outline" disabled={!output} onClick={() => {
                const b = new Blob([output], { type: "text/plain" });
                const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `summary-${Date.now()}.txt`; a.click();
              }}>
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
