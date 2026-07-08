import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListTodo, Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { runAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner — AI Workplace" }] }),
  component: TasksPage,
});

type Task = { id: string; name: string; due: string; priority: "High" | "Medium" | "Low" };

const priorityColor: Record<Task["priority"], string> = {
  High: "bg-destructive/15 text-destructive border-destructive/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Low: "bg-success/15 text-success border-success/30",
};

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Prepare Q4 launch deck", due: "2026-07-15", priority: "High" },
    { id: "2", name: "Review pull requests", due: "2026-07-10", priority: "Medium" },
  ]);
  const [name, setName] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const [hours, setHours] = useState("8");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  function add() {
    if (!name) return;
    setTasks([...tasks, { id: crypto.randomUUID(), name, due, priority }]);
    setName(""); setDue("");
  }

  async function plan() {
    if (tasks.length === 0) { toast.error("Add tasks first"); return; }
    setLoading(true);
    try {
      const list = tasks.map(t => `- [${t.priority}] ${t.name} (due ${t.due || "no date"})`).join("\n");
      const res = await runAI({
        data: {
          system: "Organize the given tasks using urgency and importance (Eisenhower matrix). Produce a clearly formatted Markdown output with sections: **Daily Schedule** (time-blocked), **Weekly Planner**, **Priority Matrix** (Urgent/Important quadrants), **Estimated Time**, and **Productivity Tips**.",
          messages: [{ role: "user", content: `Working hours per day: ${hours}\nTasks:\n${list}` }],
        },
      });
      setOutput(res.text);
      toast.success("Schedule generated");
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader icon={ListTodo} title="AI Task Planner" description="Turn a task list into an optimized schedule" />
      <AIDisclaimer />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader><CardTitle>Your Tasks</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Input placeholder="Task name" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
                <Select value={priority} onValueChange={(v) => setPriority(v as Task["priority"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={add}><Plus className="h-4 w-4" /> Add Task</Button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.due || "No date"}</p>
                  </div>
                  <Badge className={priorityColor[t.priority]} variant="outline">{t.priority}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => setTasks(tasks.filter(x => x.id !== t.id))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <div>
                <label className="text-xs text-muted-foreground">Working hours / day</label>
                <Input type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
              </div>
              <Button onClick={plan} disabled={loading} className="gradient-primary text-primary-foreground mt-4">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle>Your Optimized Plan</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={output} readOnly rows={24} className="font-mono text-sm" placeholder="Your daily & weekly schedule with priority matrix will appear here." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
