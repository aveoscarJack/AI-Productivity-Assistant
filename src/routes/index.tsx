import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListTodo,
  Search,
  MessageSquare,
  BookMarked,
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
  Activity,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — AI Workplace" }] }),
  component: Dashboard,
});

const quickActions = [
  { title: "Write an Email", to: "/email", icon: Mail, color: "from-blue-500 to-cyan-500" },
  { title: "Summarize Notes", to: "/meetings", icon: FileText, color: "from-indigo-500 to-blue-500" },
  { title: "Plan Tasks", to: "/tasks", icon: ListTodo, color: "from-sky-500 to-blue-600" },
  { title: "Research Topic", to: "/research", icon: Search, color: "from-cyan-500 to-blue-500" },
  { title: "Ask the Chatbot", to: "/chat", icon: MessageSquare, color: "from-blue-600 to-indigo-600" },
  { title: "Browse Prompts", to: "/prompts", icon: BookMarked, color: "from-blue-500 to-purple-500" },
];

const stats = [
  { label: "AI Tasks Completed", value: "148", change: "+12%", icon: Zap },
  { label: "Hours Saved", value: "37.5", change: "+8%", icon: Clock },
  { label: "Productivity Score", value: "92%", change: "+4%", icon: TrendingUp },
  { label: "Active Streak", value: "14 days", change: "🔥", icon: Activity },
];

const recentOutputs = [
  { title: "Follow-up email to Client X", type: "Email", time: "2h ago" },
  { title: "Q4 planning meeting summary", type: "Summary", time: "5h ago" },
  { title: "Weekly sprint schedule", type: "Plan", time: "1d ago" },
  { title: "Cloud architecture research", type: "Research", time: "2d ago" },
];

const tips = [
  "Be specific about tone and audience for better email results.",
  "Provide context and constraints to get more accurate summaries.",
  "Break large tasks into smaller ones for a clearer schedule.",
  "Always fact-check AI outputs before sharing externally.",
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        icon={Sparkles}
        title="Welcome back, Jordan 👋"
        description="Your AI-powered workplace, ready to save you hours today."
        actions={
          <Button asChild className="gradient-primary text-primary-foreground shadow-[var(--shadow-elegant)]">
            <Link to="/chat">
              <MessageSquare className="h-4 w-4" /> Ask AI
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass-card overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <s.icon className="h-5 w-5 text-primary" />
                <Badge variant="secondary" className="text-xs">{s.change}</Badge>
              </div>
              <div className="mt-3 text-2xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump into any AI tool with one click</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((a) => (
            <Link
              key={a.title}
              to={a.to}
              className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card/50 p-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-glass)]"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground transition-transform group-hover:scale-110">
                <a.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{a.title}</span>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Usage */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle>AI Usage This Week</CardTitle>
            <CardDescription>Distribution across your AI tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Smart Email", pct: 78 },
              { name: "Meeting Summaries", pct: 62 },
              { name: "Task Planner", pct: 48 },
              { name: "Research Assistant", pct: 34 },
              { name: "Chatbot", pct: 88 },
            ].map((r) => (
              <div key={r.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-muted-foreground">{r.pct}%</span>
                </div>
                <Progress value={r.pct} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-warning" /> Prompting Tips
            </CardTitle>
            <CardDescription>Get better AI results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tips.map((t, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-muted-foreground">{t}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recently Generated</CardTitle>
            <CardDescription>Your latest AI outputs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentOutputs.map((o, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border/40 p-3 hover:bg-accent/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{o.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.type} · {o.time}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>What you've done today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
              {[
                { t: "9:12", text: "Generated onboarding email for new hire" },
                { t: "10:45", text: "Summarized product roadmap meeting" },
                { t: "13:20", text: "Planned Q4 launch tasks" },
                { t: "15:05", text: "Researched competitor pricing" },
              ].map((e, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[22px] top-1 h-3 w-3 rounded-full gradient-primary ring-4 ring-background" />
                  <p className="text-sm font-medium">{e.text}</p>
                  <p className="text-xs text-muted-foreground">Today · {e.t}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
