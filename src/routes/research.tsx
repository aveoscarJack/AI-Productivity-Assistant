import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { runAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — AI Workplace" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await runAI({
        data: {
          system: "You are a workplace research assistant. Summarize the given topic or article into an easy-to-understand report for professionals. Use Markdown with sections: **Summary**, **Key Insights**, **Important Facts**, **Pros**, **Cons**, **Recommendations**, **Questions for Further Research**.",
          messages: [{ role: "user", content: input }],
        },
      });
      setOutput(res.text);
      toast.success("Research complete");
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader icon={Search} title="AI Research Assistant" description="Turn topics or articles into structured reports" />
      <AIDisclaimer />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader><CardTitle>Topic or Article</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste an article or enter a research topic..." rows={20} />
            <Button onClick={run} disabled={loading} className="gradient-primary text-primary-foreground">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Research
            </Button>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader><CardTitle>Report</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={output} readOnly rows={20} className="font-mono text-sm" placeholder="Insights, pros/cons, and recommendations will appear here." />
            <Button variant="outline" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }} disabled={!output}>
              <Copy className="h-4 w-4" /> Copy
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
