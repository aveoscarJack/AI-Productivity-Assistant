import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { BookMarked, Copy, Star, Search } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/prompts")({
  head: () => ({ meta: [{ title: "Prompt Library — AI Workplace" }] }),
  component: PromptsPage,
});

type Prompt = { id: string; category: string; title: string; text: string };

const PROMPTS: Prompt[] = [
  { id: "e1", category: "Email", title: "Follow-up after meeting", text: "Write a friendly follow-up email to [name] recapping our meeting on [date], key decisions, and next steps." },
  { id: "e2", category: "Email", title: "Polite decline", text: "Draft a professional email politely declining [request], while maintaining the relationship." },
  { id: "m1", category: "Meetings", title: "Meeting agenda", text: "Create a 45-minute meeting agenda for [topic], with time blocks and objectives." },
  { id: "m2", category: "Meetings", title: "Action items extraction", text: "Extract clear action items with owners and deadlines from these notes: [notes]." },
  { id: "r1", category: "Research", title: "Competitor scan", text: "Summarize competitor [name]'s positioning, strengths, weaknesses, and pricing." },
  { id: "r2", category: "Research", title: "Explain like a colleague", text: "Explain [technical concept] to a non-technical colleague in under 200 words." },
  { id: "p1", category: "Planning", title: "Weekly plan", text: "Given my tasks [tasks], produce a realistic weekly plan with time blocks and buffer time." },
  { id: "p2", category: "Planning", title: "Sprint retrospective", text: "Structure a retrospective covering what went well, what didn't, and 3 actionable improvements." },
  { id: "c1", category: "Communication", title: "Difficult conversation", text: "Help me prepare talking points for a difficult conversation with [person] about [topic]." },
  { id: "c2", category: "Communication", title: "Executive summary", text: "Turn this document into a 5-bullet executive summary for a busy leader: [doc]." },
];

const CATEGORIES = ["All", "Email", "Meetings", "Research", "Planning", "Communication"];

function PromptsPage() {
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState<string[]>([]);

  const filtered = useMemo(() => PROMPTS.filter(p =>
    p.title.toLowerCase().includes(q.toLowerCase()) || p.text.toLowerCase().includes(q.toLowerCase())
  ), [q]);

  function toggleFav(id: string) {
    setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  }

  function Card1({ p }: { p: Prompt }) {
    return (
      <Card className="glass-card group hover:-translate-y-0.5 transition-all">
        <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
          <div className="min-w-0">
            <Badge variant="secondary" className="mb-2 text-xs">{p.category}</Badge>
            <CardTitle className="text-base">{p.title}</CardTitle>
          </div>
          <Button size="icon" variant="ghost" onClick={() => toggleFav(p.id)}>
            <Star className={`h-4 w-4 ${favs.includes(p.id) ? "fill-warning text-warning" : ""}`} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3">{p.text}</p>
          <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(p.text); toast.success("Copied"); }}>
            <Copy className="h-4 w-4" /> Copy Prompt
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader icon={BookMarked} title="Prompt Library" description="Reusable prompts, curated for the workplace" />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search prompts..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <Tabs defaultValue="All">
        <TabsList className="flex-wrap h-auto">
          {CATEGORIES.map(c => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
          <TabsTrigger value="Favorites">Favorites ({favs.length})</TabsTrigger>
        </TabsList>
        {CATEGORIES.map(cat => (
          <TabsContent key={cat} value={cat}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.filter(p => cat === "All" || p.category === cat).map(p => <Card1 key={p.id} p={p} />)}
            </div>
          </TabsContent>
        ))}
        <TabsContent value="Favorites">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PROMPTS.filter(p => favs.includes(p.id)).map(p => <Card1 key={p.id} p={p} />)}
            {favs.length === 0 && <p className="text-sm text-muted-foreground col-span-full text-center py-12">No favorites yet. Click the star on any prompt.</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
