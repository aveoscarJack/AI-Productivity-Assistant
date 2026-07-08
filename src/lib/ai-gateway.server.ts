export async function callAI(opts: {
  system?: string;
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  model?: string;
}): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const messages = [
    ...(opts.system ? [{ role: "system" as const, content: opts.system }] : []),
    ...opts.messages,
  ];

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: opts.model ?? "google/gemini-3-flash-preview",
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Rate limit exceeded. Please try again shortly.");
    if (res.status === 402)
      throw new Error("AI credits exhausted. Please add credits in workspace settings.");
    throw new Error(`AI request failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content ?? "";
}
