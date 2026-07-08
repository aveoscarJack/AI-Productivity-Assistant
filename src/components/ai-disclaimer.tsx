import { AlertTriangle } from "lucide-react";

export function AIDisclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs text-muted-foreground">
      <AlertTriangle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
      <p>
        <strong className="text-foreground">Responsible AI:</strong> AI-generated content may contain inaccuracies or biases.
        Always review and verify outputs before using them in professional environments.
      </p>
    </div>
  );
}
