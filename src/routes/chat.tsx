import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Trash2, Sparkles, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { runAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — AI Workplace" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Write an email to my manager about a delayed project.",
  "Summarize these meeting notes: ...",
  "Plan my week around 3 major deliverables.",
  "Explain cloud computing to a non-technical colleague.",
  "Create an agenda for a 45-minute product review.",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await runAI({
        data: {
          system: "You are a helpful AI workplace assistant. Help professionals with productivity tasks. Be concise, actionable, and professional. Use Markdown when helpful.",
          messages: next,
        },
      });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
      setMessages(next);
    } finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 flex flex-col h-[calc(100vh-11rem)]">
      <PageHeader icon={MessageSquare} title="AI Workplace Chatbot" description="Your always-on productivity companion"
        actions={<Button variant="outline" onClick={() => setMessages([])}><Trash2 className="h-4 w-4" /> Clear</Button>}
      />
      <AIDisclaimer />

      <Card className="glass-card flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 flex flex-col p-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary shadow-[var(--shadow-elegant)]">
                  <Sparkles className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">How can I help you today?</h3>
                  <p className="text-sm text-muted-foreground">Try one of these suggestions</p>
                </div>
                <div className="grid gap-2 w-full max-w-md">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)}
                      className="text-left text-sm rounded-xl border border-border/60 bg-card/50 p-3 hover:border-primary/40 hover:bg-accent/30 transition-all">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${m.role === "user" ? "bg-primary/15" : "gradient-primary"}`}>
                  {m.role === "user" ? <User className="h-4 w-4 text-primary" /> : <Sparkles className="h-4 w-4 text-primary-foreground" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full gradient-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border/60 p-3">
            <div className="flex gap-2 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask anything about work..."
                rows={1}
                className="resize-none min-h-[44px] max-h-32"
              />
              <Button onClick={() => send()} disabled={loading || !input.trim()} className="gradient-primary text-primary-foreground shrink-0">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground text-center">Press Enter to send · Shift+Enter for newline</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
