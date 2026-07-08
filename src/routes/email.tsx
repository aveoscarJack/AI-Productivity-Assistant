import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Copy, Download, Trash2, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { runAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — AI Workplace" }] }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [type, setType] = useState("Client");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Professional");
  const [extra, setExtra] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!recipient || !purpose) {
      toast.error("Please provide recipient name and email purpose.");
      return;
    }
    setLoading(true);
    try {
      const res = await runAI({
        data: {
          system:
            "You are an expert business communication assistant. Write a professional email using the provided information. Use the selected tone and audience while maintaining excellent grammar. Return ONLY the email body with a subject line at the top prefixed by 'Subject:'.",
          messages: [
            {
              role: "user",
              content: `Recipient Name: ${recipient}\nRecipient Type: ${type}\nTone: ${tone}\nPurpose: ${purpose}\nAdditional Info: ${extra}`,
            },
          ],
        },
      });
      setOutput(res.text);
      toast.success("Email generated!");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  }

  function download() {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    setRecipient("");
    setPurpose("");
    setExtra("");
    setOutput("");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader icon={Mail} title="Smart Email Generator" description="Draft professional emails in seconds" />
      <AIDisclaimer />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Email Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Recipient Name</Label>
              <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah Johnson" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Recipient Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Client", "Manager", "Team Member", "HR", "Customer"].map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Formal", "Friendly", "Persuasive", "Professional", "Apology", "Follow-up"].map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Email Purpose</Label>
              <Textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="What is this email about?" rows={3} />
            </div>
            <div className="grid gap-2">
              <Label>Additional Information</Label>
              <Textarea value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Context, deadlines, specific points to include..." rows={4} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={generate} disabled={loading} className="gradient-primary text-primary-foreground">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Email
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <Trash2 className="h-4 w-4" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Generated Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your AI-generated email will appear here. You can edit it directly."
              rows={18}
              className="font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={copy} disabled={!output}>
                <Copy className="h-4 w-4" /> Copy
              </Button>
              <Button variant="outline" onClick={download} disabled={!output}>
                <Download className="h-4 w-4" /> Download TXT
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
